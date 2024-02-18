import {Coordinate} from "@amongusxr/types/src/Game/DataTypes";
import eventManager from "./EventManager";

class GpsHelper {

    private heading: number = 0;
    private location: Coordinate = {
        latitude: 0,
        longitude: 0
    };

    private constructor() {
        this.registerLocation();
        this.registerOrientation();
    }

    private static instance: GpsHelper;

    private watchId: number = 0;

    static getInstance(): GpsHelper {
        if (!this.instance) {
            this.instance = new GpsHelper();
        }
        return this.instance;
    }

    registerLocation(): void {
        navigator.geolocation.clearWatch(this.watchId);
        navigator.geolocation.watchPosition(
            this.onLocationChanged.bind(this),
            (err) => {
                setTimeout(this.registerLocation.bind(this), 1000);
                eventManager.emit('C_GPS_LOCATION_CHANGED', {
                    location: this.location
                });
            },
            {
                enableHighAccuracy: true
            }
        );
    }


    private registerOrientation(): void {

        // device orientation
        const isIOS = (
            navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
            navigator.userAgent.match(/AppleWebKit/)
        );
        if (isIOS && window.DeviceOrientationEvent) {
            (window.DeviceOrientationEvent as any).requestPermission()
                .then((response: any) => {
                    if (response === "granted") {
                        window.addEventListener("deviceorientation", this.onHeadingChanged.bind(this), true);
                    } else {
                        alert("device orientation access was not granted! Continuing without");
                    }
                })
                .catch(console.error);
        } else {
            window.addEventListener("deviceorientation", this.onHeadingChanged.bind(this));
        }
    }


    private onHeadingChanged(event: DeviceOrientationEvent): void {
        this.heading = event.alpha || 0;
        eventManager.emit('C_GPS_HEADING_CHANGED', {
            heading: this.heading
        });
    }

    private onLocationChanged(position: GeolocationPosition): void {
        this.location.latitude = position.coords.latitude;
        this.location.longitude = position.coords.longitude;

        eventManager.emit('C_GPS_LOCATION_CHANGED', {
            location: this.location
        });
    }

    /**
     * Returns the current heading direction in degrees, with north being zero degrees
     */
    getHeading(): number {
        return this.heading;
    }

    getLocation(): Coordinate {
        return this.location;
    }


}

const gpsHelper = GpsHelper.getInstance();
export default gpsHelper;