import {Component} from "react";
import {CLIENT_EVENT_LIST} from "@amongusxr/types/src/Events/ClientEvents";
import eventManager from "../../util/EventManager";

export default abstract class ReRenderingComponent<IProps, IState> extends Component<IProps, IState> {

    private updateListener = this.setState.bind(this, {} as Pick<IState, keyof IState>, undefined);

    abstract getAutoUpdateEvents(): (keyof CLIENT_EVENT_LIST)[];

    componentDidMount() {
        for (const event of this.getAutoUpdateEvents()) {
            eventManager.on(event, this.updateListener);
        }
    }

    componentWillUnmount() {
        for (const event of this.getAutoUpdateEvents()) {
            eventManager.removeListener(event, this.updateListener);
        }
    }

}