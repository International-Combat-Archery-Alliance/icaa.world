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
  {
    name: 'Archers Arena',
    lat: 43.7,
    lng: -79.412,
    content: 'Toronto, ON',
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
          maxZoom: 12,
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
          <div className="flex cursor-pointer items-center gap-1.5">
            <div className="h-5 w-5 shrink-0 rounded-full border-[3px] border-white bg-primary shadow-md" />
            {showLabels && (
              <span className="whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold text-gray-900 shadow-sm bg-white/80">
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
