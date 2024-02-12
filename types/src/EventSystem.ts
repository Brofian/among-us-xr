import {CLIENT_EVENT_LIST, ConnectionStatusChangedCEvent} from "./Events/ClientEvents";
import {SERVER_EVENT_LIST} from "./Events/ServerEvents";
import {C2S_EVENT_LIST} from "./Events/C2SPackages";
import {S2C_EVENT_LIST} from "./Events/S2CPackages";

export type EVENT_LIST =
    CLIENT_EVENT_LIST &
    SERVER_EVENT_LIST &
    C2S_EVENT_LIST &
    S2C_EVENT_LIST;

export type EventHandler<E extends keyof EVENT_LIST> = {(event: EVENT_LIST[E]): void};

export type EventSubscriber<E extends keyof EVENT_LIST> = {
    event: E,
    handler: EventHandler<E>;
}

export type Event = {}