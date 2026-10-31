---
title: "NetherNet common issues"
outline: deep
description: Troubleshooting common WebRTC and NetherNet issues in Axolotl-PM, including 1:1 NAT, candidate resolution failures, port ranges, and reverse proxies.
---

# NetherNet common issues

NetherNet (a WebRTC-based transport layer) establishes a connection in two phases:
1. Signaling (`TCP` HTTP/HTTPS or `UDP 7551` LAN): the client and server exchange SDP offers and answers, cryptographic identity assertions (`a=identity`), and ICE network candidates.
2. Peer connection (`UDP` WebRTC): the client and server run ICE connectivity checks (STUN/TURN), establish a DTLS encrypted session, and open two SCTP DataChannels (`ReliableDataChannel` and `UnreliableDataChannel`).

Because signaling and game traffic travel over different protocols and ports, misconfigurations in NAT, firewalls, or candidate gathering can cause connection failures even when the server appears online in the server list.

## 1:1 NAT and unreachable private IPs (cloud VMs, Docker, home routers)

### Symptom
* The server appears online in the Minecraft server list because `GET /v1/join` over TCP succeeds.
* When attempting to join, the client hangs on "Locating server" or "Connecting to external server" and eventually fails.
* In debug logs (`debug.level: 2`), you may see `Negotiation for <id> failed: Peer did not open both data channels` or `Peer connection entered state FAILED`.

### Why it happens
During WebRTC negotiation, `ext-webrtc` (`libdatachannel`) inspects the operating system's local network interfaces to gather `host` ICE candidates.
* On cloud VMs (AWS EC2, Oracle Cloud, Google Cloud, Azure), the network adapter is assigned a private VPC IP (`10.0.0.x` or `172.31.x.x`), and the cloud provider maps a public IP to it through a 1:1 NAT.
* In Docker containers (default bridge mode) or behind home routers, the server only sees its container or LAN IP (`172.17.0.x` or `192.168.1.x`).
* On hosts with virtual interfaces (Docker bridges, VPNs like WireGuard or Tailscale, virtualization bridges), the server gathers all those internal addresses as `host` candidates.

Without `advertise-addresses`, the server writes these private IP addresses into the SDP answer sent to the client. Players on the public internet then send WebRTC UDP packets to `10.x.x.x` or `172.17.x.x`, which are unroutable.

### How to fix it
Configure `transport.nethernet.advertise-addresses` in `pocketmine.yml` with your server's public WAN IP addresses:

```yaml
transport:
  nethernet:
    ice-udp-mux: true
    port-range: [19132, 19132]
    advertise-addresses:
      - 203.0.113.10 # Replace with your server's public IPv4 (and/or IPv6)
```

When `advertise-addresses` is set:
1. Any locally gathered `host` candidate whose IP is not in `advertise-addresses` is stripped from the SDP answer, so internal, Docker, and VPN IPs are not sent to clients.
2. For each IP listed in `advertise-addresses` that was not locally bound on an interface, NetherNet synthesizes a server-reflexive (`typ srflx`) ICE candidate using the bound UDP port of the first locally gathered UDP host candidate of the same IP family (`IPv4` or `IPv6`).

::: danger 1:1 UDP port forwarding required (no port translation)
Because `advertise-addresses` announces the local UDP port that Axolotl-PM bound to, your router, firewall, or Docker container must forward the UDP port 1:1 without port translation (PAT).
For example, if Axolotl-PM binds to UDP port `19132`, external UDP port `19132` must map to internal UDP port `19132` (`-p 19132:19132/udp` in Docker). Mapping external `25000/udp` to internal `19132/udp` will not work.
:::

## "No local candidates to answer with" (no candidates to resolve)

### Symptom
Players cannot join over HTTP signaling, and with debug logging enabled (`debug.level: 2`), the console logs:
```text
[NetherNet thread/DEBUG]: [HTTP signaling] Refused an offer: No local candidates to answer with
```
Or during negotiation:
```text
[NetherNet thread/DEBUG]: Negotiation for <networkId> failed: No local candidates to answer with
```

### Why it happens
For HTTP signaling, NetherNet uses bundled ICE (`CandidateMode::BUNDLED`), where the HTTP response must contain at least one usable ICE candidate in the SDP answer. This error occurs when candidate gathering finishes with zero candidates remaining after filtering:

