import User from "../user/User";
import {UserRoles} from "@amongusxr/types/src/User";
import {C2SSelectRoleEvent} from "@amongusxr/types/src/Events/C2SPackages";
import GameInstance from "./GameInstance";
import socketManager from "../util/SocketManager";

export default class PlayerManager {

    private readonly gameInstance: GameInstance;
    private readonly roomCode: string;

    private players: {[key: string]: User} = {}
    private spectators: {[key: string]: User} = {}
    private gameObjects: {[key: string]: User} = {}

    constructor(gameInstance: GameInstance, roomCode: string) {
        this.gameInstance = gameInstance;
        this.roomCode = roomCode;
    }

    removeUser(user: User): void {
        const userId = user.getIdentifier();
        delete this.players[userId];
        delete this.spectators[userId];
        delete this.gameObjects[userId];
    }

    setUserRole(user: User, role: UserRoles): void {
        this.removeUser(user);
        const userId = user.getIdentifier();
        switch (role) {
            case "player":
                this.players[userId] = user;
                break;
            case "spectator":
                this.spectators[userId] = user;
                break;
            case "game_object":
                this.gameObjects[userId] = user;
                break;
        }
    }

    getUserRole(user: User): UserRoles {
        const userId = user.getIdentifier();
        if (userId in this.players) return 'player';
        if (userId in this.spectators) return 'spectator';
        if (userId in this.gameObjects) return 'game_object';
        return 'queued';
    }


    onPlayerSelectRole(user: User, event: C2SSelectRoleEvent): void {
        this.setUserRole(user, event.selectedRole);
        user.sendUserUpdatedEvent();
    }

    sendGameUpdate(): void {
        socketManager.sendRoomEvent(this.roomCode, 'S2C_GAME_UPDATED', {
            gamePhase: this.gameInstance.getPhase()
        });
    }
}