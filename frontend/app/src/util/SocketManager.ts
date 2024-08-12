import {io, Socket} from "socket.io-client";
import clientConfiguration from "./ClientConfiguration";
import EventManager from "./EventManager";
import {SocketStateChangedEvent} from "./Events/LocalEvents";


class SocketManagerContainer {

    private readonly socket: Socket;

    constructor() {
        const socketEndpoint = `${clientConfiguration.BACKEND_URL}:${clientConfiguration.BACKEND_PORT}`;
        console.log(`attempt socket connection to ${socketEndpoint}`);
        this.socket = new io(socketEndpoint, {
            secure: clientConfiguration.BACKEND_SSL,
            transports: ["websocket"],
        });
        this.socket.on('connect_error', (err) => console.error(err));
        this.socket.on('connect', this.onSocketConnect.bind(this));
        this.socket.on('disconnect', this.onSocketDisconnect.bind(this));
    }

    private onSocketConnect(): void {
        console.log('socket connect');
        const event: SocketStateChangedEvent = {state: 'connected'};
        EventManager.notify('socket_state_changed', event)
    }

    private onSocketDisconnect(): void {
        console.log('socket disconnect');
        const event: SocketStateChangedEvent = {state: 'disconnected'};
        EventManager.notify('socket_state_changed', event)
    }

    public isConnected(): boolean {
        return this.socket.connected;
    }

}

const SocketManager = new SocketManagerContainer();
export default SocketManager;