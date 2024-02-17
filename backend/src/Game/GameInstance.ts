import {GameConfiguration} from "@amongusxr/types/src/Game/Configuration";
import PlayerManager from "./PlayerManager";
import {GamePhases} from "@amongusxr/types/src/Game/DataTypes";

export default class GameInstance {

    private phase: GamePhases = 'setup';
    private configuration: GameConfiguration;
    private playerManager: PlayerManager;

    constructor(roomCode: string) {
        this.playerManager = new PlayerManager(this, roomCode);
    }

    getPhase(): GamePhases {
        return this.phase;
    }

    getPlayerManager(): PlayerManager {
        return this.playerManager;
    }
}