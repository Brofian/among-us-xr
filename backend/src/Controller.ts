import {Server, Socket} from "socket.io";
import {serverLogger} from "./util/Logger";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import User from "./user/User";
import UserManager from "./user/UserManager";
import userManager from "./user/UserManager";

export default class Controller {

    constructor(io: Server) {
        this.registerIOEvents(io);
    }

    private registerIOEvents(io: Server): void {
        io.on('connection', this.onConnect.bind(this));
    }

    private onConnect(socket: Socket<DefaultEventsMap, DefaultEventsMap>): void {
        const user = new User(socket);
        userManager.addUser(user);
    }

}