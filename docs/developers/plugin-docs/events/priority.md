---
title: "Event handler priority"
outline: deep
---

# Event handler priority

Event "priority" is used to control the order in which multiple handlers of the same event will execute. This is mainly used for plugin interoperability.
The `pocketmine\event\EventPriority` class declares a series of hardcoded priorities which handlers can use.

::: info Note
Priority is a misleading name, because higher "priority" means that the handler should execute *later* in the sequence and not earlier. The reasoning for this is that higher order handlers "get the last word" over lower order handlers. This naming may be changed in future Axolotl-PM versions.
:::

## List of priorities

At the time of writing, the following priorities exist:

| Name | Description |
| --- | --- |
| LOWEST | These handlers will be executed first.<br><br>This should be used when the original event state is needed (before later handlers modify it),<br><br>or when the handler is making a low-priority modification (to allow other handlers to override it). |
| LOW |  |
| NORMAL | If a priority is not specified, handlers will be registered here by default. |
| HIGH |  |
| HIGHEST | Handlers registered at this priority get the final say in the event's outcome. |
| MONITOR | These handlers will execute last.<br><br>**No modification to the event's outcome should be made at this priority, including cancellation**.<br><br>This should be used only for **monitoring the outcome** of an event. |

::: warning Warning
When multiple handlers are registered to the same priority, the order of execution is undefined.
:::
