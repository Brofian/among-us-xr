import {registerRootComponent} from 'expo';
import {StatusBar} from 'expo-status-bar';
import {Text, View, ViewStyle} from 'react-native';
import {Component} from "react";
import EventHelper from "./util/EventHelper";
import {SocketStateChangedEvent} from "./util/Events/LocalEvents";
import SocketManager from "./util/SocketManager";

export default class App extends Component<{}, never> {

    private eventHelper: EventHelper = new EventHelper();

    componentDidMount() {
        this.eventHelper.init([
            {event: 'socket_state_changed', handler: this.onSocketStateChanged.bind(this)}
        ]);
        this.socketState = SocketManager.isConnected() ? 'i-on' : 'i-off';
    }

    componentWillUnmount() {
        this.eventHelper.destroy();
    }

    private socketState: string = '-';
    onSocketStateChanged(event: SocketStateChangedEvent): void {
        this.socketState = event.state;
        console.log('socket state listener: ', event.state);
        this.setState({});
    }

    render() {
        return (
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            } as Partial<ViewStyle>}>
                <Text>Socket State: {this.socketState}</Text>
                <StatusBar style="auto" />
            </View>
        );
    }
}

registerRootComponent(App);