---
title: "Events"
outline: deep
---

# Events

Axolotl-PM has an events system which allows plugins to react to, modify the outcome of, and prevent the result of events.

## How it works

1. Something registers a handler for a given event.
2. Just before the event takes place, the handler is called and passed an object containing information about the event. This allows handlers to react to, modify (and in some cases prevent) an event from taking place.
3. The event takes place (or does not take place if cancelled) as defined by the object which contains the event information.

::: info Note
All event handlers are currently executed **before** the event takes place. This is a common pitfall of Axolotl-PM plugin developers - when an event handler is executed, the actual event has not yet taken place.
:::

## Handling events

- [Using the `pocketmine\event\Listener` interface](/docs/developers/plugin-docs/events/listener-interface)
- [Event handler priority](/docs/developers/plugin-docs/events/priority)
