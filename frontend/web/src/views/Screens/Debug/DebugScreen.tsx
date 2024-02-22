import {Component} from "react";
import gpsHelper from "../../../util/GpsHelper";
import eventManager from "../../../util/EventManager";
import DefaultMap from "../../Components/DefaultMap";
import {renderToStaticMarkup} from "react-dom/server";


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
            <div id={'debugScreen'} style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>

                Latitude: {gpsHelper.getLocation().latitude}
                <br/>
                Longitude: {gpsHelper.getLocation().longitude}
                <br/>
                Heading: {gpsHelper.getHeading()}
                <br/>
                Changed: {(new Date()).getTime()}

                <DefaultMap
                    center={[
                        gpsHelper.getLocation().latitude,
                        gpsHelper.getLocation().longitude,
                    ]}
                    markers={[
                        {   position: [
                                gpsHelper.getLocation().latitude,
                                gpsHelper.getLocation().longitude,
                            ],
                            label: 'Fabian',
                            icon: "crewmate_cyan"
                        },
                        {   position: [
                                gpsHelper.getLocation().latitude,
                                gpsHelper.getLocation().longitude + 0.0003,
                            ],
                            icon: "crewmate_red"
                        },
                        {   position: [
                                gpsHelper.getLocation().latitude,
                                gpsHelper.getLocation().longitude - 0.0003,
                            ],
                            icon: "crewmate_green"
                        },
                        {   position: [
                                gpsHelper.getLocation().latitude - 0.00015,
                                gpsHelper.getLocation().longitude - 0.00015,
                            ],
                            icon: "crewmate_yellow"
                        },
                        {   position: [
                                gpsHelper.getLocation().latitude - 0.00015,
                                gpsHelper.getLocation().longitude + 0.00015,
                            ],
                            icon: "crewmate_pink"
                        }
                    ]}
                />

            </div>
        );
    }
}