import LoadTemplate, {SavedTemplates, TEMPLATE_KEY} from "./LoadTemplate";
import ReRenderingComponent from "../../abstract/ReRenderingComponent";
import {CLIENT_EVENT_LIST} from "@amongusxr/types/src/Events/ClientEvents";
import configurationManager from "../../../game/ConfigurationManager";
import localStorageAdapter from "../../../util/LocalStorageAdapter";
import gpsHelper from "../../../util/GpsHelper";
import GameManager from "../../../game/GameManager";
import DefaultMap, {MarkerDef} from "../../Components/DefaultMap";
import GpsHelper from "../../../util/GpsHelper";
import {Coordinate} from "@amongusxr/types/src/Game/DataTypes";

export default class SetupScreen extends ReRenderingComponent<{}, {}> {

    getAutoUpdateEvents(): (keyof CLIENT_EVENT_LIST)[] {
        return ['C_CONFIGURATION_CHANGED','C_GPS_LOCATION_CHANGED'];
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

    onCreateTask(coords?: Coordinate): void {
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
            coords || gpsHelper.getLocation(),
            duration,
        );
        this.setState({});
    }

    render () {
        const meetingSpot = configurationManager.getMeetingRoom();

        const currentMarkers: MarkerDef[] = configurationManager.getTasks().map(task => {
            return {
                key: task.name,
                label: `${task.name} (${task.duration}s)`,
                position: [task.position.latitude, task.position.longitude],
                icon: 'task'
            };
        });
        if (meetingSpot) {
            currentMarkers.push({
                key: '__meeting__',
                label: meetingSpot.name,
                position: [meetingSpot.position.latitude, meetingSpot.position.longitude]
            });
        }

        return (
            <div id={'setupScreen'} className={'screen'}>

                <LoadTemplate/>

                <DefaultMap
                    center={GpsHelper.getLocationTuple()}
                    zoom={[13,20]}
                    movable={true}
                    markers={currentMarkers}
                    onClick={this.onCreateTask.bind(this)}
                />

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
                    onClick={this.onCreateTask.bind(this, undefined)}
                >
                    Task hinzufügen
                </div>

                <h3>Spieler</h3>

                {GameManager.getPlayerList().map((player, index) =>
                    <div key={index} className={'list-item'}>
                        {player.username}
                    </div>
                )}


                <div>
                    <button
                        disabled={!configurationManager.isValidConfiguration()}
                        onClick={LoadTemplate.onSaveAsTemplate.bind(this)}
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