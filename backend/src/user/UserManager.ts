import User from "./User";
import {serverLogger} from "../util/Logger";
import socketManager, {PACKAGE_EVENT_KEY} from "../util/SocketManager";
import {Socket} from "socket.io";

class UserManager {

    private readonly users: User[] = [];

    private constructor() {}

    private static instance: UserManager;
    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    addUser(user: User): void {
        const socket = user.getSocket();
        socket.on('disconnect', this.onDisconnectUser.bind(this, user));
        socket.on(PACKAGE_EVENT_KEY, socketManager.onSocketPackageReceived.bind(this,socket));

        this.users.push(user);
        serverLogger.debug(`User ${user.getIdentifier().slice(0,8)} connected (${this.users.length} Players connected)`);
    }

    private onDisconnectUser(user: User): void {
        const userIndex: number = this.users.indexOf(user);
        if (userIndex !== -1) {
            this.users.splice(userIndex,1);
        }
        serverLogger.debug(`User ${user.getIdentifier().slice(0,8)} disconnected (${this.users.length} Players connected)`);
    }

    getUserBySocket(socket: Socket): User|undefined {
        return this.users.find(user => user.getSocket() === socket);
    }
}

const userManager = UserManager.getInstance();
export default userManager;