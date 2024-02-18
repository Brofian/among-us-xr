import {Component} from "react";
import gpsHelper from "../../../util/GpsHelper";
import eventManager from "../../../util/EventManager";


export default class DebugScreen extends Component<{}, {}> {


    private listener = this.setState.bind(this, {}, () => {});

    componentDidMount() {
        eventManager.on('C_GPS_LOCATION_CHANGED', this.listener);
        eventManager.on('C_GPS_HEADING_CHANGED', this.listener);
    }

    componentWillUnmount() {
        eventManager.removeListener('C_GPS_LOCATION_CHANGED', this.listener);
        eventManager.removeListener('C_GPS_HEADING_CHANGED', this.listener);
    }

    render () {
        return (
            <div id={'debugScreen'}>

                Latitude: {gpsHelper.getLocation().latitude}
                <br/>
                Longitude: {gpsHelper.getLocation().longitude}
                <br/>
                Heading: {gpsHelper.getHeading()}
                <br/>
                Changed: {(new Date()).getTime()}

            </div>
        );
    }
}