import {Event} from "../EventSystem";

export type CLIENT_EVENT_LIST = {
    CONNECTION_STATUS_C: ConnectionStatusChangedCEvent,
};


export type ConnectionStatusChangedCEvent = {
    connected: boolean
} & Event;