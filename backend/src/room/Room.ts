import {v4 as uuidV4} from "uuid";
import User from "../user/User";
import {UserRoles} from "@amongusxr/types/src/User";
import eventManager from "../util/EventManager";
import {serverLogger} from "../util/Logger";

export default class Room {

    private readonly code: string;
    private readonly users: User[] = [];
    private administrator: User;
    private gameRunning: boolean = false;

    constructor(administrator: User, adminUsername: string) {
        this.code = uuidV4().slice(0,8);
        this.addUser(administrator, adminUsername);
        this.administrator = administrator;
    }

    getCode(): string {
        return this.code;
    }

    getAdministrator(): User {
        return this.administrator;
    }

    getUsers(): User[] {
        return this.users;
    }

    /**
     * Two-way method, adding a user to this room and updating the user object
     * @param user
     * @param username
     */
    addUser(user: User, username: string): void {
        if (this.users.indexOf(user) === -1) {
            this.users.push(user);
            user.joinRoom(this, username);
            serverLogger.debug(`User ${user.getShortIdentifier()} joined room ${this.code} (${this.users.length} members)`);
        }
    }

    /**
     * Two-way method, removing a user from this room and updating the user object
     * @param user
     */
    removeUser(user: User): void {
        const userIndex = this.users.indexOf(user);
        if (userIndex === -1) {
            return;
        }
        this.users.splice(userIndex,1);

        user.leaveRoom();

        serverLogger.debug(`User ${user.getShortIdentifier()} left room ${this.code} (${this.users.length} members)`);

        if (this.users.length === 0) {
            eventManager.emit('S_ROOM_CLOSING_TRIGGERED', {roomCode: this.code});
        }
        else if (user === this.administrator) {
            // select a new administrator
            this.administrator = this.users[0];
        }
    }

    getDefaultUserRole(): UserRoles {
        return this.gameRunning ? 'spectator' : 'queued';
    }
}