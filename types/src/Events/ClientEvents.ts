import {Event} from "../EventSystem";
import {Coordinate} from "../Game/DataTypes";

export type CLIENT_EVENT_LIST = {
    C_CONNECTION_STATUS: ConnectionStatusChangedCEvent,
    C_USER_UPDATED: UserUpdatedCEvent,
    C_ROOM_UPDATED: RoomUpdatedCEvent,
    C_GPS_HEADING_CHANGED: GpsHeadingChangedEvent,
    C_GPS_LOCATION_CHANGED: GpsLocationChangedEvent,
};


export type ConnectionStatusChangedCEvent = {
    connected: boolean
} & Event;

export type UserUpdatedCEvent = {} & Event;

export type RoomUpdatedCEvent = {} & Event;

export type GpsHeadingChangedEvent = {
    heading: number
} & Event;

export type GpsLocationChangedEvent = {
    location: Coordinate
} & Event;