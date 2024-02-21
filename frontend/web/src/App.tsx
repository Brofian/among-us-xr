import React, {Component} from 'react';
import socketManager from "./util/SocketManager";
import Navigator from "./views/Navigator";
import ConnectionNotification from "./views/Components/ConnectionNotification";
import gpsHelper from "./util/GpsHelper";


export default class App extends Component<{}, {}>{

    constructor(props: {}) {
        super(props);
        socketManager.isConnected();
        gpsHelper.getLocation();
    }


    render() {
        return (
            <div className="App">
                <Navigator />
                <ConnectionNotification />
            </div>
        );
    }


}