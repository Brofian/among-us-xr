import {MeetingRoom, Task} from "./PointsOfInterest";

export type GameConfiguration = {
    meetingRoom: MeetingRoom,
    taskSpots: Task[],
}