import {EVENT_LIST, EventSubscriber} from "@amongusxr/types/src/EventSystem";

class EventManager {

    private constructor() {}

    private static instance: EventManager;
    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    private listeners: EventSubscriber<keyof EVENT_LIST>[] = [];

    on<E extends keyof EVENT_LIST>(event: E, listener: {(event: EVENT_LIST[E]): void}): void {
        this.listeners.push({
            event: event,
            handler: listener
        } as EventSubscriber<keyof EVENT_LIST>);
    }

    emit<E extends keyof EVENT_LIST>(event: E, data: EVENT_LIST[E]): void {
        for (const listener of this.listeners) {
            if (listener.event === event) {
                listener.handler(data);
            }
        }
    }
}

const eventManager = EventManager.getInstance();
export default eventManager;