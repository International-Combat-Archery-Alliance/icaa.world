import { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import type { ViewStateChangeEvent, MapRef } from 'react-map-gl/maplibre';
import maplibregl, { LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Community {
  name: string;
  lat: number;
  lng: number;
  content: string;
  url?: string;
}

const communities: Community[] = [
  {
    name: 'Archery Games Boston',
    lat: 42.4016,
    lng: -71.0243,
    content: 'Chelsea, MA',
    url: 'https://www.archerygamesboston.com/',
  },
  {
    name: 'Archery Games Ottawa',
    lat: 45.369,
    lng: -75.6637,
    content: 'Ottawa, ON',
    url: 'https://www.archerygames.ca/',
  },
  {
    name: 'Archery Games Denver',
    lat: 39.8005,
    lng: -105.0556,
    content: 'Denver, CO',
    url: 'https://archerygamesdenver.com/',
  },
  {
    name: 'Archery Games Omaha',
    lat: 41.2565,
    lng: -95.9345,
    content: 'Omaha, NE',
    url: 'https://www.archerygamesomaha.com/',
  },
  {
    name: "Combat d'Archers",
    lat: 45.5505,
    lng: -73.5458,
    content: 'Montréal, QC',
    url: 'https://combatdarchers.ca/en/combat-archery/',
  },
  {
    name: "Combat d'Archers Sherbrooke",
    lat: 45.4087,
    lng: -71.8533,
    content: 'Sherbrooke, QC',
    url: 'https://combatdarcherssherbrooke.ca/en/booking-combat-archery/',
  },
  {
    name: 'Archers Arena',
    lat: 43.754,
    lng: -79.4669,
    content: 'Toronto, ON',
    url: 'https://archersarena.com/',
  },
  {
    name: 'Archery Arena',
    lat: 39.1031,
    lng: -84.512,
    content: 'Cincinnati, OH',
    url: 'https://www.archery-arena.com/',
  },
  {
    name: 'Sherwood Showdown',
    lat: 38.8339,
    lng: -104.8214,
    content: 'Colorado Springs, CO',
    url: 'https://www.sherwoodshowdown.com/',
  },
  {
    name: 'Archers Battlefield',
    lat: 43.8384,
    lng: -79.0868,
    content: 'Pickering, ON',
    url: 'https://www.archersbattlefield.com/',
  },
  {
    name: 'Archery Battles',
    lat: 30.178,
    lng: -97.8206,
    content: 'Austin, TX',
    url: 'https://archery-battles.com/',
  },
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

const LABEL_ZOOM_THRESHOLD = 6;

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestCommunity(lat: number, lng: number): Community {
  let nearest = communities[0];
  let minDist = Infinity;
  for (const c of communities) {
    const dist = haversineDistance(lat, lng, c.lat, c.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = c;
    }
  }
  return nearest;
}

function ArcheryMap() {
  const [popupInfo, setPopupInfo] = useState<Community | null>(null);
  const [zoom, setZoom] = useState(4);
  const mapRef = useRef<MapRef>(null);

  const showLabels = zoom >= LABEL_ZOOM_THRESHOLD;

  const handleZoom = useCallback((e: ViewStateChangeEvent) => {
    setZoom(e.viewState.zoom);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const timeoutId = setTimeout(() => {
      // fall through to default view
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        const nearest = findNearestCommunity(latitude, longitude);
        const bounds = new LngLatBounds();
        bounds.extend([longitude, latitude]);
        bounds.extend([nearest.lng, nearest.lat]);
        mapRef.current?.fitBounds(bounds, {
          padding: 100,
          maxZoom: 6,
          duration: 0,
        });
      },
      () => {
        clearTimeout(timeoutId);
        // permission denied or error, use default view
      },
      { timeout: 5000, enableHighAccuracy: false },
    );

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      initialViewState={{
        longitude: -71.018,
        latitude: 42.385,
        zoom: 4,
      }}
      style={{ height: '400px', width: '100%' }}
      mapStyle={MAP_STYLE}
      scrollZoom={false}
      onZoom={handleZoom}
    >
      <NavigationControl position="top-left" />
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
          <div className="relative cursor-pointer">
            <div className="h-5 w-5 rounded-full border-[3px] border-white bg-primary shadow-md" />
            {showLabels && (
              <span className="absolute left-full top-1/2 ml-1.5 -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold text-gray-900 shadow-sm bg-white/80">
                {community.name}
              </span>
            )}
          </div>
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
            {popupInfo.url ? (
              <a
                href={popupInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                {popupInfo.name}
              </a>
            ) : (
              <strong>{popupInfo.name}</strong>
            )}
            <br />
            {popupInfo.content}
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default ArcheryMap;
