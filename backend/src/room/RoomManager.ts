import Room from "./Room";
import User from "../user/User";
import eventManager from "../util/EventManager";
import {RoomClosingTriggeredEvent} from "@amongusxr/types/src/Events/ServerEvents";
import {C2SCreateRoomEvent, C2SJoinRoomEvent} from "@amongusxr/types/src/Events/C2SPackages";
import userManager from "../user/UserManager";
import {serverLogger} from "../util/Logger";
import GameEventTunnel from "./GameEventTunnel";

class RoomManager {

    private readonly rooms: Room[] = [];
    private readonly gameEventTunnel: GameEventTunnel = new GameEventTunnel(this.rooms);

    private constructor() {
        eventManager.on('S_ROOM_CLOSING_TRIGGERED', this.onCloseRoom.bind(this));
        eventManager.on('C2S_JOIN_ROOM', this.onUserTriesJoiningRoom.bind(this));
        eventManager.on('C2S_CREATE_ROOM', this.onUserTriesCreatingRoom.bind(this));
    }

    private static instance: RoomManager;
    static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    getRoomByCode(code: string): Room|undefined {
        return this.rooms.find(room => room.getCode() === code);
    }

    moveUserToRoom(user: User, room: Room, username: string): void {
        this.removeUserFromRoom(user);
        user.setRoom(room);
        room.addUser(user, username);
    }

    removeUserFromRoom(user: User): void {
        const room = user.getRoom();
        if (room) {
            user.setRoom(undefined);
            room.removeUser(user);
        }
    }

    onCloseRoom(event: RoomClosingTriggeredEvent): void {
        const room = this.getRoomByCode(event.roomCode);
        if (!room) {
            return;
        }

        for (const userData of room.getUsers()) {
            this.removeUserFromRoom(userData.user);
        }

        const roomIndex = this.rooms.indexOf(room);
        if (roomIndex !== -1) {
            this.rooms.splice(roomIndex, 1);
        }
    }

    onUserTriesJoiningRoom(event: C2SJoinRoomEvent): void {
        const user = userManager.getUserById(event.userId);
        if (!user || user.getRoom()) return;
        const room = this.getRoomByCode(event.roomCode);
        if (!room) {
            eventManager.emit('S2C_ROOM_NOT_FOUND', {});
            return;
        }

        this.moveUserToRoom(user, room, event.username || '[MISSING_VAL]');
        serverLogger.debug(`User ${user.getShortIdentifier()} joined room ${room.getCode()} (${room.getUsers().length} members)`);
    }

    onUserTriesCreatingRoom(event: C2SCreateRoomEvent): void {
        const {username} = event;
        const administrator: User = userManager.getUserById(event.userId);
        if (!administrator || administrator.getRoom()) {
            return;
        }

        const room = new Room(administrator, username);
        administrator.setRoom(room);
        room.sendRoomUpdatedEvent();
        this.rooms.push(room);
        serverLogger.debug(`User ${administrator.getShortIdentifier()} created room ${room.getCode()}`);
    }

}

const roomManager = RoomManager.getInstance();
export default roomManager;