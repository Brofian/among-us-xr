import User from "../user/User";
import {UserRoles} from "@amongusxr/types/src/User";
import {C2SSelectRoleEvent} from "@amongusxr/types/src/Events/C2SPackages";
import GameInstance from "./GameInstance";
import socketManager from "../util/SocketManager";

export default class PlayerManager {

    private readonly gameInstance: GameInstance;
    private readonly roomCode: string;

    // exclusive user groups
    private players: {[key: string]: User} = {}
    private spectators: {[key: string]: User} = {}
    private gameObjects: {[key: string]: User} = {}
    // game specifications
    private imposters: User[] = [];


    constructor(gameInstance: GameInstance, roomCode: string) {
        this.gameInstance = gameInstance;
        this.roomCode = roomCode;
    }

    getPlayersAsArray(): User[] {
        const userList: User[] = [];
        for (const userId in this.players) {
            userList.push(this.players[userId]);
        }
        return userList;
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
        console.log(`setting ${userId} to role ${role}`);
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

    isImposter(user: User): boolean {
        return this.imposters.includes(user);
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

    sendPlayerGameUpdates(sendUniversalData: boolean = false): void {
        for (const user of this.getPlayersAsArray()) {
            const isImposter = this.isImposter(user);

            // send general game data (mostly send one time at the start of the game)
            if (sendUniversalData) {
                socketManager.sendSocketEvent(user.getSocket(), 'S2C_UNIVERSAL_PLAYER_GAME_UPDATE', {
                    job: isImposter ? 'imposter' : 'crewmate'
                });
            }

            if (isImposter) {
                // send imposter data
                // TODO implement placeholders
                socketManager.sendSocketEvent(user.getSocket(), 'S2C_IMPOSTER_GAME_UPDATE', {
                    killTimeout: 10, // TODO make configurable
                    hazards: [],
                    doors: [],
                });
            }
            else {
                // send crewmate data
                // TODO implement tasks placeholder
                socketManager.sendSocketEvent(user.getSocket(), 'S2C_CREWMATE_GAME_UPDATE', {
                    tasks: []
                });
            }

        }
    }

    selectImposters(numImposters: number): void {
        const players = this.getPlayersAsArray();
        const maxImposters = Math.floor(players.length / 2);
        let imposterSpotsRemaining = Math.min(numImposters, maxImposters);
        this.imposters = [];
        do {
            const nextImposter = players[Math.floor(Math.random() * players.length)];
            if (!this.imposters.includes(nextImposter)) {
                this.imposters.push(nextImposter);
                imposterSpotsRemaining--;
            }
        }
        while (imposterSpotsRemaining > 0);
    }

    getImposters(): User[] {
        return this.imposters;
    }
}