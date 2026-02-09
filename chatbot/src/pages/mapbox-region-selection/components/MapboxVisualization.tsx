import { useEffect, useRef, useCallback, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson'
import { getStateDistrictsCdnUrl } from '../../region-selection/constants'
import * as turf from '@turf/turf'

// India center coordinates
const INDIA_CENTER: [number, number] = [78.9629, 22.5937]
const INITIAL_ZOOM = 3.5

// India States GeoJSON URL
const INDIA_STATES_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'

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
  const hoveredStateIdRef = useRef<number | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const statesDataRef = useRef<FeatureCollection | null>(null)

  // Load districts for a selected state
  const loadStateDistricts = useCallback((map: maplibregl.Map, stateName: string) => {
    const districtsUrl = getStateDistrictsCdnUrl(stateName)
    if (!districtsUrl) {
      console.warn(`No district data URL for state: ${stateName}`)
      return
    }

    console.log(`Loading districts for ${stateName}:`, districtsUrl)

    fetch(districtsUrl)
      .then(res => res.json())
      .then((data: FeatureCollection) => {
        console.log(`Districts loaded for ${stateName}:`, data.features.length)

        // Remove existing district source and layers if they exist
        if (map.getLayer('district-borders')) {
          map.removeLayer('district-borders')
        }
        if (map.getLayer('district-fill')) {
          map.removeLayer('district-fill')
        }
        if (map.getSource('state-districts')) {
          map.removeSource('state-districts')
        }

        // Add new district source
        map.addSource('state-districts', {
          type: 'geojson',
          data: data,
        })

        // District fill for hover
        map.addLayer({
          id: 'district-fill',
          type: 'fill',
          source: 'state-districts',
          paint: {
            'fill-color': 'rgba(0, 0, 0, 0)',
            'fill-opacity': 0,
          },
        })

        // District borders - cyan/blue
        map.addLayer({
          id: 'district-borders',
          type: 'line',
          source: 'state-districts',
          paint: {
            'line-color': '#22d3ee',
            'line-width': 1.5,
            'line-opacity': 0.9,
          },
        })
      })
      .catch(err => console.error(`Error loading districts for ${stateName}:`, err))
  }, [])

  // Zoom to state bounds
  const zoomToState = useCallback((map: maplibregl.Map, stateName: string) => {
    if (!statesDataRef.current) return

    // Find the state feature
    const stateFeature = statesDataRef.current.features.find(
      f => f.properties?.ST_NM === stateName
    )

    if (!stateFeature || !stateFeature.geometry) {
      console.warn(`State feature not found: ${stateName}`)
      return
    }

    // Calculate bounding box using turf
    const bbox = turf.bbox(stateFeature as Feature<Polygon | MultiPolygon>)
    
    // Fly to the state bounds
    map.fitBounds(
      [[bbox[0], bbox[1]], [bbox[2], bbox[3]]] as maplibregl.LngLatBoundsLike,
      {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1500,
        maxZoom: 8
      }
    )
  }, [])

  // Handle state click - zoom and load districts
  const handleStateClick = useCallback((stateName: string, feature?: Feature) => {
    console.log('State clicked:', stateName)
    
    if (!mapRef.current) return

    const map = mapRef.current

    // Update selected state
    setSelectedState(stateName)

    // Zoom to state
    zoomToState(map, stateName)

    // Load districts for this state
    loadStateDistricts(map, stateName)

    // Notify parent
    onStateClick?.(stateName)
  }, [onStateClick, zoomToState, loadStateDistricts])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: 'Satellite Globe',
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
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
        },
        layers: [
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

    map.on('load', () => {
      map.setProjection({ type: 'globe' })
      
      map.setSky({
        'sky-color': '#0b0b19',
        'sky-horizon-blend': 0.4,
        'horizon-color': '#1e3a8a',
        'horizon-fog-blend': 0.2,
        'fog-color': '#172554',
        'fog-ground-blend': 0.8,
      })

      // Load India States
      fetch(INDIA_STATES_URL)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log('States loaded:', data.features.length)
          
          // Store for later use (zoom to state)
          statesDataRef.current = data
          
          const featuresWithIds = data.features.map((f: Feature, i: number) => ({
            ...f,
            id: i
          }))
          
          map.addSource('india-states', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: featuresWithIds },
            generateId: true
          })

          // India country border - glow
          map.addLayer({
            id: 'india-border-glow',
            type: 'line',
            source: 'india-states',
            paint: {
              'line-color': '#ff6b6b',
              'line-width': 8,
              'line-opacity': 0.3,
              'line-blur': 4,
            },
          })

          // India country border - main
          map.addLayer({
            id: 'india-border-main',
            type: 'line',
            source: 'india-states',
            paint: {
              'line-color': '#ff4757',
              'line-width': 3,
              'line-opacity': 0.9,
            },
          })

          // State fill for hover/click
          map.addLayer({
            id: 'india-state-fill',
            type: 'fill',
            source: 'india-states',
            paint: {
              'fill-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                'rgba(139, 196, 98, 0.4)',
                'rgba(0, 0, 0, 0)'
              ],
              'fill-opacity': 1,
            },
          })

          // State borders - green
          map.addLayer({
            id: 'india-state-borders',
            type: 'line',
            source: 'india-states',
            paint: {
              'line-color': '#8BC462',
              'line-width': 2,
              'line-opacity': 0.9,
            },
          })

          console.log('State layers added')
        })
    })

    // Hover handlers
    map.on('mouseenter', 'india-state-fill', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'india-state-fill', () => {
      map.getCanvas().style.cursor = ''
      if (hoveredStateIdRef.current !== null) {
        map.setFeatureState(
          { source: 'india-states', id: hoveredStateIdRef.current },
          { hover: false }
        )
      }
      hoveredStateIdRef.current = null
      onStateHover?.(null)
    })

    map.on('mousemove', 'india-state-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        const featureId = feature.id as number
        
        if (hoveredStateIdRef.current !== null && hoveredStateIdRef.current !== featureId) {
          map.setFeatureState(
            { source: 'india-states', id: hoveredStateIdRef.current },
            { hover: false }
          )
        }
        
        hoveredStateIdRef.current = featureId
        map.setFeatureState(
          { source: 'india-states', id: featureId },
          { hover: true }
        )
        
        const stateName = feature.properties?.ST_NM
        if (stateName) onStateHover?.(stateName)
      }
    })

    // Click handler - zoom and load districts
    map.on('click', 'india-state-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const stateName = e.features[0].properties?.ST_NM
        if (stateName) {
          handleStateClick(stateName, e.features[0] as Feature)
        }
      }
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [onStateHover, handleStateClick])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  )
}
