import { io, Socket } from 'socket.io-client';
import clientConfiguration from "./ClientConfiguration";
import {clientLogger} from "./Logger";
import eventManager from "./EventManager";
import {C2S_EVENT_LIST, C2SPackage} from "@amongusxr/types/src/Events/C2SPackages";
import {S2C_EVENT_LIST, S2CPackage} from "@amongusxr/types/src/Events/S2CPackages";

const PACKAGE_EVENT_KEY = 'package';

class SocketManager {

    protected readonly socket: Socket;

    private constructor() {
        const APP_ENDPOINT = `${clientConfiguration.API_APP_DOMAIN}:${clientConfiguration.API_HTTP_PORT}`;

        clientLogger.debug(
            'Starting connection using environment variables. ',
            `Resulting in ${APP_ENDPOINT}`
        );
        this.socket = io(APP_ENDPOINT, {
            query: {
                userId: 'this-should-be-my-user-id'
            }
        });
        this.socket.on('connect', this.onConnectionStatusChanged.bind(this, true));
        this.socket.on('disconnect', this.onDisconnected.bind(this));
        this.socket.on('connect_error',this.onConnectionStatusChanged.bind(this, false));
        this.socket.io.on('reconnect', this.onReconnected.bind(this));
        this.socket.on(PACKAGE_EVENT_KEY, this.onSocketPackageReceived.bind(this))
    }

    private static instance: SocketManager;
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


    /**
     * Redirect S2C Events to the general event manager
     *
     * @param eventPackage
     * @private
     */
    private onSocketPackageReceived(eventPackage: S2CPackage<keyof S2C_EVENT_LIST>): void {
        const {event, eventData} = eventPackage;
        clientLogger.debug(`Received event package ${event}`);
        eventManager.emit(event, eventData);
    }

    /**
     * Wrap C2S Events into a package and send it to the server
     *
     * @param event
     * @param data
     */
    public sendEvent<E extends keyof C2S_EVENT_LIST>(event: E, data: C2S_EVENT_LIST[E]): void {
        clientLogger.debug(`Sending event package ${event}`);
        this.socket.emit(PACKAGE_EVENT_KEY, {
            event: event,
            eventData: data
        } as C2SPackage<E>);
    }
}

const socketManager = SocketManager.getInstance();
export default socketManager;