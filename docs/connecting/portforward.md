---
title: "Forwarding ports in your router"
outline: deep
---

# Forwarding ports in your router

::: info Note
If you're running Axolotl-PM on a VPS (Virtual Private Server), you don't need to do this.
:::

Forwarding ports is needed when your server is behind a router (e.g. on a home WiFi or LAN), and you want to allow people who aren't on your network to connect from outside using your public IP address.

## Using UPnP

Axolotl-PM can use UPnP (Universal Plug and Play) to forward ports for you, but it's disabled by default.

UPnP can save you a lot of hassle manually portforwarding, so it's worth giving it a shot before messing with your router settings.

You can try it by opening your `pocketmine.yml` and setting `upnp-forwarding` to `true`. Save the file and restart the server.
On startup, the server should tell you in the logs whether it succeeded or not.

## Forwarding manually

Unfortunately, every router has a different interface, so we can't give a common set of instructions for portforwarding here.

Check [portforward.com](http://portforward.com/english/routers/port_forwarding/routerindex.htm) or use [Google](https://www.google.com) to find the instructions. Use the brand and type of your router as keywords.

::: info Note
By default, Axolotl-PM listens on port `19132` for IPv4 connections, and `19133` for IPv6 connections.

These are the ports you'll need to forward (unless you customised them in `server.properties`).
:::
