import eventManager from "./EventManager";
import {S2C_EVENT_LIST, S2CPackage} from "@amongusxr/types/src/Events/S2CPackages";
import {C2S_EVENT_LIST, C2SPackage} from "@amongusxr/types/src/Events/C2SPackages";
import Controller from "../Controller";
import {Socket} from "socket.io";
import {serverLogger} from "./Logger";
import userManager from "../user/UserManager";

export const PACKAGE_EVENT_KEY = 'package';

// https://socket.io/docs/v3/emit-cheatsheet/
class SocketManager {

    private constructor() {}

    private static instance: SocketManager;
    static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    onSocketPackageReceived(socket: Socket, eventPackage: C2SPackage<keyof C2S_EVENT_LIST>): void {
        if (eventPackage === undefined) {
            serverLogger.error('Encountered undefined package...');
            return;
        }
        const {event, eventData} = eventPackage;
        eventData.userId = userManager.getUserBySocket(socket).getIdentifier() || 'undefined';
        eventManager.emit(event, eventData);
        serverLogger.debug(`Received client package: ${event}`)
    }

    private wrapEventInPackage<E extends keyof S2C_EVENT_LIST>(event: E, data: S2C_EVENT_LIST[E]): S2CPackage<E> {
        return {
          event: event,
          eventData: data
        };
    }

    sendSocketEvent<E extends keyof S2C_EVENT_LIST>(socket: Socket, event: E, data: S2C_EVENT_LIST[E]): void {
        socket.send(PACKAGE_EVENT_KEY, this.wrapEventInPackage(event, data));
    }

    sendBroadcastEvent<E extends keyof S2C_EVENT_LIST>(event: E, data: S2C_EVENT_LIST[E]): void {
        Controller.io.emit(PACKAGE_EVENT_KEY, this.wrapEventInPackage(event, data));
    }

    sendRoomEvent<E extends keyof S2C_EVENT_LIST>(room: string, event: E, data: S2C_EVENT_LIST[E]): void {
        Controller.io.in(room).emit(PACKAGE_EVENT_KEY, this.wrapEventInPackage(event, data));
    }
}

const socketManager = SocketManager.getInstance();
export default socketManager;