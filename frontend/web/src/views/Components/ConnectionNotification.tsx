import {Component} from "react";
import socketManager from "../../util/SocketManager";
import eventManager from "../../util/EventManager";

export default class ConnectionNotification extends Component<{}, {}> {

    private readonly connectionStatusChangedListener = () => this.setState({});

    componentDidMount() {
        eventManager.on('C_CONNECTION_STATUS', this.connectionStatusChangedListener);
    }

    componentWillUnmount() {
        eventManager.removeListener('C_CONNECTION_STATUS', this.connectionStatusChangedListener);
    }

    render() {
        return (
            <div id={"connection-notification"} className={socketManager.isConnected() ? "hidden" : ""}>
                Cannot connect to server! Retrying...
            </div>
        );
    }

}