const clientConfiguration = {
	BACKEND_PORT: 		  Number.parseInt(process.env.EXPO_PUBLIC_BACKEND_PORT || '5000'),
	BACKEND_URL: 					 			process.env.EXPO_PUBLIC_BACKEND_URL,
	BACKEND_SSL: 					 			process.env.EXPO_PUBLIC_BACKEND_SSL === '1',
};

export default clientConfiguration;