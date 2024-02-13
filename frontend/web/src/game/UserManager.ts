import {UserRoles} from "@amongusxr/types/src/User";
import {S2CUserUpdatedEvent} from "@amongusxr/types/src/Events/S2CPackages";
import eventManager from "../util/EventManager";
import socketManager from "../util/SocketManager";

class UserManager {

    private userId?: string;
    private role?: UserRoles;
    private roomCode?: string;

    private constructor() {
        this.registerEvents();
    }
    private static instance: UserManager;
    static getInstance(): UserManager {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    registerEvents(): void {
        eventManager.on("S2C_USER_UPDATED", this.onUserUpdated.bind(this));
    }

    onUserUpdated(event: S2CUserUpdatedEvent): void {
        const {userId, role} = event;
        this.userId = userId;
        this.role = role;
        this.roomCode = event.roomCode;
        socketManager.socketQuery.userId = this.userId;
        eventManager.emit("C_USER_UPDATED", {});
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



}

const userManager = UserManager.getInstance();
export default userManager;