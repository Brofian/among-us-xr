import {Coordinate} from "./DataTypes";

export type MeetingRoom = {
    name: string,
    position: Coordinate
}

export type Task = {
    name: string,
    duration: number,
    position: Coordinate
}