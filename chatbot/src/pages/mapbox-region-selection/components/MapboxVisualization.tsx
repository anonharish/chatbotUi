import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection } from 'geojson'

// India center coordinates
const INDIA_CENTER: [number, number] = [78.9629, 22.5937]
const INITIAL_ZOOM = 3.5

// Natural Earth country boundaries GeoJSON URL
const COUNTRY_BOUNDARIES_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'

// India States GeoJSON URL
const INDIA_STATES_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'

// India Districts GeoJSON URL
const INDIA_DISTRICTS_URL = 'https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson'

interface MapboxVisualizationProps {
  onStateClick?: (stateName: string) => void
  onStateHover?: (stateName: string | null) => void
}

export const MapboxVisualization = ({
  onStateClick,
  onStateHover,
}: MapboxVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const dataLoadedRef = useRef({ states: false, districts: false })

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: 'Satellite Globe',
        sources: {
          // ESRI Satellite imagery
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          // Labels overlay
          'carto-labels': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            maxzoom: 20,
          },
          // Country boundaries
          'country-boundaries': {
            type: 'geojson',
            data: COUNTRY_BOUNDARIES_URL,
          },
          // India states
          'india-states': {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          },
          // India districts
          'india-districts': {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          },
        },
        layers: [
          // Satellite base layer
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'raster-brightness-max': 1,
              'raster-brightness-min': 0.1,
              'raster-saturation': 0.2,
              'raster-contrast': 0.1,
            },
          },
          // Country borders - coral/pink
          {
            id: 'country-borders',
            type: 'line',
            source: 'country-boundaries',
            maxzoom: 6,
            paint: {
              'line-color': '#ff9999',
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 4, 1.5, 6, 0.5],
              'line-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.8, 5, 0.6, 6, 0],
            },
          },
          // India state borders - bright green
          {
            id: 'india-state-borders',
            type: 'line',
            source: 'india-states',
            minzoom: 3,
            paint: {
              'line-color': '#8BC462',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1, 5, 2, 8, 3],
              'line-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.3, 4, 0.8, 6, 1],
            },
          },
          // India state fill (for hover/click)
          {
            id: 'india-state-fill',
            type: 'fill',
            source: 'india-states',
            minzoom: 3,
            paint: {
              'fill-color': 'transparent',
              'fill-opacity': 0,
            },
          },
          // District borders - cyan/blue
          {
            id: 'district-borders',
            type: 'line',
            source: 'india-districts',
            minzoom: 5,
            paint: {
              'line-color': '#22d3ee',
              'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 7, 1, 10, 1.5],
              'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0, 6, 0.6, 7, 0.9],
            },
          },
          // Labels layer on top
          {
            id: 'labels-layer',
            type: 'raster',
            source: 'carto-labels',
            minzoom: 0,
            maxzoom: 22,
            paint: { 'raster-opacity': 1 },
          },
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: INDIA_CENTER,
      zoom: INITIAL_ZOOM,
      maxPitch: 85,
    })

    // Enable globe projection
    map.on('style.load', () => {
      map.setProjection({ type: 'globe' })
      
      // Dark space atmosphere
      map.setSky({
        'sky-color': '#0f172a',
        'sky-horizon-blend': 0.5,
        'horizon-color': '#1e3a5f',
        'horizon-fog-blend': 0.3,
        'fog-color': '#0f172a',
        'fog-ground-blend': 0.9,
      })

      // Load India states
      if (!dataLoadedRef.current.states) {
        fetch(INDIA_STATES_URL)
          .then(res => res.json())
          .then((data: FeatureCollection) => {
            const source = map.getSource('india-states') as maplibregl.GeoJSONSource
            if (source) {
              source.setData(data)
              dataLoadedRef.current.states = true
            }
          })
          .catch(err => console.error('Error loading India states:', err))
      }

      // Load India districts
      if (!dataLoadedRef.current.districts) {
        fetch(INDIA_DISTRICTS_URL)
          .then(res => res.json())
          .then((data: FeatureCollection) => {
            const source = map.getSource('india-districts') as maplibregl.GeoJSONSource
            if (source) {
              source.setData(data)
              dataLoadedRef.current.districts = true
            }
          })
          .catch(err => console.error('Error loading India districts:', err))
      }
    })

    // State hover handlers
    map.on('mouseenter', 'india-state-fill', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'india-state-fill', () => {
      map.getCanvas().style.cursor = ''
      onStateHover?.(null)
    })

    map.on('mousemove', 'india-state-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const stateName = e.features[0].properties?.ST_NM
        if (stateName) onStateHover?.(stateName)
      }
    })

    map.on('click', 'india-state-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const stateName = e.features[0].properties?.ST_NM
        if (stateName) onStateClick?.(stateName)
      }
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      dataLoadedRef.current = { states: false, districts: false }
    }
  }, [onStateClick, onStateHover])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  )
}
