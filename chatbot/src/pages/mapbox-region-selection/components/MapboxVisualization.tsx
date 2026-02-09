import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson'
import { getStateDistrictsCdnUrl } from '../../region-selection/constants'
import * as turf from '@turf/turf'
import type { Region } from '../types'

// India center coordinates
const INDIA_CENTER: [number, number] = [78.9629, 22.5937]
const INITIAL_ZOOM = 3.5

// India States GeoJSON URL
const INDIA_STATES_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'

// Colors
const DISTRICT_HOVER_COLOR = 'rgba(245, 222, 179, 0.6)'  // Beige/wheat
const DISTRICT_SELECTED_COLOR = 'rgba(135, 206, 250, 0.7)'  // Light sky blue
const DISTRICT_BORDER_COLOR = '#22d3ee'  // Cyan

interface MapboxVisualizationProps {
  onStateClick?: (stateName: string) => void
  onStateHover?: (stateName: string | null) => void
  onDistrictClick?: (districtId: number, districtName: string, stateName: string) => void
  onDistrictHover?: (districtName: string | null) => void
  // New props for region management
  regions?: Region[]
  currentSelection?: Set<number>
  selectedState?: string | null
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  text: string
}

export const MapboxVisualization = ({
  onStateClick,
  onStateHover,
  onDistrictClick,
  onDistrictHover,
  regions = [],
  currentSelection = new Set(),
}: MapboxVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const hoveredStateIdRef = useRef<number | null>(null)
  const hoveredDistrictIdRef = useRef<number | null>(null)
  const selectedStateRef = useRef<string | null>(null)
  const statesDataRef = useRef<FeatureCollection | null>(null)
  const districtClickedRef = useRef<boolean>(false)
  const districtsLoadedRef = useRef<boolean>(false)
  const districtCountRef = useRef<number>(0)
  
  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: ''
  })
  
  // Store callbacks in refs to avoid useEffect re-runs
  const onStateClickRef = useRef(onStateClick)
  const onStateHoverRef = useRef(onStateHover)
  const onDistrictClickRef = useRef(onDistrictClick)
  const onDistrictHoverRef = useRef(onDistrictHover)
  const regionsRef = useRef(regions)
  const currentSelectionRef = useRef(currentSelection)
  
  
  // Update refs when props change
  useEffect(() => {
    onStateClickRef.current = onStateClick
    onStateHoverRef.current = onStateHover
    onDistrictClickRef.current = onDistrictClick
    onDistrictHoverRef.current = onDistrictHover
    regionsRef.current = regions
    currentSelectionRef.current = currentSelection
  }, [onStateClick, onStateHover, onDistrictClick, onDistrictHover, regions, currentSelection])

  // Update district colors when regions or selection change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !districtsLoadedRef.current) return
    if (!map.getSource('state-districts')) return
    
    const count = districtCountRef.current
    const currentState = selectedStateRef.current
    console.log('Updating feature states, count:', count, 'selection size:', currentSelection.size, 'state:', currentState)
    
    for (let featureId = 0; featureId < count; featureId++) {
      // Only apply region color if it's for the current state
      const region = regions.find(r => 
        r.state === currentState && r.districtIds.has(featureId)
      )
      const isSelected = currentSelection.has(featureId)
      
      map.setFeatureState(
        { source: 'state-districts', id: featureId },
        { 
          regionColor: region?.color || null,
          selected: isSelected
        }
      )
    }
  }, [regions, currentSelection])

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

    // Helper: Zoom to state bounds
    const zoomToState = (stateName: string) => {
      if (!statesDataRef.current) return

      const stateFeature = statesDataRef.current.features.find(
        f => f.properties?.ST_NM === stateName
      )

      if (!stateFeature || !stateFeature.geometry) {
        console.warn(`State feature not found: ${stateName}`)
        return
      }

      const bbox = turf.bbox(stateFeature as Feature<Polygon | MultiPolygon>)
      
      map.fitBounds(
        [[bbox[0], bbox[1]], [bbox[2], bbox[3]]] as maplibregl.LngLatBoundsLike,
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1500,
          maxZoom: 8
        }
      )
    }

    // Helper: Load districts for a state
    const loadStateDistricts = (stateName: string) => {
      const districtsUrl = getStateDistrictsCdnUrl(stateName)
      if (!districtsUrl) {
        console.warn(`No district data URL for state: ${stateName}`)
        return
      }

      console.log(`Loading districts for ${stateName}:`, districtsUrl)
      districtsLoadedRef.current = false

      fetch(districtsUrl)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log(`Districts loaded for ${stateName}:`, data.features.length)

          // Remove existing district source and layers if they exist
          if (map.getLayer('region-fill')) {
            map.removeLayer('region-fill')
          }
          if (map.getLayer('district-borders')) {
            map.removeLayer('district-borders')
          }
          if (map.getLayer('district-fill')) {
            map.removeLayer('district-fill')
          }
          if (map.getSource('state-districts')) {
            map.removeSource('state-districts')
          }

          // Add IDs for feature-state
          const featuresWithIds = data.features.map((f: Feature, i: number) => ({
            ...f,
            id: i
          }))

          // Add new district source
          map.addSource('state-districts', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: featuresWithIds },
            generateId: true
          })

          // District fill - colors based on region, selection, or hover
          map.addLayer({
            id: 'district-fill',
            type: 'fill',
            source: 'state-districts',
            paint: {
              'fill-color': [
                'case',
                // Selected color (takes priority for visual feedback)
                ['boolean', ['feature-state', 'selected'], false],
                DISTRICT_SELECTED_COLOR,
                // Hover color
                ['boolean', ['feature-state', 'hover'], false],
                DISTRICT_HOVER_COLOR,
                // Default transparent
                'rgba(0, 0, 0, 0)'
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.7,
                ['boolean', ['feature-state', 'hover'], false],
                0.6,
                0
              ],
            },
          })

          // District borders - cyan
          map.addLayer({
            id: 'district-borders',
            type: 'line',
            source: 'state-districts',
            paint: {
              'line-color': DISTRICT_BORDER_COLOR,
              'line-width': 1.5,
              'line-opacity': 0.9,
            },
          })
          
          // Region fill layer - for saved regions (rendered on top)
          map.addLayer({
            id: 'region-fill',
            type: 'fill',
            source: 'state-districts',
            paint: {
              'fill-color': ['coalesce', ['feature-state', 'regionColor'], 'transparent'],
              'fill-opacity': [
                'case',
                ['to-boolean', ['feature-state', 'regionColor']],
                0.7,
                0
              ],
            },
          })

          districtsLoadedRef.current = true
          districtCountRef.current = featuresWithIds.length
          console.log('Districts setup complete, count:', featuresWithIds.length)
          
          // Apply region colors only for regions belonging to THIS state
          // Note: We don't apply old selections here because feature IDs are reused per state
          for (let featureId = 0; featureId < featuresWithIds.length; featureId++) {
            // Only apply region color if the region is for this state
            const region = regionsRef.current.find(r => 
              r.state === stateName && r.districtIds.has(featureId)
            )
            
            if (region) {
              map.setFeatureState(
                { source: 'state-districts', id: featureId },
                { 
                  regionColor: region.color,
                  selected: false
                }
              )
            }
          }
        })
        .catch(err => console.error(`Error loading districts for ${stateName}:`, err))
    }

    // Helper: Handle state click
    const handleStateClick = (stateName: string) => {
      console.log('State clicked:', stateName)
      
      selectedStateRef.current = stateName
      zoomToState(stateName)
      loadStateDistricts(stateName)
      onStateClickRef.current?.(stateName)
    }

    // Helper: Handle district click
    const handleDistrictClick = (featureId: number, districtName: string) => {
      console.log('District clicked:', districtName, 'ID:', featureId)
      onDistrictClickRef.current?.(featureId, districtName, selectedStateRef.current || '')
    }

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

    // === STATE HOVER HANDLERS ===
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
      onStateHoverRef.current?.(null)
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
        if (stateName) onStateHoverRef.current?.(stateName)
      }
    })

    // State click handler
    map.on('click', 'india-state-fill', (e) => {
      // Skip if a district was just clicked
      if (districtClickedRef.current) {
        districtClickedRef.current = false
        return
      }
      
      // Check if clicking on a district (district layer takes priority)
      if (map.getLayer('district-fill')) {
        const districtFeatures = map.queryRenderedFeatures(e.point, { layers: ['district-fill'] })
        if (districtFeatures && districtFeatures.length > 0) {
          // District exists at this point, let district handler handle it
          return
        }
      }
      
      if (e.features && e.features.length > 0) {
        const stateName = e.features[0].properties?.ST_NM
        if (stateName) {
          handleStateClick(stateName)
        }
      }
    })

    // === DISTRICT HOVER HANDLERS ===
    map.on('mouseenter', 'district-fill', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'district-fill', () => {
      map.getCanvas().style.cursor = ''
      if (hoveredDistrictIdRef.current !== null) {
        map.setFeatureState(
          { source: 'state-districts', id: hoveredDistrictIdRef.current },
          { hover: false }
        )
      }
      hoveredDistrictIdRef.current = null
      setTooltip(prev => ({ ...prev, visible: false }))
      onDistrictHoverRef.current?.(null)
    })

    map.on('mousemove', 'district-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        const featureId = feature.id as number
        
        if (hoveredDistrictIdRef.current !== null && hoveredDistrictIdRef.current !== featureId) {
          map.setFeatureState(
            { source: 'state-districts', id: hoveredDistrictIdRef.current },
            { hover: false }
          )
        }
        
        hoveredDistrictIdRef.current = featureId
        map.setFeatureState(
          { source: 'state-districts', id: featureId },
          { hover: true }
        )
        
        // Get district name (try different property names)
        const districtName = feature.properties?.district || 
                            feature.properties?.DISTRICT || 
                            feature.properties?.name ||
                            feature.properties?.NAME ||
                            'Unknown District'
        
        // Show tooltip at cursor position
        setTooltip({
          visible: true,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
          text: districtName
        })
        
        onDistrictHoverRef.current?.(districtName)
      }
    })

    // District click handler - toggle selection
    map.on('click', 'district-fill', (e) => {
      // Set flag to prevent state click handler from firing
      districtClickedRef.current = true
      
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        const featureId = feature.id as number
        const districtName = feature.properties?.district || 
                            feature.properties?.DISTRICT || 
                            feature.properties?.name ||
                            feature.properties?.NAME ||
                            'Unknown District'
        
        handleDistrictClick(featureId, districtName)
      }
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Shadcn-style tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 10,
            pointerEvents: 'none',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
