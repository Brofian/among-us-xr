export type S2C_EVENT_LIST = {
    S2C_PING: S2CPingEvent,
    S2C_USER_UPDATED: S2CUserUpdatedEvent
};

export type S2CPackage<T extends keyof S2C_EVENT_LIST> = {
    event: T,
    eventData: S2C_EVENT_LIST[T]
}

export type S2CEvent = {

}

export type S2CPingEvent = {
    text: string;
} & S2CEvent;

export type S2CUserUpdatedEvent = {
    userId: string;
} & S2CEvent;