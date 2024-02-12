import React, {Component} from 'react';
import socketManager from "./util/SocketManager";
import {C2SPackage, C2SPingEvent} from "@amongusxr/types/src/Events/C2SPackages";
import eventManager from "./util/EventManager";
import {S2CPingEvent} from "@amongusxr/types/src/Events/S2CPackages";

export default class App extends Component<{}, {}>{

    constructor(props: {}) {
        super(props);
        socketManager.isConnected();
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