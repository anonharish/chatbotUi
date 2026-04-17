import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';

const SOURCE_ID = 'gibs-satellite-source';
const LAYER_ID = 'gibs-satellite-layer';

interface UseSatelliteLayerOptions {
  map: maplibregl.Map | null;
  tileUrl: string;
  maxzoom?: number;
}

/**
 * Manages the NASA GIBS raster layer on a MapLibre map.
 * - Adds the source + layer on first call
 * - Hot-swaps tile URL on subsequent tileUrl changes (no full reload)
 * - Fades in on tile load via opacity transition
 * - Cleans up on unmount
 */
export function useSatelliteLayer({ map, tileUrl, maxzoom = 9 }: UseSatelliteLayerOptions) {
  const initialised = useRef(false);
  const currentMaxZoom = useRef(maxzoom);

  // Add/Update layer to map
  useEffect(() => {
    if (!map || !tileUrl) return;

    const refreshLayer = () => {
      // If maxzoom changed or source doesn't exist, we must re-create it
      // MapLibre doesn't allow changing maxzoom on an existing source
      const sourceExists = map.getSource(SOURCE_ID);
      const needsRecreate = !sourceExists || currentMaxZoom.current !== maxzoom;

      if (needsRecreate) {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);

        map.addSource(SOURCE_ID, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© Satellite Imagery',
          maxzoom: maxzoom,
        });

        map.addLayer(
          {
            id: LAYER_ID,
            type: 'raster',
            source: SOURCE_ID,
            paint: {
              'raster-opacity': 1, // Default to visible for now to ensure we see it
            },
          },
          // Insert below labels so place names stay readable
          getFirstLabelLayerId(map)
        );
        
        currentMaxZoom.current = maxzoom;
        initialised.current = true;
      } else {
        // Just swap tiles if it's the same source type
        const source = map.getSource(SOURCE_ID) as maplibregl.RasterTileSource;
        source.setTiles([tileUrl]);
      }
    };

    if (map.isStyleLoaded()) {
      refreshLayer();
    } else {
      map.once('styledata', refreshLayer);
    }

    return () => {
      map.off('styledata', refreshLayer);
    };
  }, [map, tileUrl, maxzoom]);

  // Cleanup on final unmount
  useEffect(() => {
    return () => {
      if (!map) return;
      try {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch (e) { /* ignore */ }
    };
  }, [map]);
}

/** Returns the id of the first label/symbol layer (so satellite goes below labels). */
function getFirstLabelLayerId(map: maplibregl.Map): string | undefined {
  const layers = map.getStyle()?.layers ?? [];
  // Prioritise our custom esri-labels first
  if (layers.find(l => l.id === 'esri-labels')) return 'esri-labels';
  
  // Fallback to any symbol layer
  for (const layer of layers) {
    if (layer.type === 'symbol') return layer.id;
  }
  return undefined;
}
