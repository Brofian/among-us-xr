import GameInstance from "../Game/GameInstance";
import Room from "./Room";
import {C2S_EVENT_LIST, C2SSelectRoleEvent, C2SSubmitConfigurationEvent} from "@amongusxr/types/src/Events/C2SPackages";
import eventManager from "../util/EventManager";
import {EVENT_LIST, EventHandler} from "@amongusxr/types/src/EventSystem";
import userManager from "../user/UserManager";
import User from "../user/User";
import {serverLogger} from "../util/Logger";

type PreHandledEventHandler<E extends keyof EVENT_LIST> = {(gameInstance: GameInstance, user: User, event: EVENT_LIST[E]): void};

export default class GameEventTunnel {

    private readonly rooms: Room[];

    constructor(rooms: Room[]) {
        this.rooms = rooms;
        this.registerEvents();
    }

    private registerEvents(): void {
        eventManager.on('C2S_SELECT_ROLE', this.eventMiddleware.bind(this, this.onSelectRoleEvent.bind(this)));
        eventManager.on('C2S_SUBMIT_CONFIGURATION', this.eventMiddleware.bind(this, this.onSubmitConfiguration.bind(this)));
    }

    private eventMiddleware<E extends keyof C2S_EVENT_LIST>(handler: PreHandledEventHandler<E>, event: EVENT_LIST[E]): void {
        const {userId} = event;
        if (!userId) return;
        const user = userManager.getUserById(userId);
        if (!user)  return;

        // find room
        for (const room of this.rooms) {
            if (room.hasUserWithId(userId)) {
                // bind the room as the first argument. Requires "this" to be bound already
                handler(room.getGameInstance(), user,event);
                return;
            }
        }
        serverLogger.warning(`EventMiddleware: room with user ${userId} not found`)
    }

    private onSelectRoleEvent(gameInstance: GameInstance, user: User, event: C2SSelectRoleEvent): void {
        gameInstance.getPlayerManager().onPlayerSelectRole(user, event);
    }

    private onSubmitConfiguration(gameInstance: GameInstance, user: User, event: C2SSubmitConfigurationEvent): void {
        if (user !== user.getRoom().getAdministrator()) {
            return;
        }
        gameInstance.startGame(event.configuration);
    }

}