import React, {Component} from 'react';
import socketManager from "./util/SocketManager";

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