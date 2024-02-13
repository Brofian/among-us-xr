import {UserRoles} from "../User";

export type S2C_EVENT_LIST = {
    S2C_PING: S2CPingEvent,
    S2C_USER_UPDATED: S2CUserUpdatedEvent
    S2C_ROOM_NOT_FOUND: S2CRoomNotFoundEvent
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

export type S2CUserUpdatedEvent = {
    userId: string;
    role: UserRoles;
    roomCode?: string;
} & S2CEvent;

export type S2CRoomNotFoundEvent = {} & S2CEvent;