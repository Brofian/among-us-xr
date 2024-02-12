import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {v4 as uuidV4} from "uuid";

type PlayerRoles = 'queued'|'spectator'|'player'|'administrator'|'game_object';

export default class User {

    private readonly socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    private role: PlayerRoles = 'queued';
    private readonly identifier: string;

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.socket = socket;
        this.identifier = uuidV4()
    }

    getSocket(): Socket {
        return this.socket;
    }

    getRole(): PlayerRoles {
        return this.role;
    }

    getIdentifier(): string {
        return this.identifier;
    }

    sendSocketMessage(): void {
        this.socket.send()
    }

}