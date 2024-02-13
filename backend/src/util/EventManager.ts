import {EVENT_LIST, EventHandler, EventSubscriber} from "@amongusxr/types/src/EventSystem";

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
        });
    }

    removeListener<E extends keyof EVENT_LIST>(event: E, handler: EventHandler<E>): void {
        const listenerIndex = this.listeners.findIndex(l => l.event === event && l.handler === handler);
        if (listenerIndex !== -1) {
            this.listeners.splice(listenerIndex,1);
        }
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