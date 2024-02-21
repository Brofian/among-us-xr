import {UserRoles} from "../User";
import {GameConfiguration} from "../Game/Configuration";

export type C2S_EVENT_LIST = {
    C2S_CREATE_ROOM: C2SCreateRoomEvent,
    C2S_JOIN_ROOM: C2SJoinRoomEvent,
    C2S_SELECT_ROLE: C2SSelectRoleEvent,
    C2S_SUBMIT_CONFIGURATION: C2SSubmitConfigurationEvent,
};

export type C2SPackage<T extends keyof C2S_EVENT_LIST> = {
    event: T,
    eventData: C2S_EVENT_LIST[T]
}

/**
 *  userId will be set automatically in the backend upon receiving the event package
 */
export type C2SEvent = {
    userId?: string;
}

export type C2SJoinRoomEvent = {
    roomCode: string;
    username: string;
} & C2SEvent;

export type C2SCreateRoomEvent = {
    username: string;
} & C2SEvent;

export type C2SSelectRoleEvent = {
    selectedRole: UserRoles;
} & C2SEvent;

export type C2SSubmitConfigurationEvent = {
    configuration: GameConfiguration
} & C2SEvent;