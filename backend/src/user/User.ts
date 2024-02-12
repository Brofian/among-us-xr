import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export default class User {

    private readonly socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.socket = socket;
    }

    getSocket(): Socket {
        return this.socket;
    }


}