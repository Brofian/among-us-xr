type LocalEvents = string;
export default LocalEvents;


export type SocketStateChangedEvent = {
    'state': 'connected' | 'disconnected'
};