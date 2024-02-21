import {v4 as uuidV4} from "uuid";
import User from "../user/User";
import eventManager from "../util/EventManager";
import {serverLogger} from "../util/Logger";
import GameInstance from "../Game/GameInstance";
import socketManager from "../util/SocketManager";

type UserData = {
    user: User;
    username: string;
}

export default class Room {

    private readonly code: string;
    private readonly users: UserData[] = [];
    private administrator: User;
    private gameInstance: GameInstance;

    constructor(administrator: User, administratorUsername: string) {
        this.code = uuidV4().slice(0,8);
        this.gameInstance = new GameInstance(this.code);
        this.administrator = administrator;
        this.addUser(administrator, administratorUsername);
    }

    getCode(): string {
        return this.code;
    }

    getUsers(): UserData[] {
        return this.users;
    }

    getAdministrator(): User {
        return this.administrator;
    }

    hasUserWithId(userId: string): boolean {
        return this.users.find(user => user.user.getIdentifier() === userId) !== undefined;
    }

    addUser(user: User, username: string): void {
        const userIndex = this.users.findIndex(el => el.user === user);
        if (userIndex === -1) {
            this.users.push({
                user: user,
                username: username
            });
        }

        // if the game has already started, set the player as a spectator immediately, skipping selection
        if (this.getGameInstance().getPhase() !== 'setup') {
            this.gameInstance.getPlayerManager().setUserRole(user, 'spectator');
        }

        this.sendRoomUpdatedEvent();
    }

    removeUser(user: User): void {
        const userIndex = this.users.findIndex(el => el.user === user);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        }

        this.gameInstance.getPlayerManager().removeUser(user);
        serverLogger.debug(`User ${user.getShortIdentifier()} left room ${this.code} (${this.users.length} members)`);

        if (this.users.length === 0) {
            eventManager.emit('S_ROOM_CLOSING_TRIGGERED', {roomCode: this.code});
        }
        else if (user === this.administrator) {
            // select a new administrator
            this.administrator = this.users[0].user;
        }

        this.sendRoomUpdatedEvent();
    }

    getGameInstance(): GameInstance {
        return this.gameInstance;
    }

    sendRoomUpdatedEvent(): void {
        socketManager.sendRoomEvent(this.code, 'S2C_ROOM_UPDATED', {
            roomCode: this.code,
            administratorId: this.administrator.getIdentifier(),
            playerList: this.users.map((data: UserData) => {
                return {
                    id: data.user.getIdentifier(),
                    username: data.username
                };
            })
        });
    }
}