import {C2S_EVENT_LIST, C2SPackage} from "@amongusxr/types/src/Events/C2SPackages";
import {Socket} from "socket.io";
import {serverLogger} from "./Logger";

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
        serverLogger.debug(`Received client package: ${event}`)
    }
}

const socketManager = SocketManager.getInstance();
export default socketManager;