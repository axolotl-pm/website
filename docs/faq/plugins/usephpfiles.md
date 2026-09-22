---
title: "Can I run a plugin from source without creating a .phar?"
outline: deep
---

# Can I run a plugin from source without creating a `.phar`?

You can use the [DevTools](https://github.com/pmmp/PocketMine-DevTools) plugin to load source plugins (known as "folder plugins").

::: warning Warning
It is discouraged to use either DevTools or folder plugins on a production server.
:::

For small test plugins there is a new way, check out how [Script Plugin](https://github.com/axolotl-pm/PocketMine-MP/blob/stable/tests/plugins/TestScriptPlugin.php) works.
