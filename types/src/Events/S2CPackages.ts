import {PlayerList, UserRoles} from "../User";
import {GamePhases} from "../Game/DataTypes";

export type S2C_EVENT_LIST = {
    S2C_PING: S2CPingEvent,
    S2C_USER_UPDATED: S2CUserUpdatedEvent,
    S2C_GAME_UPDATED: S2CGameUpdatedEvent,
    S2C_ROOM_UPDATED: S2CRoomUpdatedEvent,
    S2C_ROOM_NOT_FOUND: S2CRoomNotFoundEvent,
    S2C_UNIVERSAL_PLAYER_GAME_UPDATE: S2CUniversalPlayerGameUpdate,
    S2C_CREWMATE_GAME_UPDATE: S2CCrewmateGameUpdate,
    S2C_IMPOSTER_GAME_UPDATE: S2CImposterGameUpdate,
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
} & S2CEvent;


export type S2CRoomUpdatedEvent = {
    roomCode: string;
    administratorId: string;
    playerList: PlayerList
} & S2CEvent;

export type S2CUniversalPlayerGameUpdate = {
    job: 'crewmate'|'imposter',
} & S2CEvent;

export type S2CImposterGameUpdate = {
    killTimeout: number;
    hazards: []; // TODO implement
    doors: []; // TODO implement
} & S2CEvent;

export type S2CCrewmateGameUpdate = {
    tasks: [], // TODO implement
} & S2CEvent;

export type S2CRoomNotFoundEvent = {} & S2CEvent;

export type S2CGameUpdatedEvent = {
    gamePhase: GamePhases
} & S2CEvent;