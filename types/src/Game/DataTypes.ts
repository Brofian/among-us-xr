import {Task} from "./PointsOfInterest";

export type GamePhases =
    'setup'
    | 'startup'
    | 'roaming'
    | 'meeting';

export type Coordinate = {
    latitude: number,
    longitude: number,
}

export type PlayerTask = {
    isReachable: boolean;
} & Task;