import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {v4 as uuidV4} from "uuid";
import socketManager from "../util/SocketManager";
import {UserRoles} from "@amongusxr/types/src/User";
import Room from "../room/Room";
import eventManager from "../util/EventManager";

export default class User {

    private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
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

    hasInactiveRole(): boolean {
        if (!this.room) return true;

        const inactiveRoles: UserRoles[] = ['unset','queued', 'spectator'];
        return inactiveRoles.includes(
            this.room.getGameInstance().getPlayerManager().getUserRole(this)
        );
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
            if (this.room) {
                this.socket.join(this.room.getCode());
            }
            this.sendUserUpdatedEvent();
            return true;
        }
        return false;
    }

    sendUserUpdatedEvent(): void {
        socketManager.sendSocketEvent(this.socket,'S2C_USER_UPDATED', {
            userId: this.identifier,
            role: this.room ? this.room.getGameInstance().getPlayerManager().getUserRole(this) : 'unset',
            roomCode: this.room?.getCode()
        });
    }

    getRoom(): Room|undefined {
        return this.room;
    }

    setRoom(room: Room|undefined, username: string = ''): void {
        if (room === this.room) return;

        if (this.room !== undefined) {
            this.socket.leave(this.room.getCode());
        }

        this.room = room;
        if (room) {
            this.socket.join(this.room.getCode());
            this.username = username;
            this.sendUserUpdatedEvent();
        }
        else if (!this.socket.connected) {
            // if this user was removed by closing a room and is no longer connected, remove it
            eventManager.emit('S_USER_REMOVAL_TRIGGERED', {userId: this.getIdentifier()});
            return;
        }
    }
}