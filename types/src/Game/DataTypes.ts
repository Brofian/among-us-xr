export type GamePhases =
    'setup'
    | 'startup'
    | 'roaming'
    | 'meeting';

export type Coordinate = {
    latitude: number,
    longitude: number,
}