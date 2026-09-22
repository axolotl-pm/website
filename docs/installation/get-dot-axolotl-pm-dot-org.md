---
title: "Using the official installer (Linux/MacOS only)"
outline: deep
---

# Using the official installer (Linux/MacOS only)

::: warning Warning
Only works on Linux or MacOS.
:::

If you're creating a new server, create a directory which you want to install Axolotl-PM into, and `cd` into it.

Otherwise, just `cd` straight into your existing server folder.

## Installing/updating to the latest version

Then use `curl` to install/update Axolotl-PM using the following command:

```sh
curl -sL https://get.axolotl-pm.org | bash -s -
```

or, if you don't have `curl`, try `wget`:

```sh
wget -q -O - https://get.axolotl-pm.org | bash -s -
```

```sh
[*] Retrieving latest build data for channel "stable"
[*] Found PocketMine-MP 5.46.1 (build 2306) for Minecraft: PE v1.26.44 (PHP 8.2)
[*] This stable build was released on Tue, Aug 25, 2026  9:26:57 AM
[-] This channel should have a signature, none found
[*] Installing/updating PocketMine-MP on directory ./
[1/3] Cleaning...
[2/3] Downloading PocketMine-MP phar... done!
[3/3] Obtaining PHP: detecting OS type and arch...... downloading 8.2 for Windows x64... updating php.ini... checking... done
[*] Everything done! Run ./start.sh to start PocketMine-MP
```

::: danger Error
It is recommended to run it as a **normal user** as it doesn't need further permissions.

**Do not run the installer as root, this is discouraged**.
:::

::: info Note
If the installer doesn't work for you, try [installing manually](/docs/installation/installing-manually).
:::

## Installing a specific version

If you don't want to run the latest version, you may be able to run an older version by giving the `-v` option to the installer.

Examples:

| Version | Command |
| --- | --- |
| Latest 4.x stable | `curl -sL https://get.axolotl-pm.org \| bash -s - -v 4` |
| Latest 5.x beta | `curl -sL https://get.axolotl-pm.org \| bash -s - -v 5-beta` |
| Latest 5.1 stable | `curl -sL https://get.axolotl-pm.org \| bash -s - -v 5.1` |

You can see a list of available options for `-v` by clicking [here](https://github.com/axolotl-pm/update.axolotl-pm.org/tree/master/channels).
