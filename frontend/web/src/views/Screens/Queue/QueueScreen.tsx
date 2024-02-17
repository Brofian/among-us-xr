import {Component} from "react";
import {UserRoles} from "@amongusxr/types/src/User";
import eventManager from "../../../util/EventManager";
import userManager from "../../../game/UserManager";
import socketManager from "../../../util/SocketManager";

type RoleSelectionOption = {role: UserRoles, label: string, image: string};

export default class QueueScreen extends Component<{}, {}> {


    onRoleSelect(option: RoleSelectionOption): void {
        socketManager.sendEvent('C2S_SELECT_ROLE', {
            selectedRole: option.role
        });
    }


    render () {
        const selectableRoles: RoleSelectionOption[] = [
            {role: 'spectator', label: "Zuschauer", image: "ghost.png"},
            {role: 'player', label: "Spieler", image: "crewmate.png"},
            {role: 'game_object', label: "Spiel-Objekt", image: "computer.jpg"}
        ];

        return (
            <div id={'queueScreen'}>

                <div className={'title'}>Welcome on the Queue Screen. Please select your role</div>

                <div className={'option-wrapper'}>
                    {selectableRoles.map((option, index) =>
                        <div
                            key={index}
                            onClick={this.onRoleSelect.bind(this, option)}
                            className={'option role-' + option.role}
                        >
                            <img src={require("../../../assets/" + option.image)} alt={"Option Background"}></img>

                            <span>{option.label}</span>
                        </div>
                    )}
                </div>

            </div>
        );
    }
}