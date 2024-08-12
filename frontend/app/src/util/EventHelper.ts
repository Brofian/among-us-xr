import EventManager, {EventSubscriber, EventType} from "./EventManager";

export default class EventHelper {

    private listeners: EventSubscriber<EventType>[] = [];

    init(listeners: EventSubscriber<EventType>[]) {
        this.listeners = listeners;
        for (const listener of this.listeners) {
            EventManager.addEventListener(listener.event, listener.handler);
        }
    }

    destroy(): void {
        for (const listener of this.listeners) {
            EventManager.removeEventListener(listener.handler);
        }
    }

}