export type C2S_EVENT_LIST = {
    C2S_PING: C2SPingEvent
};

export type C2SPackage<T extends keyof C2S_EVENT_LIST> = {
    event: T,
    eventData: C2S_EVENT_LIST[T]
}

/**
 *  userId will be set automatically in the backend upon receiving the event package
 */
export type C2SEvent = {
    userId?: string;
}

export type C2SPingEvent = {
    text: string;
} & C2SEvent;