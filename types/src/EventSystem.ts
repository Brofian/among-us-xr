export type EVENT_LIST = {
    CONNECTION_STATUS_C: ConnectionStatusChangedCEvent,
};

export type EventHandler<K extends keyof EVENT_LIST> = {(event: EVENT_LIST[K]): void};

export type EventSubscriber<K extends keyof EVENT_LIST> = {
    event: K,
    handler: EventHandler<K>;
}

export type Event = {}

export type ConnectionStatusChangedCEvent = {
    connected: boolean
} & Event;