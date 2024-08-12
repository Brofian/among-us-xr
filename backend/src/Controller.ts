import {Server, Socket} from "socket.io";
import {SocketConnectionQuery} from "@amongusxr/types/src/System";

export default class Controller {

    private readonly io: Server;

    constructor(io: Server) {
        this.io = io;
    }


    public onConnect(socket: Socket): void {
        // cleanup socket to be sure
        socket.removeAllListeners();
        socket.on('disconnect', this.onDisconnect.bind(this, socket));

        const query = socket.handshake.query as SocketConnectionQuery;
        const userId = query.userId;

        let user = undefined;
        if (userId) {

        }

        console.log(`User ${socket.id} connected! (${userId})`);
    }

    private onDisconnect(socket: Socket): void {
        console.log(`User ${socket.id} disconnected!`);
    }
}