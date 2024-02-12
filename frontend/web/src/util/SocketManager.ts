import { io, Socket } from 'socket.io-client';
import clientConfiguration from "./ClientConfiguration";
import {clientLogger} from "./Logger";
import eventManager from "./EventManager";

class SocketManager {

    protected readonly socket: Socket;

    private static instance: SocketManager;
    private constructor() {
        clientLogger.debug(
            'Starting connection using environment variables. ',
            `Resulting in ${clientConfiguration.API_APP_DOMAIN}:${clientConfiguration.API_HTTP_PORT}`
        );

        this.socket = io(clientConfiguration.API_APP_DOMAIN + ':' + clientConfiguration.API_HTTP_PORT);
        this.socket.on('connect', this.onConnectionStatusChanged.bind(this, true));
        this.socket.on('disconnect', this.onDisconnected.bind(this));
        this.socket.on(
            'connect_error',
            this.onConnectionStatusChanged.bind(this, false)
        );
        this.socket.io.on('reconnect', this.onReconnected.bind(this));
    }

    static getInstance(): SocketManager {
        if (!this.instance) {
            this.instance = new SocketManager();
        }
        return this.instance;
    }

    protected onConnectionStatusChanged(status: boolean): void {
        eventManager.emit('CONNECTION_STATUS_C', {
            connected: status
        });
        clientLogger.debug("Socket connection status changed: ", status);
    }

    protected onDisconnected(): void {
        this.onConnectionStatusChanged(false);
    }

    protected onReconnected(): void {
        this.onConnectionStatusChanged(true);
    }

    public isConnected(): boolean {
        return !!this.socket?.connected;
    }

    public getSocket(): Socket {
        return this.socket;
    }

    public sendEvent(eventName: string, data: object): void {
        clientLogger.debug(`Sending event ${eventName}`);
        this.socket.emit(eventName, data);
    }

    public subscribeEvent(eventName: string, listener: {(): void}): void {
        clientLogger.debug(`Subscribing event ${eventName} with `, listener);
        this.socket.on(eventName, listener);
    }
}

const socketManager = SocketManager.getInstance();
export default socketManager;