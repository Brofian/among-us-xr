import {S2CRoomUpdatedEvent} from "@amongusxr/types/src/Events/S2CPackages";
import eventManager from "../util/EventManager";

class RoomManager {

    private administratorId?: string;

    private constructor() {
        this.registerEvents();
    }
    private static instance: RoomManager;
    static getInstance(): RoomManager {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    registerEvents(): void {
        eventManager.on("S2C_ROOM_UPDATED", this.onRoomUpdated.bind(this));
    }

    onRoomUpdated(event: S2CRoomUpdatedEvent): void {
        const {administratorId} = event;
        this.administratorId = administratorId;
        eventManager.emit("C_ROOM_UPDATED", {});
    }

    getAdministratorId(): string|undefined {
        return this.administratorId;
    }



}

const roomManager = RoomManager.getInstance();
export default roomManager;