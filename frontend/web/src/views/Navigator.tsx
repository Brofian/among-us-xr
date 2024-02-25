import React, {ReactNode} from "react";
import QueueScreen from "./Screens/Queue/QueueScreen";
import gameManager from "../game/GameManager";
import LoginScreen from "./Screens/Login/LoginScreen";
import SetupScreen from "./Screens/Setup/SetupScreen";
import ReRenderingComponent from "./abstract/ReRenderingComponent";
import {CLIENT_EVENT_LIST} from "@amongusxr/types/src/Events/ClientEvents";
import RoomHeader from "./Components/RoomHeader";
import DebugScreen from "./Screens/Debug/DebugScreen";

export default class Navigator extends ReRenderingComponent<{}, {}> {

    getAutoUpdateEvents(): (keyof CLIENT_EVENT_LIST)[] {
        return ['C_USER_UPDATED', 'C_ROOM_UPDATED'];
    }

    render () {
        // return <DebugScreen />;

        if (!gameManager.getRoomCode()) {
            return <LoginScreen />;
        }

        return (
            <>
                <RoomHeader />
                {this.renderView()}
            </>
        );
    }

    renderView(): ReactNode {
        if (gameManager.getUserId() && gameManager.getUserId() === gameManager.getAdministratorId()) {
            return <SetupScreen />;
        }

        const userRole = gameManager.getRole();
        if (!userRole) return undefined;

        switch (userRole) {
            case "queued":
                return <QueueScreen />;
            default:
                return <div>Undefined view: {userRole}</div>;
        }
    }

}