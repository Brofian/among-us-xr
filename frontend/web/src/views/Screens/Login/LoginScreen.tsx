import {Component} from "react";
import socketManager from "../../../util/SocketManager";

interface IState {
    username: string;
    roomCode: string;
}

export default class LoginScreen extends Component<{}, IState> {

    state: IState = {
        roomCode: '',
        username: '',
    }

    onUserJoinRoom(): void {
        if (this.state.roomCode.length !== 8 || this.state.username.length < 3) {
            return;
        }

        socketManager.sendEvent('C2S_JOIN_ROOM', {
            roomCode: this.state.roomCode,
            username: this.state.username
        });
    }

    onUserCreateRoom(): void {
        socketManager.sendEvent('C2S_CREATE_ROOM', {
            username: this.state.username
        });
    }

    render () {
        return (
            <div id={'loginScreen'}>

                <div className={'card'}>
                    <div className={'card-title'}>
                        Einem Raum beitreten
                    </div>

                    <input
                        type={'text'}
                        onChange={(event) => this.setState({username: event.target.value})}
                        value={this.state.username}
                        placeholder={'Benutzername'}
                    />

                    <input
                        type={'text'}
                        onChange={(event) => this.setState({roomCode: event.target.value})}
                        value={this.state.roomCode}
                        placeholder={'Raum-Code'}
                    />

                    <button onClick={this.onUserJoinRoom.bind(this)}>Beitreten</button>
                </div>

                <div className={'or-divider'}>oder</div>

                <div className={'card'}>
                    <div className={'card-title'}>
                        Einen Raum erstellen
                    </div>

                    <input
                        type={'text'}
                        onChange={(event) => this.setState({username: event.target.value})}
                        value={this.state.username}
                        placeholder={'Benutzername'}
                    />

                    <button onClick={this.onUserCreateRoom.bind(this)}>Erstellen</button>
                </div>

            </div>
        );
    }
}