import {Server, Socket} from "socket.io";
import {serverLogger} from "./util/Logger";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import User from "./user/User";
import UserManager from "./user/UserManager";
import userManager from "./user/UserManager";
import eventManager from "./util/EventManager";
import socketManager from "./util/SocketManager";

export default class Controller {

    static io: Server;

    constructor(io: Server) {
        Controller.io = io;
        this.registerIOEvents();

        setInterval(() => {
            socketManager.sendBroadcastEvent('S2C_PING', {
                text: 'hello back!'
            })
        }, 5000)
    }

    private registerIOEvents(): void {
        Controller.io.on('connection', this.onConnect.bind(this));
    }

    private onConnect(socket: Socket<DefaultEventsMap, DefaultEventsMap>): void {
        // cleanup socket to be sure
        socket.removeAllListeners();
        // create a new user object for this socket
        const user = new User(socket);
        userManager.addUser(user);
    }
}