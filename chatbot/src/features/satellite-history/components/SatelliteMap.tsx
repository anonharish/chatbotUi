import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSatelliteLayer } from '../hooks/useSatelliteLayer';

interface SatelliteMapProps {
  tileUrl: string;
  coords: { lat: number; lon: number } | null;
  maxzoom?: number;
}

export interface SatelliteMapHandle {
  flyTo: (lat: number, lon: number, bbox?: [string, string, string, string]) => void;
}

// Define a satellite-first base style using ArcGIS World Imagery
const SATELLITE_BASE_STYLE: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
        'esri-world-imagery': {
            type: 'raster',
            tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: '© Esri',
        },
        'esri-labels': {
            type: 'raster',
            tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: '© Esri',
        },
    },
    layers: [
        {
            id: 'esri-world-imagery',
            type: 'raster',
            source: 'esri-world-imagery',
            minzoom: 0,
            maxzoom: 20,
        },
        {
            id: 'esri-labels',
            type: 'raster',
            source: 'esri-labels',
            minzoom: 0,
            maxzoom: 20,
        },
    ],
};

export const SatelliteMap = forwardRef<SatelliteMapHandle, SatelliteMapProps>(
  ({ tileUrl, coords, maxzoom = 9 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    // Initialise map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: SATELLITE_BASE_STYLE,
        center: [78.9629, 20.5937], // Default: India centred
        zoom: 3,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        'bottom-right'
      );

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, []);

    // Expose flyTo for parent
    useImperativeHandle(ref, () => ({
      flyTo(lat: number, lon: number, bbox?: [string, string, string, string]) {
        const map = mapRef.current;
        if (!map) return;

        if (bbox) {
          const [minLat, maxLat, minLon, maxLon] = bbox.map(Number);
          map.fitBounds(
            [
              [minLon, minLat],
              [maxLon, maxLat],
            ],
            { padding: 60, duration: 1500, maxZoom: 12 }
          );
        } else {
          map.flyTo({ center: [lon, lat], zoom: 11, duration: 1500 });
        }

        // Update/place marker
        if (markerRef.current) {
          markerRef.current.setLngLat([lon, lat]);
        } else {
          markerRef.current = new maplibregl.Marker({ color: '#60a5fa' })
            .setLngLat([lon, lat])
            .addTo(map);
        }
      },
    }));

    // Fly to new coords when they change
    useEffect(() => {
      if (!coords || !mapRef.current) return;
      mapRef.current.flyTo({ center: [coords.lon, coords.lat], zoom: 11, duration: 1500 });
    }, [coords]);

    // Satellite raster layer management
    useSatelliteLayer({ map: mapRef.current, tileUrl });

    return (
      <div className="satellite-map-container">
        <div ref={containerRef} className="satellite-map-canvas" />
      </div>
    );
  }
);

SatelliteMap.displayName = 'SatelliteMap';
