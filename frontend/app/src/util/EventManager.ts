import {
    SocketStateChangedEvent
} from "./Events/LocalEvents";


export interface EventSubscriberDefinition {
    'socket_state_changed': (event: SocketStateChangedEvent) => void;
}

export type EventType = keyof EventSubscriberDefinition;

export interface EventSubscriber<E extends EventType> {
    event: E;
    handler: EventSubscriberDefinition[E];
}

class EventManagerContainer {

    private subscribers: EventSubscriber<EventType>[] = [];

    addEventListener<E extends EventType>(event: E, handler: EventSubscriberDefinition[E]): void {
        this.subscribers.push({event, handler});
    }

    removeEventListener<E extends EventType>(handler: EventSubscriberDefinition[E]): void {
        this.subscribers = this.subscribers.filter(sub => sub.handler !== handler);
    }

    public notify<E extends EventType>(
        event: E,
        ...args: [...Parameters<EventSubscriberDefinition[E]>]
    ): void {
        this.subscribers.forEach(
            (subscriber: EventSubscriber<EventType>) => {
                if (subscriber.event === event) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    subscriber.handler(...args);
                }
            }
        );
    }
}

const EventManager = new EventManagerContainer();
export default EventManager;