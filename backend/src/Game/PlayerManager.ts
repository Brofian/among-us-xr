import User from "../user/User";
import {UserRoles} from "@amongusxr/types/src/User";
import {C2SPositionChangedEvent, C2SSelectRoleEvent} from "@amongusxr/types/src/Events/C2SPackages";
import GameInstance from "./GameInstance";
import socketManager from "../util/SocketManager";
import {Task} from "@amongusxr/types/src/Game/PointsOfInterest";
import {Coordinate, PlayerTask} from "@amongusxr/types/src/Game/DataTypes";
import MathHelper from "../math/MathHelper";
import Vector from "../math/Vector";
import {serverLogger} from "../util/Logger";


type PlayerData = {
    user: User,
    position: Vector,
    lastPositionChange: number;
    taskList: PlayerTask[],
    job: 'crewmate'|'imposter'
};

export default class PlayerManager {

    private readonly gameInstance: GameInstance;
    private readonly roomCode: string;

    // exclusive user groups
    private players: {[key: string]: PlayerData} = {}
    private spectators: {[key: string]: User} = {}
    private gameObjects: {[key: string]: User} = {}



    constructor(gameInstance: GameInstance, roomCode: string) {
        this.gameInstance = gameInstance;
        this.roomCode = roomCode;
    }

    getPlayersAsArray(): User[] {
        const userList: User[] = [];
        for (const userId in this.players) {
            userList.push(this.players[userId].user);
        }
        return userList;
    }

    getPlayerDataAsArray(filter: {(player: PlayerData): boolean}|undefined = undefined): PlayerData[] {
        const playerDataList: PlayerData[] = [];
        for (const userId in this.players) {
            const playerData = this.players[userId];
            if (!filter || filter(playerData)) {
                playerDataList.push(playerData);
            }
        }
        return playerDataList;
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
                this.players[userId] = {
                    user: user,
                    taskList: [],
                    position: Vector.fromCoordinate({latitude: 0, longitude: 0}),
                    lastPositionChange: 0,
                    job: 'crewmate'
                };
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
        return (this.players[user.getIdentifier()]?.job === 'imposter');
    }

    onPlayerSelectRole(user: User, event: C2SSelectRoleEvent): void {
        this.setUserRole(user, event.selectedRole);
        user.sendUserUpdatedEvent();
    }

    onPlayerPositionChanged(user: User, event: C2SPositionChangedEvent): void {
        const playerData = this.players[user.getIdentifier()];
        const now = Date.now();
        // only accept one position change per second
        if (playerData && playerData.lastPositionChange < (now-999)) {
            playerData.lastPositionChange = now;

            const newPosition = Vector.fromCoordinate(event.position);
            if (newPosition.isDifferent(playerData.position)) {
                playerData.position = newPosition;
                this.recalculateReachableTasks(playerData);
            }
        }
    }

    recalculateReachableTasks(player: PlayerData): void {
        const playerReach = 1; // TODO make configurable
        let hasChanged: boolean = false;

        for (const task of player.taskList) {
            const distToTask = player.position.distSqr(Vector.fromCoordinate(task.position));
            const newReachableState = distToTask <= playerReach;
            hasChanged ||= task.isReachable !== newReachableState;
            task.isReachable = newReachableState;
        }

        if (hasChanged) {
            this.sendPlayerGameUpdate(player, false);
        }
    }

    sendGameUpdate(): void {
        socketManager.sendRoomEvent(this.roomCode, 'S2C_GAME_UPDATED', {
            gamePhase: this.gameInstance.getPhase()
        });
    }

    sendAllPlayerGameUpdates(sendUniversalData: boolean = false): void {
        for (const player of this.getPlayerDataAsArray()) {
            this.sendPlayerGameUpdate(player, sendUniversalData);
        }
    }

    sendPlayerGameUpdate(player: PlayerData, sendUniversalData: boolean = false): void {
        // send general game data (mostly send one time at the start of the game)
        if (sendUniversalData) {
            socketManager.sendSocketEvent(player.user.getSocket(), 'S2C_UNIVERSAL_PLAYER_GAME_UPDATE', {
                job: player.job
            });
        }

        if (player.job === 'imposter') {
            // send imposter data
            // TODO implement placeholders
            socketManager.sendSocketEvent(player.user.getSocket(), 'S2C_IMPOSTER_GAME_UPDATE', {
                killTimeout: 10, // TODO make configurable
                tasks: player.taskList, // imposters get tasks too, they just do not have to do them
                hazards: [],
                doors: [],
            });
        }
        else {
            // send crewmate data
            // TODO implement tasks placeholder
            socketManager.sendSocketEvent(player.user.getSocket(), 'S2C_CREWMATE_GAME_UPDATE', {
                tasks: player.taskList
            });
        }
    }

    selectImposters(numImposters: number): void {
        const players = this.getPlayerDataAsArray();
        if(players.length <= 1) {
            serverLogger.error(`Attempted imposter selection without enough players (${players.length})`);
            return;
        }

        for (const player of players) player.job = 'crewmate';
        const maxImposters = Math.floor(players.length / 2);
        let imposterSpotsRemaining = Math.min(numImposters, maxImposters);
        do {
            const nextImposter = MathHelper.randomFromArray(players);
            if (nextImposter.job !== 'imposter') {
                nextImposter.job = 'imposter';
                imposterSpotsRemaining--;
            }
        }
        while (imposterSpotsRemaining > 0);
    }

    assignTasks(numTasks: number, taskCollection: Task[]): void {
        const requiredTasks = Math.min(numTasks, taskCollection.length);

        for (const player of this.getPlayerDataAsArray()) {
            while (player.taskList.length < requiredTasks) {
                const newTask = MathHelper.randomFromArray(taskCollection);
                if (!player.taskList.find(task => task.name === newTask.name)) {
                    player.taskList.push({
                        name: newTask.name,
                        position: newTask.position,
                        duration: newTask.duration,
                        isReachable: false
                    });
                }
            }
        }
    }

    getImposters(): PlayerData[] {
        return this.getPlayerDataAsArray(p => p.job === 'imposter');
    }
}