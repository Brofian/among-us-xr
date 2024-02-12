import env from "react-dotenv";

const clientConfiguration = {
    API_HTTP_PORT: 		Number.parseInt(env.API_HTTP_PORT) || 5000,
    API_APP_DOMAIN:		                env.API_APP_DOMAIN || 'http://localhost',
    REACT_HTTP_PORT: 	Number.parseInt(env.REACT_HTTP_PORT) || 3000,
    REACT_APP_DOMAIN: 					env.REACT_APP_DOMAIN || 'http://localhost',
    LOG_LEVEL:          Number.parseInt(env.LOG_LEVEL) || 0,
};
export default clientConfiguration;