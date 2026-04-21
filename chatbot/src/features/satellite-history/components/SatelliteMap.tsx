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

// Google Satellite base style — fast, high-quality, no ArcGIS
const GOOGLE_SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'google-satellite': {
      type: 'raster',
      tiles: [
        'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      ],
      tileSize: 256,
      maxzoom: 20,
      attribution: '© Google',
    },
    'google-labels': {
      type: 'raster',
      tiles: [
        'https://mt0.google.com/vt/lyrs=h&x={x}&y={y}&z={z}',
        'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}',
      ],
      tileSize: 256,
      maxzoom: 20,
      attribution: '© Google',
    },
  },
  layers: [
    {
      id: 'google-satellite',
      type: 'raster',
      source: 'google-satellite',
    },
    {
      id: 'google-labels',
      type: 'raster',
      source: 'google-labels',
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
        style: GOOGLE_SATELLITE_STYLE,
        center: [78.9629, 20.5937], // Default: India centred
        zoom: 5,
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
