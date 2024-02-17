import {Event} from "../EventSystem";

export type CLIENT_EVENT_LIST = {
    C_CONNECTION_STATUS: ConnectionStatusChangedCEvent,
    C_USER_UPDATED: UserUpdatedCEvent,
    C_ROOM_UPDATED: RoomUpdatedCEvent,
};


export type ConnectionStatusChangedCEvent = {
    connected: boolean
} & Event;

export type UserUpdatedCEvent = {} & Event;

export type RoomUpdatedCEvent = {} & Event;