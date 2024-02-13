import Room from "./Room";
import User from "../user/User";
import eventManager from "../util/EventManager";
import {RoomClosingTriggeredEvent} from "@amongusxr/types/src/Events/ServerEvents";
import {C2SCreateRoomEvent, C2SJoinRoomEvent} from "@amongusxr/types/src/Events/C2SPackages";
import userManager from "../user/UserManager";

class RoomManager {

    private rooms: Room[] = [];

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

    onCloseRoom(event: RoomClosingTriggeredEvent): void {
        const room = this.getRoomByCode(event.roomCode);
        if (!room) {
            return;
        }

        for (const user of room.getUsers()) {
            user.leaveRoom();
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

        user.joinRoom(room, event.username);
    }

    onUserTriesCreatingRoom(event: C2SCreateRoomEvent): void {
        const administrator: User = userManager.getUserById(event.userId);
        if (!administrator || administrator.getRoom()) {
            return;
        }

        // TODO replace placeholder with something dynamic
        const room = new Room(administrator, 'Administrator');
        this.rooms.push(room);
    }

}

const roomManager = RoomManager.getInstance();
export default roomManager;