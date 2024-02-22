import {io, Socket} from 'socket.io-client';
import clientConfiguration from "./ClientConfiguration";
import {clientLogger} from "./Logger";
import eventManager from "./EventManager";
import {C2S_EVENT_LIST, C2SPackage} from "@amongusxr/types/src/Events/C2SPackages";
import {S2C_EVENT_LIST, S2CPackage} from "@amongusxr/types/src/Events/S2CPackages";
import gameManager from "../game/GameManager";
import {SocketConnectionQuery} from "@amongusxr/types/src/System";
import * as fs from "fs";

const PACKAGE_EVENT_KEY = 'package';

class SocketManager {

    private readonly socket: Socket;

    public readonly socketQuery: SocketConnectionQuery = {
        userId: gameManager.getUserId()
    }

    private constructor() {
        const APP_ENDPOINT = `${clientConfiguration.API_APP_DOMAIN}:${clientConfiguration.API_HTTP_PORT}`;

        clientLogger.debug(
            'Starting connection using environment variables. ',
            `Resulting in ${APP_ENDPOINT}`
        );

        this.socket = io(APP_ENDPOINT, {
            query: this.socketQuery,
            rejectUnauthorized: false,
            transports: ['websocket']
        });


        this.socket.on('connect', this.onConnectionStatusChanged.bind(this, true));
        this.socket.on('disconnect', this.onDisconnected.bind(this));
        this.socket.on('connect_error',(err) => {
            console.log(err);
            this.onConnectionStatusChanged(false);
        });
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
        eventManager.emit('C_CONNECTION_STATUS', {
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