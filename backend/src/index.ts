'use strict';
import {Server} from 'socket.io';
import serverConfiguration from './util/ServerConfiguration';
import Controller from "./Controller";

const BACKEND_PORT: number = serverConfiguration.API_HTTP_PORT; // 5000
const FRONTEND_PORT: number = serverConfiguration.REACT_HTTP_PORT; // 3000
const FRONTEND_DOMAIN: string = serverConfiguration.REACT_APP_DOMAIN; // https://localhost

const io = new Server(BACKEND_PORT, {
	cors: {
		origin: `${FRONTEND_DOMAIN}:${FRONTEND_PORT}`,
	},
});

io.on('connect', () => {/*...*/});

const controller = new Controller(io);

console.log(`Server is now listening to port ${BACKEND_PORT} and can be accessed from ${FRONTEND_DOMAIN}:${FRONTEND_PORT}`);