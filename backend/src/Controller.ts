import {Server} from "socket.io";

export default class Controller {

    constructor(io: Server) {
        this.registerIOEvents(io);
    }

    private registerIOEvents(io: Server): void {
        io.on('connection', this.onConnect.bind(this));
    }

    private onConnect(): void {
        console.log("on connect triggered");
    }

    onServerClose(): void {
        console.log("socket closed unexpectedly");
    }

}