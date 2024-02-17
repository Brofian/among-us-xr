import {v4 as uuidV4} from "uuid";
import User from "../user/User";
import eventManager from "../util/EventManager";
import {serverLogger} from "../util/Logger";
import GameInstance from "../Game/GameInstance";
import socketManager from "../util/SocketManager";

export default class Room {

    private readonly code: string;
    private readonly users: {[key: string]: User} = {};
    private administrator: User;
    private gameInstance: GameInstance;

    constructor(administrator: User) {
        this.code = uuidV4().slice(0,8);
        this.gameInstance = new GameInstance(this.code);
        this.addUser(administrator);
        this.administrator = administrator;
    }

    getCode(): string {
        return this.code;
    }

    getAdministrator(): User {
        return this.administrator;
    }

    forAllUsers(callback: {(user: User): void}): void {
        for (const userId in this.users) {
            callback(this.users[userId]);
        }
    }

    hasUserWithId(userId: string): boolean {
        return (userId in this.users);
    }

    addUser(user: User): void {
        this.users[user.getIdentifier()] = user;

        // if the game has already started, set the player as a spectator immediately, skipping selection
        if (this.getGameInstance().getPhase() !== 'setup') {
            this.gameInstance.getPlayerManager().setUserRole(user, 'spectator');
        }
    }

    removeUser(user: User): void {
        const userId = user.getIdentifier();
        if (!(userId in this.users)) {
            return;
        }
        delete this.users[userId];

        this.gameInstance.getPlayerManager().removeUser(user);
        serverLogger.debug(`User ${user.getShortIdentifier()} left room ${this.code} (${this.users.length} members)`);

        if (this.getNumUsers() === 0) {
            eventManager.emit('S_ROOM_CLOSING_TRIGGERED', {roomCode: this.code});
        }
        else if (user === this.administrator) {
            // select a new administrator
            this.administrator = this.users[0];
        }
    }

    getNumUsers(): number {
        const counter: {num: number} = {num: 0};
        this.forAllUsers(() => counter.num++);
        return counter.num;
    }

    getGameInstance(): GameInstance {
        return this.gameInstance;
    }

    sendRoomUpdatedEvent(): void {
        socketManager.sendRoomEvent(this.code, 'S2C_ROOM_UPDATED', {
           administratorId: this.administrator.getIdentifier()
        });
    }
}