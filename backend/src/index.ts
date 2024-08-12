import express from 'express';
import {Server} from 'socket.io';
import serverConfiguration from './util/ServerConfiguration';
import Controller from "./Controller";
import * as http from "node:http";

const backendPort: number = serverConfiguration.BACKEND_PORT; // 5000

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const controller = new Controller(io);
io.on('connection', controller.onConnect.bind(controller));
io.listen(backendPort);

console.log(`Server is now listening to port ${backendPort}`);