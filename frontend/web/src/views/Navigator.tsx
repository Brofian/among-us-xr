import React, {Component, ReactNode} from "react";
import QueueScreen from "./Screens/Queue/QueueScreen";
import eventManager from "../util/EventManager";
import userManager from "../game/UserManager";
import LoginScreen from "./Screens/Login/LoginScreen";

export default class Navigator extends Component<{}, {}> {

    private readonly userUpdateListener = () => this.setState({});

    componentDidMount() {
        eventManager.on('S2C_USER_UPDATED', this.userUpdateListener);
    }

    componentWillUnmount() {
        eventManager.removeListener('S2C_USER_UPDATED', this.userUpdateListener);
    }

    render () {
        return (
            <>
                {this.renderView()}
            </>
        );
    }

    renderView(): ReactNode {
        if (!userManager.getRoomCode()) {
            return <LoginScreen />;
        }

        const userRole = userManager.getRole();
        if (!userRole) return undefined;

        switch (userRole) {
            case "queued":
                return <QueueScreen />;
            default:
                return <div>Undefined view: {userRole}</div>;
        }
    }

}