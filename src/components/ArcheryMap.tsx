import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const ArcheryMap = () => {
    const position = [42.385, -71.018] as LatLngTuple;

    const communities = [
        { name: "Archery Games Boston", lat: 42.385, lng: -71.018, content: "<p>Chelsea, MA</p>" },
        { name: "Archery Games Ottawa", lat: 45.421, lng: -75.698, content: "<p>Ottawa, ON</p>" },
        { name: "Archery Games Denver", lat: 39.805, lng: -105.087, content: "<p>Arvada, CO</p>" },
        { name: "Combat d'Archers", lat: 45.501, lng: -73.567, content: "<p>Montréal, QC</p>" },
        { name: "Combat d'Archers Sherbrooke", lat: 45.405, lng: -71.880, content: "<p>Sherbrooke, QC</p>" },
        { name: "Archers Arena", lat: 43.700, lng: -79.412, content: "<p>Toronto, ON</p>" }
    ];

    return (
        <MapContainer center={position} zoom={4} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {communities.map(community => (
                <Marker key={community.name} position={[community.lat, community.lng]}>
                    <Popup>
                        <b>{community.name}</b><br />{community.content}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ArcheryMap;
