import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {v4 as uuidV4} from "uuid";
import socketManager from "../util/SocketManager";
import {UserRoles} from "@amongusxr/types/src/User";
import Room from "../room/Room";
import eventManager from "../util/EventManager";

export default class User {

    private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    private role: UserRoles = 'unset';
    private room?: Room = undefined;
    private username: string = '';
    private readonly identifier: string;

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.socket = socket;
        this.identifier = uuidV4();
        this.sendUserUpdatedEvent();
    }

    getSocket(): Socket {
        return this.socket;
    }

    getRole(): UserRoles{
        return this.role;
    }

    hasInactiveRole(): boolean {
        const inactiveRoles: UserRoles[] = ['unset','queued', 'spectator'];
        return inactiveRoles.includes(this.role);
    }

    getIdentifier(): string {
        return this.identifier;
    }

    getShortIdentifier(): string {
        return this.identifier.slice(0,8);
    }

    resurrect(socket: Socket): boolean {
        if (!this.socket.connected) {
            this.socket = socket;
            this.sendUserUpdatedEvent();
            return true;
        }
        return false;
    }

    sendUserUpdatedEvent(): void {
        socketManager.sendSocketEvent(this.socket,'S2C_USER_UPDATED', {
            userId: this.identifier,
            role: this.role,
            roomCode: this.room?.getCode(),
        });
    }

    getRoom(): Room|undefined {
        return this.room;
    }


    /**
     * Two-way method, setting the room to this user and updating the room object
     * @param room
     * @param username
     */
    joinRoom(room: Room, username: string): void {
        if (this.room !== room) {
            this.room = room;
            room.addUser(this, username);
            this.role = room.getDefaultUserRole();
            this.username = username;
            this.sendUserUpdatedEvent();
        }
    }

    /**
     * Two-way method, unsetting the room to this user and updating the room object
     */
    leaveRoom(): void {
        if (!this.room) {
            return;
        }
        this.room.removeUser(this);
        this.room = undefined;

        // if this user was removed by closing a room and is no longer connected, remove it
        if (!this.socket.connected) {
            eventManager.emit('S_USER_REMOVAL_TRIGGERED', {userId: this.getIdentifier()});
        }
    }
}