1. When `ice-udp-mux` is `false`, every active player connection and ongoing negotiation binds its own dedicated UDP socket from `port-range`. If `port-range: [19132, 19135]` is configured, only 4 UDP ports are available. When a 5th player tries to join, `libdatachannel` cannot bind a UDP port in that range and gathers 0 candidates.
2. All ports in `port-range` are already occupied by another process, such as when `port-range: [19132, 19132]` is set while RakNet or Dedicated Query is already bound to UDP port `19132` on the same IP.
3. To synthesize a server-reflexive (`srflx`) candidate for an IP in `advertise-addresses`, NetherNet needs a local UDP `host` candidate of the same address family (`IPv4` vs `IPv6`) to know which UDP port to advertise. If your server only has IPv4 interfaces (or `server-ip` is set to an IPv4 address), but `advertise-addresses` only contains an IPv6 address (or vice versa), all IPv4 host candidates are dropped because they are not in `advertise-addresses`, and the IPv6 address cannot be advertised because no IPv6 UDP port was gathered.
4. NetherNet passes `server-ip` (when not `0.0.0.0`) as `bindAddress` to `ext-webrtc`. If `server-ip` in `server.properties` is set to an IP that `libdatachannel` cannot use to gather candidates, gathering produces nothing.

### How to fix it
* Enable `ice-udp-mux: true` with `port-range: [19132, 19132]` so all players share a single UDP socket, or make `port-range` large enough to cover your maximum player count plus simultaneous join negotiations.
* If `transport.name` includes both `nethernet,raknet`, RakNet occupies UDP `19132` (`server-port`). Do not include `19132` in `transport.nethernet.port-range` while RakNet or Dedicated Query is using UDP `19132`; use a separate UDP port or range such as `[19134, 19134]` for NetherNet, or disable RakNet (`transport.name: nethernet` and `enable-query: false` if sharing the port).
* Make sure `advertise-addresses` includes an IPv4 address when your server binds to IPv4, and leave `server-ip=0.0.0.0` in `server.properties` unless you need to bind to a specific network interface.

## Client candidates ignored or rejected (`mDNS` / `.local` / non-IP candidates)

### Symptom
In debug logs, you see:
```text
Offer from <networkId> carries X ICE candidates that are malformed or do not name an IP address, skipping them
```
or:
```text
Peer sent a candidate that is malformed or does not name an IP address
```

### Why it happens
`IceCandidate::isAcceptableFromPeer()` requires every peer ICE candidate to contain a literal IPv4 or IPv6 address (`FILTER_VALIDATE_IP`). Candidates containing hostnames or `.local` mDNS addresses are stripped so `libdatachannel` never runs blocking or untrusted DNS lookups on behalf of a connecting peer.

For HTTP signaling (`TransportNegotiator::addSignalingPeerCandidate()`), if a client behind NAT only sends its private LAN IP in its SDP offer, NetherNet inspects the source IP of the HTTP signaling request and injects a synthetic `srflx` remote candidate (`foundation: signaling`) using the client's UDP host port.

### How to fix it
* Because NetherNet uses the HTTP client's IP as a fallback ICE candidate for players behind NAT, having all HTTP requests arrive from `127.0.0.1` (your reverse proxy) without `reverse-proxy.enabled: true` causes NetherNet to try `127.0.0.1` as the client's candidate instead of the player's public IP. Configure `transport.nethernet.builtin-signaling.reverse-proxy` whenever HTTP signaling sits behind a proxy.
* If a custom client or signaling bridge sends only hostname candidates, resolve hostnames to IP literals before submitting the SDP offer, and include at least one UDP host candidate.

## "Timed out gathering ICE candidates" (15-second join delay or failure)

### Symptom
* Joining the server takes up to 15 seconds or fails with:
  ```text
  Negotiation for <networkId> failed: Timed out gathering ICE candidates
  ```
* Even on LAN or direct connections, players experience a long pause before connecting.

### Why it happens
1. Over HTTP signaling, NetherNet waits until `PeerConnection::getGatheringState() === GatheringState::COMPLETE` before building and returning the bundled SDP answer (`DEFAULT_GATHERING_TIMEOUT = 15.0` seconds). If you configure a STUN or TURN server in `transport.nethernet.ice-servers` that drops UDP packets or is blocked by an outbound firewall, `libdatachannel` waits for STUN binding requests to time out before marking gathering as complete. If it exceeds 15 seconds, the negotiation fails with `Timed out gathering ICE candidates`.
2. Minecraft Bedrock clients wait for their own candidate gathering to complete before finishing negotiation. Adding unnecessary STUN or TURN servers delays connection establishment.

