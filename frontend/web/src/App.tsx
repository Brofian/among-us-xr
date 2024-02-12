import React, {Component} from 'react';
import socketManager from "./util/SocketManager";
import {C2SPackage, C2SPingEvent} from "@amongusxr/types/src/Events/C2SPackages";
import eventManager from "./util/EventManager";
import {S2CPingEvent, S2CUserUpdatedEvent} from "@amongusxr/types/src/Events/S2CPackages";

export default class App extends Component<{}, {}>{

    constructor(props: {}) {
        super(props);
        socketManager.isConnected();
    }

    userUpdateListener = (event: S2CUserUpdatedEvent) => {
        console.log('neue userId: ' + event.userId);
    };

    componentDidMount() {
        eventManager.on('S2C_USER_UPDATED', this.userUpdateListener);
    }

    componentWillUnmount() {
        eventManager.removeListener('S2C_USER_UPDATED', this.userUpdateListener);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload
                    </p>
                </header>
            </div>
        );
    }
}