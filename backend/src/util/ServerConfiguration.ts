import dotenv from 'dotenv';
import path from 'path';
import * as process from "process";

dotenv.config({
	path: path.resolve(__dirname + '/./../.env'),
});

const serverConfiguration = {
	API_HTTP_PORT: 		Number.parseInt(process.env.API_HTTP_PORT) || 5000,
	REACT_HTTP_PORT: 	Number.parseInt(process.env.REACT_HTTP_PORT) || 3000,
	REACT_APP_DOMAIN: 					process.env.REACT_APP_DOMAIN || 'http://localhost',
	LOG_LEVEL: 			Number.parseInt(process.env.LOG_LEVEL) || 0,
};

export default serverConfiguration;