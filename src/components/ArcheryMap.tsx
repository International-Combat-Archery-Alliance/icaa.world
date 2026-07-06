import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Community {
  name: string;
  lat: number;
  lng: number;
  content: string;
}

const communities: Community[] = [
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

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster' as const,
      source: 'osm-tiles',
    },
  ],
};

function ArcheryMap() {
  const [popupInfo, setPopupInfo] = useState<Community | null>(null);

  return (
    <Map
      mapLib={maplibregl}
      initialViewState={{
        longitude: -71.018,
        latitude: 42.385,
        zoom: 4,
      }}
      style={{ height: '400px', width: '100%' }}
      mapStyle={MAP_STYLE}
      scrollZoom={false}
    >
      {communities.map((community) => (
        <Marker
          key={community.name}
          longitude={community.lng}
          latitude={community.lat}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(community);
          }}
        >
          <div className="h-5 w-5 cursor-pointer rounded-full border-[3px] border-white bg-red-600 shadow-md" />
        </Marker>
      ))}
      {popupInfo && (
        <Popup
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          anchor="bottom"
          onClose={() => setPopupInfo(null)}
          closeButton={false}
          offset={20}
        >
          <div className="text-center">
            <strong>{popupInfo.name}</strong>
            <br />
            {popupInfo.content}
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default ArcheryMap;
