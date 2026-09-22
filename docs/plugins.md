---
title: "Plugins"
outline: deep
---

# Plugins

Axolotl-PM can be extended and customized with plugins.

A plugin is an external module which can be "plugged in" to your server to add custom features, change default behaviours and more.

## Downloading plugins

You can find a wide range of premade plugins on the [Poggit Release](https://poggit.pmmp.io/plugins) plugin platform.

## Installing/updating a plugin

Plugin developers usually distribute plugins as [phar](http://php.net/manual/en/phar.using.intro.php) files. These files can be easily loaded by placing them in your `plugins` folder in the server data folder.

Be sure to **delete old versions of the plugin**, and **restart the server** to see changes.

## Writing your own plugins

You can find resources for plugin development in the [plugin development docs](/docs/developers/plugin-docs-index) section.

::: tip Tip
All public plugins on Poggit Release are open-source, and there are many more on GitHub.

You can learn a lot from looking at other people's code that you can't easily learn from documentation pages.
:::
