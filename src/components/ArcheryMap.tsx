import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';

// We need all of this leaflet stuff to make the icons actually work
// Thank you to this goat: https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = '';

const ArcheryMap = () => {
  const position = [42.385, -71.018] as LatLngTuple;

  const communities = [
    {
      name: 'Archery Games Boston',
      lat: 42.385,
      lng: -71.018,
      content: 'Chelsea, MA',
    },
    {
      name: 'Archery Games Ottawa',
      lat: 45.421,
      lng: -75.698,
      content: 'Ottawa, ON',
    },
    {
      name: 'Archery Games Denver',
      lat: 39.805,
      lng: -105.087,
      content: 'Denver, CO',
    },
    {
      name: "Combat d'Archers",
      lat: 45.501,
      lng: -73.567,
      content: 'Montréal, QC',
    },
    {
      name: "Combat d'Archers Sherbrooke",
      lat: 45.405,
      lng: -71.88,
      content: 'Sherbrooke, QC',
    },
    { name: 'Archers Arena', lat: 43.7, lng: -79.412, content: 'Toronto, ON' },
  ];

  return (
    <MapContainer
      center={position}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {communities.map((community) => (
        <Marker key={community.name} position={[community.lat, community.lng]}>
          <Popup>
            <b>{community.name}</b>
            <br />
            {community.content}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ArcheryMap;
