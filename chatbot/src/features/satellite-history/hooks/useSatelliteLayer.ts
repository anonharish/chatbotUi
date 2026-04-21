import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';

const SOURCE_ID = 'gee-satellite-source';
const LAYER_ID = 'gee-satellite-layer';

interface UseSatelliteLayerOptions {
  map: maplibregl.Map | null;
  tileUrl: string;
  maxzoom?: number;
  tileSize?: number;
}

/**
 * Manages the GEE historical raster layer on a MapLibre GL map.
 *
 * - On first call with a tileUrl: adds source + layer below the labels.
 * - On tileUrl change: removes old, creates new for a clean swap.
 * - On unmount: removes source + layer.
 */
export function useSatelliteLayer({
  map,
  tileUrl,
  maxzoom = 18,
  tileSize = 256,
}: UseSatelliteLayerOptions): void {
  const renderedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!map || !tileUrl) return;

    const applyLayer = () => {
      // Skip if already rendered this exact URL
      if (renderedUrlRef.current === tileUrl) return;

      // Tear down previous layer + source
      try {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch {
        // Silently ignore
      }

      // Add fresh raster source
      map.addSource(SOURCE_ID, {
        type: 'raster',
        tiles: [tileUrl],
        tileSize,
        maxzoom,
        attribution: '© Google Earth Engine',
      });

      // Add raster layer below labels
      map.addLayer(
        {
          id: LAYER_ID,
          type: 'raster',
          source: SOURCE_ID,
          minzoom: 0,
          maxzoom: 22,
          paint: {
            'raster-opacity': 1,
          },
        },
        getFirstLabelLayerId(map)
      );

      renderedUrlRef.current = tileUrl;
    };

    if (map.isStyleLoaded()) {
      applyLayer();
    } else {
      map.once('styledata', applyLayer);
    }

    return () => {
      map.off('styledata', applyLayer);
    };
  }, [map, tileUrl, maxzoom, tileSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!map) return;
      try {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch {
        /* ignore */
      }
    };
  }, [map]);
}

/**
 * Returns the ID of the first label layer so we can insert imagery below it.
 */
function getFirstLabelLayerId(map: maplibregl.Map): string | undefined {
  const layers = map.getStyle()?.layers ?? [];

  // Our Google labels layer
  if (layers.find((l) => l.id === 'google-labels')) return 'google-labels';

  // Fallback: first symbol layer
  for (const layer of layers) {
    if (layer.type === 'symbol') return layer.id;
  }

  return undefined;
}
