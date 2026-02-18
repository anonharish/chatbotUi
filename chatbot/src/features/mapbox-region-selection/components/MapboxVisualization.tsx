import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson'
import { getStateDistrictsCdnUrl } from '@/features/region-selection/constants'
import * as turf from '@turf/turf'
import type { Region } from '../types'
import { createDistrictKey } from '../types'
import { FIELD_OFFICERS, officersToGeoJSON } from '../data'
import { getOfficerPopupHTML } from './OfficerPopup'

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
  currentSelection?: Set<string>  // Composite keys: "stateName_featureId"
  selectedState?: string | null
  // Callback to provide parent with a method to get district features
  onRegisterGetFeatures?: (getter: (ids: Set<number>) => GeoJSON.Feature[]) => void
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  text: string
  isRegion?: boolean
  regionInfo?: {
    name: string
    regionalOfficer?: string
    intelligentOfficer?: string
    districtCount: number
    state: string
  }
}

export const MapboxVisualization = ({
  onStateClick,
  onStateHover,
  onDistrictClick,
  onDistrictHover,
  regions = [],
  currentSelection = new Set(),
  onRegisterGetFeatures,
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
  // Store district features for retrieval
  const districtFeaturesRef = useRef<Feature[]>([])

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

  // Register the getDistrictFeatures function with parent
  useEffect(() => {
    if (onRegisterGetFeatures) {
      const getFeatures = (ids: Set<number>): GeoJSON.Feature[] => {
        return districtFeaturesRef.current.filter(f => ids.has(f.id as number))
      }
      onRegisterGetFeatures(getFeatures)
    }
  }, [onRegisterGetFeatures])

  // Update district colors when regions or selection change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !districtsLoadedRef.current) return
    if (!map.getSource('state-districts')) return

    const count = districtCountRef.current
    const currentState = selectedStateRef.current

    for (let featureId = 0; featureId < count; featureId++) {
      // Create composite key for this featureId
      const districtKey = currentState ? createDistrictKey(currentState, featureId) : null

      // Only apply region color if it's for the current state
      const region = regions.find(r =>
        r.state === currentState && r.districtIds.has(districtKey || '')
      )
      const isSelected = districtKey ? currentSelection.has(districtKey) : false

      map.setFeatureState(
        { source: 'state-districts', id: featureId },
        {
          regionColor: region?.color || null,
          selected: isSelected
        }
      )
    }
  }, [regions, currentSelection])

  // Update persistent all-regions layer when regions change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Wait for map to be ready
    if (!map.isStyleLoaded()) {
      const checkStyle = () => {
        if (map.isStyleLoaded()) {
          updateAllRegionsLayer()
        }
      }
      map.once('styledata', checkStyle)
      return
    }

    updateAllRegionsLayer()

    function updateAllRegionsLayer() {
      // Collect all features from all regions with geometry
      const allFeatures: GeoJSON.Feature[] = []

      regions.forEach((region) => {
        if (region.geometry) {
          region.geometry.forEach(feature => {
            allFeatures.push({
              ...feature,
              properties: {
                ...feature.properties,
                regionId: region.id,
                regionName: region.name,
                regionColor: region.color,
                regionState: region.state,
                regionalOfficer: region.regionalOfficer,
                intelligentOfficer: region.intelligentOfficer,
                districtCount: region.districtIds.size
              },
              id: allFeatures.length
            })
          })
        }
      })

      const featureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: allFeatures
      }

      // Update or create the source
      if (!map) return
      const existingSource = map.getSource('all-regions') as maplibregl.GeoJSONSource

      if (existingSource) {
        existingSource.setData(featureCollection)
      } else if (allFeatures.length > 0) {
        // Add source and layer for persistent regions
        map.addSource('all-regions', {
          type: 'geojson',
          data: featureCollection
        })

        // Add fill layer for persistent regions
        map.addLayer({
          id: 'all-regions-fill',
          type: 'fill',
          source: 'all-regions',
          paint: {
            'fill-color': ['get', 'regionColor'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.85,
              0.65
            ]
          }
        }, 'india-state-fill') // Insert below state fill layer

        // Add border layer for persistent regions
        map.addLayer({
          id: 'all-regions-border',
          type: 'line',
          source: 'all-regions',
          paint: {
            'line-color': ['get', 'regionColor'],
            'line-width': 2,
            'line-opacity': 0.9
          }
        }, 'india-state-fill')

        // Add hover handlers for all-regions layer
        map.on('mouseenter', 'all-regions-fill', () => {
          map.getCanvas().style.cursor = 'pointer'
        })

        map.on('mouseleave', 'all-regions-fill', () => {
          map.getCanvas().style.cursor = ''
          // Clear hover state for all features
          const features = map.querySourceFeatures('all-regions')
          features.forEach(f => {
            if (f.id !== undefined) {
              map.setFeatureState(
                { source: 'all-regions', id: f.id },
                { hover: false }
              )
            }
          })
          setTooltip(prev => ({ ...prev, visible: false }))
        })

        map.on('mousemove', 'all-regions-fill', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0]
            const featureId = feature.id as number

            // Set hover state
            map.setFeatureState(
              { source: 'all-regions', id: featureId },
              { hover: true }
            )

            // Show region tooltip
            const props = feature.properties
            setTooltip({
              visible: true,
              x: e.originalEvent.clientX,
              y: e.originalEvent.clientY,
              text: props?.regionName || 'Unknown Region',
              isRegion: true,
              regionInfo: {
                name: props?.regionName || 'Unknown',
                regionalOfficer: props?.regionalOfficer,
                intelligentOfficer: props?.intelligentOfficer,
                districtCount: props?.districtCount || 0,
                state: props?.regionState || ''
              }
            })
          }
        })
      }
    }
  }, [regions])


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
          // Store features for retrieval when saving regions
          districtFeaturesRef.current = featuresWithIds
          // Apply region colors only for regions belonging to THIS state
          // Note: We don't apply old selections here because feature IDs are reused per state
          for (let featureId = 0; featureId < featuresWithIds.length; featureId++) {
            // Create composite key and check if region contains this district
            const districtKey = createDistrictKey(stateName, featureId)
            const region = regionsRef.current.find(r =>
              r.state === stateName && r.districtIds.has(districtKey)
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
              'line-color': '#ffffff',
              'line-width': 2,
              'line-opacity': 0.8,
              'line-blur': 1,
            },
          })

          // India country border - main
          map.addLayer({
            id: 'india-border-main',
            type: 'line',
            source: 'india-states',
            paint: {
              'line-color': '#ffffff',
              'line-width': 2,
              'line-opacity': 0.2,
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
              'line-color': '#ffffff',
              'line-width': 2,
              'line-opacity': 0.9,
            },
          })

          console.log('State layers added')
        })

      // === FIELD OFFICER CLUSTERS ===
      // Add clustered GeoJSON source with mock officer data
      map.addSource('field-officers', {
        type: 'geojson',
        data: officersToGeoJSON(FIELD_OFFICERS),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Cluster circles — sized and colored by point_count
      map.addLayer({
        id: 'officer-clusters',
        type: 'circle',
        source: 'field-officers',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step', ['get', 'point_count'],
            '#51bbd6',   // teal  < 5
            5, '#f1f075', // yellow 5–15
            15, '#f28cb1' // pink  15+
          ],
          'circle-radius': [
            'step', ['get', 'point_count'],
            14,          // < 5 (was 18)
            5, 18,       // 5–15 (was 24)
            15, 20       // 15+ (was 32)
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255,255,255,0.6)',
        },
      })

      // Cluster count label
      map.addLayer({
        id: 'officer-cluster-count',
        type: 'symbol',
        source: 'field-officers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Open Sans Bold'],
          'text-size': 12, // Reduced from 13
        },
        paint: {
          'text-color': '#1e293b',
        },
      })

      // Individual (unclustered) officer pins
      map.addLayer({
        id: 'officer-unclustered',
        type: 'circle',
        source: 'field-officers',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#22c55e',
          'circle-radius': 8,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
        },
      })

      console.log('Field officer cluster layers added')
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

    // === FIELD OFFICER CLUSTER HANDLERS ===
    // Click cluster → zoom to expand
    map.on('click', 'officer-clusters', async (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['officer-clusters'] })
      if (!features.length) return
      const clusterId = features[0].properties?.cluster_id
      const source = map.getSource('field-officers') as maplibregl.GeoJSONSource
      if (!source || clusterId === undefined) return

      try {
        const zoom = await source.getClusterExpansionZoom(clusterId)
        const geometry = features[0].geometry
        if (geometry.type === 'Point') {
          map.flyTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom,
            duration: 800,
          })
        }
      } catch (err) {
        console.error('Error expanding cluster:', err)
      }
    })

    // Click individual officer → show popup
    map.on('click', 'officer-unclustered', (e) => {
      if (!e.features || !e.features.length) return
      const feature = e.features[0]
      const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number]
      const props = feature.properties || {}

      new maplibregl.Popup({
        offset: 15,
        className: 'officer-popup',
        maxWidth: '280px',
      })
        .setLngLat(coords)
        .setHTML(getOfficerPopupHTML(props as Record<string, string>))
        .addTo(map)
    })

    // Cursor changes on hover
    map.on('mouseenter', 'officer-clusters', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'officer-clusters', () => {
      map.getCanvas().style.cursor = ''
    })
    map.on('mouseenter', 'officer-unclustered', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'officer-unclustered', () => {
      map.getCanvas().style.cursor = ''
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
            minWidth: tooltip.isRegion ? '180px' : 'auto'
          }}
        >
          {tooltip.isRegion && tooltip.regionInfo ? (
            <div className="space-y-1">
              <div className="font-semibold text-base">{tooltip.regionInfo.name}</div>
              <div className="text-xs text-muted-foreground">{tooltip.regionInfo.state}</div>
              <div className="text-xs space-y-0.5 pt-1 border-t border-border mt-1">
                <div>{tooltip.regionInfo.districtCount} district{tooltip.regionInfo.districtCount !== 1 ? 's' : ''}</div>
                {tooltip.regionInfo.regionalOfficer && (
                  <div>RO: {tooltip.regionInfo.regionalOfficer}</div>
                )}
                {tooltip.regionInfo.intelligentOfficer && (
                  <div>IO: {tooltip.regionInfo.intelligentOfficer}</div>
                )}
              </div>
            </div>
          ) : (
            tooltip.text
          )}
        </div>
      )}
    </div>
  )
}
