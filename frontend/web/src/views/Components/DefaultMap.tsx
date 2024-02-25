import {Component, createRef} from 'react';
import {MapContainer, Marker, TileLayer, Tooltip} from 'react-leaflet'
import {DivIcon, Map} from 'leaflet';
import {renderToStaticMarkup} from "react-dom/server";
import {Coordinate} from "@amongusxr/types/src/Game/DataTypes";

const renderImgToIcon = (img: string) => <img
        style={{
            width: '2rem',
            height: '2rem',
            transform: 'translate(-40%,-25%)',
        }}
        src={img}
        alt={'icon'}
    />;

type IconData = {img: string, offset: [number,number]}

type IconMap = {
    task: IconData;
    crewmate_cyan: IconData;
    crewmate_red: IconData;
    crewmate_green: IconData;
    crewmate_yellow: IconData;
    crewmate_pink: IconData;
}
const iconMap: IconMap = {
    task:               {img: renderToStaticMarkup(renderImgToIcon(require('../../assets/icons/task.png'))), offset: [0,0]},
    crewmate_cyan:      {img: renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate/cyan.png'))), offset: [0,0]},
    crewmate_red:       {img: renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate/red.png'))), offset: [0,0]},
    crewmate_green:     {img: renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate/green.png'))), offset: [0,0]},
    crewmate_yellow:    {img: renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate/yellow.png'))), offset: [0,0]},
    crewmate_pink:      {img: renderToStaticMarkup(renderImgToIcon(require('../../assets/crewmate/pink.png'))), offset: [0,0]},
}


export type MarkerDef = {
    key: string|number;
    position: [number,number];
    label?: string;
    icon?: (keyof IconMap);
};

interface IProps {
    center: [number,number];
    markers: MarkerDef[];
    zoom: number|[number,number],
    movable: boolean,
    onClick?: {(coords: Coordinate): void};
}

export default class DefaultMap extends Component<IProps, {}> {

    leafletMapRef = createRef<Map>();

    shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (this.leafletMapRef.current) {
            this.leafletMapRef.current.panTo(nextProps.center);
        }
        return true;
    }

    onAfterRender(): void {
        const clickHandler = this.props.onClick;
        if (this.leafletMapRef.current && clickHandler) {
            this.leafletMapRef.current.off('click');
            this.leafletMapRef.current.on('click', event => clickHandler({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng
            }));
        }
    }


    render () {
        setTimeout(this.onAfterRender.bind(this),1);

        const minZoom = Array.isArray(this.props.zoom) ? this.props.zoom[0] : this.props.zoom;
        const maxZoom = Array.isArray(this.props.zoom) ? this.props.zoom[1] : this.props.zoom;

        return (
            <MapContainer
                center={this.props.center}
                zoom={maxZoom}
                maxZoom={maxZoom}
                minZoom={minZoom}
                dragging={this.props.movable}
                keyboard={this.props.movable}
                tap={this.props.movable}
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
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    maxNativeZoom={Math.min(maxZoom, 18)}
                />

                {this.props.markers.map((marker, index) =>
                    marker.icon ?
                        <Marker
                            key={index}
                            position={marker.position}
                            icon={new DivIcon({
                                html: iconMap[marker.icon].img,
                            })}
                        >
                            {marker.label &&
                                <Tooltip
                                    interactive={true}
                                    direction={'top'}
                                    opacity={0.8}
                                    offset={iconMap[marker.icon].offset}
                                    content={marker.label}
                                />
                            }
                        </Marker>
                        :
                        <Marker
                            key={index}
                            position={marker.position}
                        >
                            {marker.label &&
                                <Tooltip
                                    interactive={true}
                                    direction={'top'}
                                    offset={[-15,0]}
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