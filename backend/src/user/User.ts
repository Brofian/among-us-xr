import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {v4 as uuidV4} from "uuid";
import socketManager from "../util/SocketManager";

type PlayerRoles = 'queued'|'spectator'|'player'|'administrator'|'game_object';

export default class User {

    private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    private role: PlayerRoles = 'queued';
    private readonly identifier: string;

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.socket = socket;
        this.identifier = uuidV4();
        this.sendUserUpdatedEvent();
    }

    getSocket(): Socket {
        return this.socket;
    }

    getRole(): PlayerRoles {
        return this.role;
    }

    hasInactiveRole(): boolean {
        const inactiveRoles: PlayerRoles[] = ['queued', 'spectator'];
        return inactiveRoles.includes(this.role);
    }

    getIdentifier(): string {
        return this.identifier;
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
            userId: this.identifier
        });
    }
}