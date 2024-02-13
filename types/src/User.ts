export type UserRoles =
    'unset'         // waiting for user to enter a room
    | 'queued'      // waiting for user to select a role in the room
    | 'spectator'   // user is only watching the game
    | 'player'      // user is an active player in the game
    | 'game_object';// user in a passive game object