import User from "./User";
import {serverLogger} from "../util/Logger";

class UserManager {

    private users: User[] = [];

    private constructor() {}

    private static instance: UserManager;
    static getInstance(): UserManager {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    addUser(user: User): void {
        user.getSocket().on('disconnect', this.onDisconnectUser.bind(this, user));
        this.users.push(user);
        serverLogger.debug('User connected');
    }

    private onDisconnectUser(user: User): void {
        const userIndex: number = this.users.indexOf(user);
        if (userIndex !== -1) {
            this.users.splice(userIndex,1);
        }
        serverLogger.debug('User disconnected');
    }


}

const userManager = UserManager.getInstance();
export default userManager;