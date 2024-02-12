import {Server, Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import User from "./user/User";
import userManager from "./user/UserManager";
import socketManager from "./util/SocketManager";

export default class Controller {

    static io: Server;

    constructor(io: Server) {
        Controller.io = io;
        this.registerIOEvents();
    }

    private registerIOEvents(): void {
        Controller.io.on('connection', this.onConnect.bind(this));
    }

    private onConnect(socket: Socket<DefaultEventsMap, DefaultEventsMap>): void {
        // cleanup socket to be sure
        socket.removeAllListeners();

        const userId = socket.handshake.query.userId;

        let user = undefined;
        if (userId && typeof userId === 'string') {
            // search for user by id
            user = userManager.getUserById(userId);
            if (user) {
                // try resurrecting user by applying the new socket
                user.resurrect(socket);
            }
        }

        if (!user) {
            // create a new user object for this socket
            user = new User(socket);
        }

        userManager.addUser(user);
    }
}