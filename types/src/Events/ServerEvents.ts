import {Event} from "../EventSystem";

export type SERVER_EVENT_LIST = {
    S_ROOM_CLOSING_TRIGGERED: RoomClosingTriggeredEvent
    S_USER_REMOVAL_TRIGGERED: UserRemovalTriggeredEvent
};

export type RoomClosingTriggeredEvent = {
    roomCode: string;
} & Event;

export type UserRemovalTriggeredEvent = {
    userId: string;
} & Event;