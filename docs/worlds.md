---
title: "Worlds"
outline: deep
---

# Worlds

Axolotl-PM supports several world formats.

Unlike a vanilla server, it also supports loading several worlds at the same time.
This is useful to offer a more varied game experience to your players without transferring them between servers,
as well as allowing players to have unlimited space in game modes like SkyBlock.

## Supported world formats

Axolotl-PM saves worlds in the same format as vanilla Bedrock by default.

However, it has some support for several other world formats.

| Type | Format | Support | Notes |
| --- | --- | --- | --- |
| Java <= 1.12.x | McRegion/Anvil | Converted on load | Some blocks may display incorrectly |
| Bedrock <= 1.18.20 | LevelDB | Direct | Some blocks may not be supported |
| Bedrock >= 1.18.30 | LevelDB | Direct | Some blocks may not be supported<br>Entities may not load |
| PM3 | PMAnvil | Converted on load | Will be converted on load |

::: danger Error
Java 1.13+ worlds are **not** currently supported (as of 5.37.2) due to extensive changes to the format compared to Java 1.12.
:::

::: tip Tip
While Axolotl-PM cannot load `.mcworld` files by default, it can load the world files inside if you manually
extract them. You can do this by changing the file extension to `.zip` and extracting it as a zip.
:::

## Generating new worlds

Axolotl-PM has a very basic world generator. This is because it hasn't been a focus of our development team.

Biomes usually appear as large blobs, and seeds from vanilla Minecraft won't produce the same results in Axolotl-PM.

Worlds configured in `server.properties` or `pocketmine.yml` will be generated according to the preferred settings
if they aren't found.

## Adding pre-existing worlds

Worlds must be placed in the `worlds` folder in folder form.

Normally, worlds will have a `level.dat` file inside their folder.
In order for Axolotl-PM to detect the world, the folder structure should look like this:

```
worlds
|___ my_world
    |___ level.dat
|___ my_world_2
    |___ level.dat
```

::: warning Warning
Just putting the worlds in the folder is not enough to make Axolotl-PM load them.

You also need to configure them in `pocketmine.yml` (see below).
:::

## Loading multiple worlds at once

You can load multiple worlds by configuring them in `pocketmine.yml`.

Opening the file in a text editor, you'll find a section like this near the bottom:

```yaml
worlds:
  #These settings will override the generator set in server.properties and allows loading multiple worlds
  #Example:
  #world: #Folder name of the world inside the worlds folder
  # seed: 404
  # generator: FLAT
  # preset: 2;bedrock,59xstone,3xdirt,grass;1
```

These settings work similarly to those in `server.properties`, but you can add multiple entries.

If we wanted to load all of the worlds shown in the example in the previous section, it might look like this:

```yaml
worlds:
  my_world:
    seed: 123456
    generator: FLAT
  my_world_2:
    seed: arandomstring
    generator: DEFAULT
```

::: tip Tip
All of the options (`seed`, `generator`, etc.) are optional. If they aren't specified, the server will use
built-in defaults.
:::

## Changing the default world

The default world's name is controlled by the `level-name` option in `server.properties`.

This option corresponds to the name of the folder inside the `worlds` folder to be used as the default world.

For example, if `level-name` is set to `my-awesome-world`, Axolotl-PM will look for `worlds/my-awesome-world/level.dat` to load the world.

::: tip Tip
If no world exists by the given name, a new one will be generated using the options set in `level-type`, `level-seed` and `generator-settings` options.
:::

## Teleporting between worlds

As of 5.37.2, there is currently no built-in way to teleport between worlds in Axolotl-PM.

However, plugins can teleport player between worlds easily.

You can find plugins on [Poggit](https://poggit.pmmp.io/plugins) for managing and teleporting between worlds.
