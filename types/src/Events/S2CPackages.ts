export type S2C_EVENT_LIST = {
    S2C_PING: S2CPingEvent
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