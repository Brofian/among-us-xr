import socketManager from "../util/SocketManager";
import {MeetingRoom, Task} from "@amongusxr/types/src/Game/PointsOfInterest";
import {Coordinate} from "@amongusxr/types/src/Game/DataTypes";
import eventManager from "../util/EventManager";
import {GameConfiguration} from "@amongusxr/types/src/Game/Configuration";
import gpsHelper from "../util/GpsHelper";

class ConfigurationManager {

    private meetingRoom: MeetingRoom|undefined = undefined;
    private taskSpots: Task[] = [];

    private constructor() {
        eventManager.on('C_ROOM_UPDATED', (event) => {
            if (!event.roomCode) {
                this.reset();
            }
        })
        /*
        const myPos = gpsHelper.getLocation();
        this.setMeetingRoom('Cafeteria', myPos);
        const numTasks = 5;

        let i = 0;
        for (let r = 0; r < 2*Math.PI; r += (Math.PI / numTasks) ) {
            this.addTask(
                `Task nr ${i}`,
                {
                    latitude: myPos.latitude + Math.sin(r) * 0.00001,
                    longitude: myPos.longitude + Math.cos(r) * 0.00001,
                },
                Math.floor(Math.random() * 10)
            );
            i++;
        }
        */
    }
    private static instance: ConfigurationManager;
    static getInstance(): ConfigurationManager {
        if (!this.instance) {
            this.instance = new ConfigurationManager();
        }
        return this.instance;
    }

    reset(): void {
        this.meetingRoom = undefined;
        this.taskSpots = [];
    }

    setMeetingRoom(name: string, position: Coordinate): void {
        if (name.length < 3) {
            eventManager.emit('C_CONFIGURATION_ERROR', {errorCode: 'invalidMeetingRoomName'});
            return;
        }

        this.meetingRoom = {
            name: name,
            position: position
        };
        eventManager.emit('C_CONFIGURATION_CHANGED', {});
    }

    getMeetingRoom(): MeetingRoom|undefined {
        return this.meetingRoom;
    }


    addTask(name: string, position: Coordinate, duration: number): void {
        if (name.length < 3 || this.taskSpots.find(task => task.name === name) !== undefined) {
            eventManager.emit('C_CONFIGURATION_ERROR', {errorCode: 'invalidTaskName'});
            return;
        }

        this.taskSpots.push({
            name: name,
            position: position,
            duration: duration
        });
        eventManager.emit('C_CONFIGURATION_CHANGED', {});
    }

    setTasks(tasks: Task[]): void {
        this.taskSpots = tasks;
        eventManager.emit('C_CONFIGURATION_CHANGED', {});
    }

    removeTask(name: string): void {
        this.taskSpots = this.taskSpots.filter(task => task.name !== name);
        eventManager.emit('C_CONFIGURATION_CHANGED', {});
    }

    getTasks(): Task[] {
        return this.taskSpots;
    }

    isValidConfiguration(): boolean {
        if (!this.meetingRoom) {
            eventManager.emit('C_CONFIGURATION_ERROR', {errorCode: 'missingMeetingRoom'});
            return false;
        }

        if (this.taskSpots.length < 5) {
            eventManager.emit('C_CONFIGURATION_ERROR', {errorCode: 'notEnoughTasks'});
            return false;
        }

        return true;
    }

    getConfiguration(): GameConfiguration {
        if (!this.isValidConfiguration()) {
            throw Error('Cannot generate invalid configuration');
        }

        return {
            meetingRoom: this.meetingRoom as MeetingRoom,
            taskSpots: this.taskSpots
        };
    }

    submitConfiguration(): void {
        if (!this.isValidConfiguration()) {
            return;
        }

        socketManager.sendEvent('C2S_SUBMIT_CONFIGURATION', {
           configuration: this.getConfiguration()
        });
    }
}

const configurationManager = ConfigurationManager.getInstance();
export default configurationManager;