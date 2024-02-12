import {EVENT_LIST, EventSubscriber} from "@amongusxr/types/src/EventSystem";

class EventManager {

    private constructor() {}

    static instance: EventManager;
    static getInstance(): EventManager {
        if (!this.instance) {
            this.instance = new EventManager();
        }
        return this.instance;
    }

    private listeners: EventSubscriber<keyof EVENT_LIST>[] = [];

    on<E extends keyof EVENT_LIST>(event: E, listener: {(event: EVENT_LIST[E]): void}): void {
        this.listeners.push({
            event: event,
            handler: listener
        });
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