'use strict';

import * as http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import serverConfiguration from './util/ServerConfiguration';
import Controller from "./Controller";

const BACKEND_PORT: number = serverConfiguration.API_HTTP_PORT;
const FRONTEND_PORT: number = serverConfiguration.REACT_HTTP_PORT;
const FRONTEND_DOMAIN: string = serverConfiguration.REACT_APP_DOMAIN;

// setup server
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: `${FRONTEND_DOMAIN}:${FRONTEND_PORT}`,
	},
});

const controller = new Controller(io);
io.listen(BACKEND_PORT);
controller.onServerClose();