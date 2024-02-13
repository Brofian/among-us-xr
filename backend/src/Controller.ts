import {Server, Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import User from "./user/User";
import userManager from "./user/UserManager";
import socketManager from "./util/SocketManager";
import {SocketConnectionQuery} from "@amongusxr/types/src/System";
import {serverLogger} from "./util/Logger";
import roomManager from "./room/RoomManager";

export default class Controller {

    static io: Server;

    constructor(io: Server) {
        Controller.io = io;
        this.registerIOEvents();
        const rm = roomManager;
    }

    private registerIOEvents(): void {
        Controller.io.on('connection', this.onConnect.bind(this));
    }

    private onConnect(socket: Socket<DefaultEventsMap, DefaultEventsMap>): void {
        // cleanup socket to be sure
        socket.removeAllListeners();

        const query = socket.handshake.query as SocketConnectionQuery;
        const userId = query.userId;

        let user = undefined;
        if (userId && typeof userId === 'string') {
            // search for user by id
            user = userManager.getUserById(userId);
            if (user && user.resurrect(socket)) {
                // try resurrecting user by applying the new socket
                serverLogger.debug(`User ${user.getShortIdentifier()} was resurrected`);
            }
            else {
                user = undefined;
            }
        }

        if (!user) {
            // create a new user object for this socket
            user = new User(socket);
        }

        userManager.addUser(user);
    }
}