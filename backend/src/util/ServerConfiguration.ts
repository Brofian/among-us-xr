import dotenv from 'dotenv';
import path from 'path';
import * as process from "process";

declare var __dirname: string;

dotenv.config({
	path: path.resolve(__dirname + '/./../.env'),
});

const serverConfiguration = {
	BACKEND_PORT: 			Number.parseInt(process.env.BACKEND_PORT || '3000'),
	LOG_LEVEL: 				Number.parseInt(process.env.LOG_LEVEL||'0'),
};

export default serverConfiguration;