### How to fix it
* If your server has a dedicated public IP or a port-forwarded 1:1 NAT, do not configure STUN or TURN servers in `ice-servers`. Use `advertise-addresses` instead so candidate gathering completes immediately using local sockets.
* If you use STUN or TURN, verify that outbound UDP/TCP port `3478` / `5349` is open and all entries in `ice-servers` are reachable from the server machine.

## "Peer did not open both data channels" (5-second timeout after answer)

### Symptom
* The HTTP `/v1/join/<networkId>` POST request succeeds (`200 OK`), meaning the client received the SDP answer.
* 5 seconds later, the server logs:
  ```text
  Negotiation for <networkId> failed: Peer did not open both data channels
  ```

### Why it happens
Once the server sends the SDP answer, a 5-second timer (`DEFAULT_CHANNEL_TIMEOUT = 5.0`) starts for the client to complete ICE connectivity checks, finish the DTLS handshake, and open both the `ReliableDataChannel` and `UnreliableDataChannel` SCTP streams.

This timeout happens in two main situations:
* The client received your HTTP signaling response over TCP, but its UDP WebRTC packets never reached your server (or your server's UDP responses never reached the client).
* On plain HTTP signaling, the TOFU (Trust On First Use) confirmation dialog appears on the player's screen after HTTP signaling succeeds. Because the client does not create its DataChannels until the player clicks accept or decline, waiting on that dialog for more than 5 seconds causes the initial negotiation to time out on the server.

### Checklist to fix it
1. If the player was prompted with the TOFU trust dialog on their first join over plain HTTP, have them accept the prompt and reconnect (or configure HTTPS signaling to avoid the prompt).
2. Verify that the UDP ports in `transport.nethernet.port-range` are open in both your OS firewall (`ufw`, `iptables`, Windows Firewall) and your cloud provider's security group or network ACL.
3. If `port-range` is empty and `ice-udp-mux` is `false`, the OS picks random ephemeral UDP ports (`32768-60999`), which firewalls block by default. Set `ice-udp-mux: true` and `port-range: [19132, 19132]` (or an explicit range like `[19132, 19200]`).
4. Check `pocketmine.yml` to verify that `advertise-addresses` contains your public IP, not a private IP (`10.x.x.x`, `192.168.x.x`, `172.16.x.x`-`172.31.x.x`).
5. If ICE succeeds but the DTLS/SCTP handshake stalls due to packet fragmentation (on VPNs, PPPoE, or mobile data), lower `transport.nethernet.mtu` from `1200` to `1000` or `900`.

## "TURN servers cannot be used with ICE UDP mux"

### Symptom
On startup, Axolotl-PM fails to start NetherNet with:
```text
Invalid NetherNet settings in pocketmine.yml: ice-servers entry X is a TURN server, which cannot be used while ice-udp-mux is enabled
```
or `ext-webrtc` throws `WebRtcException: TURN servers cannot be used with ICE UDP mux`.

### Why it happens
`libdatachannel`'s single-socket UDP multiplexer (`enableIceUdpMux`) only multiplexes direct STUN/ICE/DTLS traffic on the local UDP port and cannot allocate or demultiplex TURN relay channels over the muxed socket.

### How to fix it
* If you use a TURN server in `transport.nethernet.ice-servers`, set `ice-udp-mux: false` and configure a multi-port `port-range` (for example, `port-range: [19132, 19200]`).
* If you do not need TURN relaying, remove the `type: turn` entry from `ice-servers` and keep `ice-udp-mux: true`.

## TLS, reverse proxy, and trust warning (TOFU) pitfalls

### 1. "Client initiated a TLS handshake on a plaintext endpoint"
A client or reverse proxy connected using `https://` to Axolotl-PM's built-in signaling server while `transport.nethernet.builtin-signaling.tls` had no `certificate` and `key` configured. Configure `tls.certificate` and `tls.key` in `pocketmine.yml`, or if you terminate TLS at a reverse proxy (Nginx or Caddy), configure the proxy to forward to Axolotl-PM over plain `http://127.0.0.1:<port>`.

### 2. Using Cloudflare proxy ("orange cloud") on the server domain
Do not enable Cloudflare proxy (orange cloud) on your server domain. Cloudflare's HTTP proxy does not support WebRTC UDP traffic, only proxies limited HTTP ports (not `19132/tcp`), hides your server's IP behind Cloudflare's anycast IP, and can break signaling responses through caching or request inspection. Always set your Cloudflare DNS record to DNS Only (grey cloud) and terminate TLS on your own server with Nginx, Caddy, or built-in TLS.

### 3. Players see a "Trust this server" (TOFU) warning every time or after server migration
When connecting over plain HTTP, Minecraft Bedrock uses TOFU (Trust On First Use) and pins the public key derived from `nethernet.key` (`transport.nethernet.key-file`). If `nethernet.key` is deleted, regenerated, or not copied when migrating hosts, returning players are prompted again because the server's cryptographic identity changed.
* Back up and preserve `nethernet.key` in your server data directory.
* To avoid the TOFU prompt for all players, serve HTTP signaling over HTTPS with a certificate signed by a trusted certificate authority (such as Let's Encrypt).

### 4. "no client address in the proxy headers" / all players share `127.0.0.1`
When `reverse-proxy.enabled: true` is set, NetherNet checks if the TCP connection comes from `reverse-proxy.trusted-ips`. If it does, it reads the header configured in `reverse-proxy.header` (`X-Forwarded-For`, `X-Real-IP`, `CF-Connecting-IP`). For `X-Forwarded-For`, it parses the comma-separated list from right to left, skipping any IP in `trusted-ips` to find the first untrusted client IP.
* List your reverse proxy in `trusted-ips` (such as `127.0.0.1` or your Docker proxy subnet).
* Configure your reverse proxy to set the header named in `reverse-proxy.header` (the RFC 7239 `Forwarded` header is not supported; use `X-Forwarded-For` or `X-Real-IP`).
* If a player or attacker triggers rate limiting (`Blocking <ip>: too many connections being negotiated at once`, default 16 concurrent negotiations per IP) while `reverse-proxy` is not enabled behind a proxy, `127.0.0.1` is blocked for 300 seconds, locking out all players through that proxy.

## Identity and clock skew issues ("Identity rejected")

### Symptom
Players are refused during signaling with:
```text
[HTTP signaling] Refused an offer: Identity rejected: Token has expired
```
or `Token is not valid yet`, `Token was issued in the future`, or `Offer has no identity assertion`.

### Why it happens
* Every NetherNet SDP offer and answer carries an `a=identity` attribute containing a JSON Web Token (JWT) signed with `ES384` (P-384) and bound to the connection's DTLS certificate fingerprint.
* NetherNet validates the token's `nbf` (Not Before), `iat` (Issued At), and `exp` (Expiration) timestamps against the server's system clock with a 60-second leeway (`JsonWebToken::DEFAULT_LEEWAY_SECONDS = 60`). Self-signed tokens have a lifetime of 60 seconds.
* If your server's system clock or the client's device clock is off by more than 60 seconds, token validation fails.
* If `xbox-auth=on` in `server.properties`, anonymous offers (offers without an `a=identity` assertion) are rejected.

### How to fix it
* Enable NTP time synchronization (`systemd-timesyncd`, `chrony`, or Windows Time) on your server host.
* Ask the affected player to enable automatic date and time synchronization on their device.

## Diagnosing client disconnect codes (`DisconnectFailReason`)

When the Minecraft client fails to connect to a server, it shows a disconnect screen with a codeword and a "Show details" button:

![](/img/nethernet-troubleshooting-1.png)

Clicking "Show details" opens a diagnostic view where the first detail line ends in `<stage>-<number>` (for example, `Error Detail InitialConnection-149`, circled in red below):

![](/img/nethernet-troubleshooting-2.png)

That number is the `DisconnectFailReason` ordinal from Mojang's [DisconnectFailReason.json](https://github.com/Mojang/bedrock-protocol-docs/blob/main/json/DisconnectFailReason.json) (see also CloudburstMC's [client disconnect reasons table](https://github.com/CloudburstMC/Network/blob/nethernet/docs/client-disconnect-reasons.md)). The codes below are the ones most commonly encountered with NetherNet:

| Code | `DisconnectFailReason` | Codeword | Meaning | What to check |
| :--- | :--- | :--- | :--- | :--- |
| `83` | `NetherNetICE` | Door | None of the provided ICE candidates could be reached. | Set `port-range` (or `ice-udp-mux: true` with a single port), open and forward those UDP ports 1:1 in your firewall and router, and set `advertise-addresses` to your public IP if behind a 1:1 NAT or Docker ([details](#_1-1-nat-and-unreachable-private-ips-cloud-vms-docker-home-routers)). |
| `149` | `UnsupportedTransport` | Terracotta | `HTTP POST /v1/join` failed. | Verify that the TCP signaling port (`server-port` or `builtin-signaling.port`) is open, check your reverse proxy and TLS settings, and check the server console with `debug.level: 2` for `[HTTP signaling] Refused an offer` ([details](#no-local-candidates-to-answer-with-no-candidates-to-resolve)). |
