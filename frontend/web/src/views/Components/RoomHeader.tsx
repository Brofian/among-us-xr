import GameManager from "../../game/GameManager";
import ReRenderingComponent from "../abstract/ReRenderingComponent";
import {CLIENT_EVENT_LIST} from "@amongusxr/types/src/Events/ClientEvents";

export default class RoomHeader extends ReRenderingComponent<{}, {}> {

    getAutoUpdateEvents(): (keyof CLIENT_EVENT_LIST)[] {
        return ['C_ROOM_UPDATED'];
    }

    render() {
        return (
            <div className={'room-header'}>
                <span>{GameManager.getRoomCode()}</span>
                <span>
                    {GameManager.getPlayerList().length} P
                </span>
            </div>
        );
    }

}