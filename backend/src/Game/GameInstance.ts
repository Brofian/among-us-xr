import {GameConfiguration} from "@amongusxr/types/src/Game/Configuration";
import PlayerManager from "./PlayerManager";
import {GamePhases} from "@amongusxr/types/src/Game/DataTypes";
import User from "../user/User";

export default class GameInstance {

    private readonly playerManager: PlayerManager;
    private phase: GamePhases = 'setup';
    private configuration: GameConfiguration;

    constructor(roomCode: string) {
        this.playerManager = new PlayerManager(this, roomCode);
    }

    getPhase(): GamePhases {
        return this.phase;
    }

    getPlayerManager(): PlayerManager {
        return this.playerManager;
    }

    startGame(configuration: GameConfiguration): void {
        // TODO check if configuration object is valid
        this.configuration = configuration;

        this.phase = 'startup';
        // TODO make this configurable
        this.playerManager.selectImposters(1);
        this.playerManager.sendGameUpdate();
        this.playerManager.sendPlayerGameUpdates(true);

        setTimeout(() => {
            this.phase = 'roaming';
            this.playerManager.sendGameUpdate();
        }, 1000 * 10);
    }


}