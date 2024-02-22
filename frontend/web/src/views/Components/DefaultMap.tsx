import {Component, createRef, ReactNode} from 'react';
import {MapContainer, Marker, Popup, TileLayer, Tooltip} from 'react-leaflet'
import {DivIcon, Icon, Map, Point} from 'leaflet';
import {renderToStaticMarkup} from "react-dom/server";

const renderImgToIcon = (img: string) => <img
        style={{
            width: '2rem',
            height: '2rem',
            transform: 'translate(-40%,-25%)',
        }}
        src={img}
        alt={'icon'}
    />;

type IconMap = {
    crewmate_cyan: string;
    crewmate_red: string;
    crewmate_green: string;
    crewmate_yellow: string;
    crewmate_pink: string;
}
const iconMap: IconMap = {
    crewmate_cyan:      renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate_cyan.png'))),
    crewmate_red:       renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate.png'))),
    crewmate_green:     renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate_green.png'))),
    crewmate_yellow:    renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate_yellow.png'))),
    crewmate_pink:      renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate_pink.png'))),
}


type MarkerDef = {
    position: [number,number];
    icon?: (keyof IconMap);
    label?: string;
};

interface IProps {
    center: [number,number];
    markers: MarkerDef[];
}

export default class DefaultMap extends Component<IProps, {}> {

    leafletMapRef = createRef<Map>();

    shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (this.leafletMapRef.current) {
            this.leafletMapRef.current.panTo(nextProps.center);
        }
        return true;
    }



    render () {
        return (
            <MapContainer
                center={this.props.center}
                zoom={18}
                maxZoom={18}
                minZoom={15}
                dragging={false} // todo allow dragging for spectators
                keyboard={false}
                scrollWheelZoom={false}
                style={{
                    height: '50vh',
                    width: '100%',
                    maxWidth: '50rem',
                }}
                ref={this.leafletMapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {this.props.markers.map((marker, index) =>
                    <Marker
                        key={index}
                        position={marker.position}
                        icon={marker.icon ? new DivIcon({
                            html: iconMap[marker.icon],
                        }) : undefined}
                    >
                        {marker.label &&
                            <Tooltip
                                permanent={true}
                                direction={'top'}
                                opacity={0.8}
                                content={marker.label}
                            />
                        }
                    </Marker>
                )}

            </MapContainer>
        );
    }
}