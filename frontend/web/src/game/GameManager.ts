import {PlayerList, UserRoles} from "@amongusxr/types/src/User";
import {S2CGameUpdatedEvent, S2CRoomUpdatedEvent, S2CUserUpdatedEvent} from "@amongusxr/types/src/Events/S2CPackages";
import eventManager from "../util/EventManager";
import socketManager from "../util/SocketManager";
import {GamePhases} from "@amongusxr/types/src/Game/DataTypes";

class GameManager {

    private userId?: string;
    private role?: UserRoles;
    private roomCode?: string;
    private roomAdminId?: string;
    private gamePhase: GamePhases = 'setup';
    private playerList: PlayerList = [];

    private constructor() {
        this.registerEvents();
    }
    private static instance: GameManager;
    static getInstance(): GameManager {
        if (!this.instance) {
            this.instance = new GameManager();
        }
        return this.instance;
    }

    registerEvents(): void {
        eventManager.on("S2C_USER_UPDATED", this.onUserUpdated.bind(this));
        eventManager.on("S2C_ROOM_UPDATED", this.onRoomUpdated.bind(this));
        eventManager.on("S2C_GAME_UPDATED", this.onGameUpdated.bind(this));
    }

    onUserUpdated(event: S2CUserUpdatedEvent): void {
        const {userId, role} = event;
        this.userId = userId;
        this.role = role;
        socketManager.socketQuery.userId = this.userId;
        eventManager.emit("C_USER_UPDATED", {});
    }

    onRoomUpdated(event: S2CRoomUpdatedEvent): void {
        const {roomCode, administratorId, playerList} = event;
        this.roomCode = roomCode;
        this.roomAdminId = administratorId;
        this.playerList = playerList;
        eventManager.emit("C_ROOM_UPDATED", {});
    }

    onGameUpdated(event: S2CGameUpdatedEvent): void {
        const {gamePhase} = event;
        this.gamePhase = gamePhase;
        eventManager.emit("C_GAME_UPDATED", {});
    }

    getUserId(): string|undefined {
        return this.userId;
    }
    getRole(): UserRoles|undefined {
        return this.role;
    }
    getRoomCode(): string|undefined {
        return this.roomCode;
    }
    getPlayerList(): PlayerList {
        return this.playerList;
    }
    getAdministratorId(): string|undefined {
        return this.roomAdminId;
    }
}

const gameManager = GameManager.getInstance();
export default gameManager;