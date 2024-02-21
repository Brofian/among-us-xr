import {ChangeEvent, Component} from "react";
import localStorageAdapter from "../../../util/LocalStorageAdapter";
import {GameConfiguration} from "@amongusxr/types/src/Game/Configuration";
import configurationManager from "../../../game/ConfigurationManager";
import eventManager from "../../../util/EventManager";

export type SavedTemplates = {
    label: string;
    configuration: GameConfiguration;
}[];

export const TEMPLATE_KEY = 'savedTemplates';


interface IState {
    selectedTemplate: GameConfiguration|undefined
}

export default class LoadTemplate extends Component<{}, IState>{

    state: IState = {
        selectedTemplate: undefined
    }

    onSelectionChanged(savedTemplates: SavedTemplates, event: ChangeEvent<HTMLSelectElement>): void {
        const label = event.target.value;
        const entry = savedTemplates.find(t => t.label === label);
        this.setState({
            selectedTemplate:  (label === '' || !entry) ? undefined : entry.configuration
        });
    }

    onLoadTemplate(): void {
        const template = this.state.selectedTemplate;
        if (!template) {
            return;
        }

        configurationManager.setMeetingRoom(
            template.meetingRoom.name,
            template.meetingRoom.position
        );
        configurationManager.setTasks(template.taskSpots);
    }

    render() {
        const savedTemplates = localStorageAdapter.getItem<SavedTemplates>(TEMPLATE_KEY) || [];

        if (savedTemplates.length === 0) {
            return <></>;
        }

        return (
            <div className={'template-loader'}>
                Gespeicherte Templates:

                <select onChange={this.onSelectionChanged.bind(this, savedTemplates)}>
                    <option value={''}>
                        Template auswählen
                    </option>

                    {savedTemplates.map((savedTemplate, index) =>
                        <option
                            key={index}
                            value={savedTemplate.label}
                        >
                            {savedTemplate.label}
                        </option>
                    )}
                </select>

                <button onClick={this.onLoadTemplate.bind(this)}>Laden</button>
            </div>
        );
    }

}