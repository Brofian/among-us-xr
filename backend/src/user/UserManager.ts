import User from "./User";
import {serverLogger} from "../util/Logger";
import socketManager, {PACKAGE_EVENT_KEY} from "../util/SocketManager";
import {Socket} from "socket.io";
import {UserRemovalTriggeredEvent} from "@amongusxr/types/src/Events/ServerEvents";
import eventManager from "../util/EventManager";

class UserManager {

    private readonly users: User[] = [];

    private constructor() {
        eventManager.on('S_USER_REMOVAL_TRIGGERED', this.onRemoveUser.bind(this));
    }

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
        if (!this.users.includes(user)) {
            this.users.push(user);
        }
        serverLogger.debug(`User ${user.getShortIdentifier()} connected (${this.users.length} Players connected)`);
    }

    private onDisconnectUser(user: User): void {
        if (!user.hasInactiveRole() ) {
            // leave the user as a zombie without a connected socket
            serverLogger.debug(`User ${user.getShortIdentifier()} disconnected but remained as zombie (${this.users.length} Players connected)`);
            return;
        }

        this.onRemoveUser({userId: user.getIdentifier()});
        serverLogger.debug(`User ${user.getShortIdentifier()} disconnected (${this.users.length} Players connected)`);
    }

    private onRemoveUser(event: UserRemovalTriggeredEvent): void {
        const user = this.getUserById(event.userId);
        if (!user) return;

        user.leaveRoom();
        const userIndex: number = this.users.indexOf(user);
        if (userIndex !== -1) {
            this.users.splice(userIndex,1);
        }

        const socket = user.getSocket();
        if (socket && socket.connected) {
            socket.disconnect();
            serverLogger.debug(`User ${user.getShortIdentifier()} was forcefully disconnected`);
        }
    }

    getUserBySocket(socket: Socket): User|undefined {
        return this.users.find(user => user.getSocket() === socket);
    }
    getUserById(userId: string): User|undefined {
        return this.users.find(user => user.getIdentifier() === userId);
    }
}

const userManager = UserManager.getInstance();
export default userManager;