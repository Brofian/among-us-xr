import {Server} from "socket.io";
import {serverLogger} from "./util/Logger";

export default class Controller {

    constructor(io: Server) {
        this.registerIOEvents(io);
    }

    private registerIOEvents(io: Server): void {
        io.on('connection', this.onConnect.bind(this));
    }

    private onConnect(): void {
        serverLogger.debug("on connect triggered");
    }

}