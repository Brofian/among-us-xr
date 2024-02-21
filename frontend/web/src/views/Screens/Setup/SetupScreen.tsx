import LoadTemplate, {SavedTemplates, TEMPLATE_KEY} from "./LoadTemplate";
import ReRenderingComponent from "../../abstract/ReRenderingComponent";
import {CLIENT_EVENT_LIST} from "@amongusxr/types/src/Events/ClientEvents";
import configurationManager from "../../../game/ConfigurationManager";
import localStorageAdapter from "../../../util/LocalStorageAdapter";
import gpsHelper from "../../../util/GpsHelper";
import GameManager from "../../../game/GameManager";

export default class SetupScreen extends ReRenderingComponent<{}, {}> {

    getAutoUpdateEvents(): (keyof CLIENT_EVENT_LIST)[] {
        return ['C_CONFIGURATION_CHANGED'];
    }

    onMeetingPointUpdate(): void {
        const name = prompt('Wie soll der Meeting-Raum heißen?', configurationManager.getMeetingRoom()?.name || 'Cafeteria');
        if (name) {
            configurationManager.setMeetingRoom(
                name,
                gpsHelper.getLocation()
            );
        }
    }

    onCreateTask(): void {
        let name: string|null = null;
        do {
            if (name !== null) {
                alert('Ungültiger Taks Name!'); // TODO replace with unobtrusive flash
            }
            name = prompt('Wie soll der Task heißen?', 'Task_'+(configurationManager.getTasks().length+1));
            if (name === null) {
                return;
            }
        }
        while (name.length < 3 || configurationManager.getTasks().find(task => task.name === name));

        const durationString = prompt('Gib eine Dauer für den Task an', "10") || '10';
        let duration = 0;
        try {
            duration = parseInt(durationString);
        }
        catch (error) {}

        configurationManager.addTask(
            name,
            gpsHelper.getLocation(),
            duration,
        );
    }

    onSaveAsTemplate(): void {
        const existingTemplates = localStorageAdapter.getItem<SavedTemplates>(TEMPLATE_KEY) || [];
        const templateName = prompt('Gib einen Namen für das Template an', 'Template_' + (existingTemplates.length || 0));
        if (!templateName) {
            return;
        }

        // if there is already a configuration with this name, remove it first
        const duplicateTemplateIndex = existingTemplates.find(t => t.label === templateName);
        if (duplicateTemplateIndex) {
            duplicateTemplateIndex.configuration = configurationManager.getConfiguration();
        }
        else {
            existingTemplates.push({
                label: templateName,
                configuration: configurationManager.getConfiguration()
            });
        }

        localStorageAdapter.setItem(TEMPLATE_KEY, existingTemplates);
    }

    render () {
        const meetingSpot = configurationManager.getMeetingRoom();

        return (
            <div id={'setupScreen'} className={'screen'}>

                <LoadTemplate/>

                <h3>Treffpunkt</h3>
                <div className={'list-item'} onClick={this.onMeetingPointUpdate.bind(this)}>
                    {meetingSpot ?
                        <>
                            {meetingSpot.name} <br/>
                            {meetingSpot.position.latitude} / {meetingSpot.position.longitude}
                        </>
                        : 'Nicht gesetzt!'
                    }
                </div>

                <h3>Tasks</h3>
                {configurationManager.getTasks().map((task, index) =>
                    <div key={index} className={'list-item'}>
                        {task.name} &nbsp; ({task.duration}s)<br/>
                        {task.position.latitude} / {task.position.longitude}
                    </div>
                )}

                <div
                    className={'list-item'}
                    onClick={this.onCreateTask.bind(this)}
                >
                    Task hinzufügen
                </div>

                <h3>Spieler</h3>

                {GameManager.getPlayerList().map(player =>
                    <div className={'list-item'}>
                        {player.username}
                    </div>
                )}


                <div>
                    <button
                        disabled={!configurationManager.isValidConfiguration()}
                        onClick={this.onSaveAsTemplate.bind(this)}
                    >
                        Speichere als Template
                    </button>

                    <button
                        disabled={!configurationManager.isValidConfiguration()}
                        onClick={() => configurationManager.submitConfiguration()}
                    >
                        Einstellungen bestätigen
                    </button>

                </div>

            </div>
        );
    }
}