---
title: "What does “Incompatible API version” mean when loading a plugin?"
outline: deep
---

# What does "Incompatible API version" mean when loading a plugin?

This means that the version of the plugin currently installed is not compatible with the server. This might be because your version of Axolotl-PM is out of date, or because the plugin itself is out of date.

## Why does it matter what version I'm using?

New features are added to the API over time, and old ones may be deprecated.
In addition, in a major version bump (e.g. 4.x -> 5.x), there may be **backwards-incompatible changes** (sometimes referred to as *BC breaks*) which prevent plugins working on different major versions.

Plugins declare which API versions they support to make sure their plugins fail gracefully instead of crashing your server or making it do something unexpected.

::: tip Tip
You can learn more about how API versions work [here](/docs/developers/plugin-docs/api-version-spec).
:::

## What can I do?

Check for an updated version of the plugin, or ask the plugin developer to update it.

If you're feeling adventurous, you could try updating the code yourself to work on the version of Axolotl-PM you're using. Check out the [plugin development docs](/docs/developers/plugin-docs-index). Also, consider joining our [Discord](https://discord.gg/vrPugybpJF) server so that you can ask other developers for help.

::: warning Warning
Simply bumping the plugin's declared API version is often not enough to update a plugin. The plugin might still crash or not work as expected.
Use of so-called "API updaters" is discouraged.
:::
