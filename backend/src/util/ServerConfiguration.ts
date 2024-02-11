import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.resolve(__dirname + '/./../.env'),
});

const serverConfiguration = {
	API_HTTP_PORT: 		Number.parseInt(process.env.API_HTTP_PORT) || 5000,
	REACT_HTTP_PORT: 	Number.parseInt(process.env.REACT_HTTP_PORT) || 80,
	REACT_APP_DOMAIN: 					process.env.REACT_APP_DOMAIN || 'http://localhost',
};
export default serverConfiguration;