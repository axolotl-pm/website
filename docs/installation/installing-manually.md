---
title: "Installing/updating manually"
outline: deep
---

# Installing/updating manually

::: warning Warning
Installing manually is complicated. Don't attempt it unless you have no other option.
:::

## Windows

1. Make a folder for your server. If you're updating an existing server, delete `PocketMine-MP.phar`, any file called `start`, and the `bin` folder from the folder.
2. Download the custom PHP binary for Windows [here](https://github.com/axolotl-pm/PHP-Binaries/releases). **Make sure you get the right version for your chosen version of Axolotl-PM** (see below).
3. Right-click -> click Extract All, pick your server folder and click Extract. Now you should have a folder called `bin`.
4. In the `bin` folder, double-click the file `vc_redist.x64.exe`, accept the terms and conditions, and install. This will install Microsoft Visual C++ Redistributable, which is needed by the PHP binary.
5. Download your chosen version of `PocketMine-MP.phar` and `start.cmd` from [here](https://github.com/axolotl-pm/PocketMine-MP/releases) and save them in your server folder.

Now you should be able to double-click `start.cmd` to start the server.

## Linux/MacOS

The following steps require you to use the Terminal.

1. `cd` to wherever you want to put the server (e.g. `cd /home/dylan`).
2. Make a folder for your server using `mkdir` (e.g. `mkdir pocketmine`). If you're updating an existing server, `cd` directly to your server's folder instead.
3. Run `rm -rf ./bin ./PocketMine-MP.phar ./start.sh`. This deletes any outdated server files (don't worry, your data won't be harmed).
4. Find the download link for the right PHP version for your OS. You can see a list of available ones [here](https://github.com/axolotl-pm/PHP-Binaries/releases).
5. Run `curl -L <link to your chosen PHP binary> | tar -xz`. Now you should have a folder called `bin`. **Make sure you get the right version for your chosen version of Axolotl-PM** (see below).
6. Find the download link for your chosen version of `PocketMine-MP.phar` and `start.sh` [here](https://github.com/axolotl-pm/PocketMine-MP/releases).
7. Run `curl -LO <link to PocketMine-MP.phar>`.
8. Run `curl -LO <link to start.sh>`.
9. Run `chmod +x ./start.sh`.\`

Now you should be able to run the server by running `./start.sh`.

::: warning Warning
Make sure you know which binary to use for your chosen version of Axolotl-PM. Different versions need different binaries. You can get some information about this from the [update.axolotl-pm.org API](https://update.axolotl-pm.org).

Binaries have a suffix that tells you which Axolotl-PM version they are for. `PM4` is for 4.x, and `PM5` is for 5.x.

There are also different downloads for different operating systems, different CPU architectures and different versions of PHP itself.

**If you use the wrong binary, the server might not work.**
:::
