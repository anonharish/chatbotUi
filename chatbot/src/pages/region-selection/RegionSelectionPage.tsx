import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet'
import type { FeatureCollection, Feature } from 'geojson'
import type { Layer, LeafletMouseEvent, Map as LeafletMap, LatLngBounds } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { Region, DistrictProperties, DistrictData } from './types'
import {
  generateId,
  getNextColor,
  darkenColor,
  SELECTION_COLOR,
  SELECTION_BORDER,
  DEFAULT_FILL,
  DEFAULT_BORDER,
  HOVER_FILL,
  HOVER_BORDER,
  STATE_CDN_SLUG_MAP,
  STATE_NAME_TO_CODE,
  getStateDistrictsCdnUrl,
} from './constants'
import { RegionForm, RegionCard } from './components'

// Types for state properties
interface StateProperties {
  name: string
  state_code?: string
  ST_NM?: string
}

// India center coordinates
const INDIA_CENTER: [number, number] = [22.5937, 78.9629]
const INDIA_ZOOM = 5

// India States GeoJSON URL (from a public CDN)
const INDIA_STATES_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'

// Cache for loaded state districts GeoJSON
type StateDistrictsCache = Map<string, FeatureCollection>

// Helper function to get bounds from a GeoJSON feature
const getBoundsFromFeature = (feature: Feature): LatLngBounds | null => {
  try {
    const layer = L.geoJSON(feature)
    return layer.getBounds()
  } catch {
    return null
  }
}

// Simple map controller - just provides map reference
const MapController = ({ 
  onMapReady,
}: { 
  onMapReady: (map: LeafletMap) => void
}) => {
  const map = useMap()

  useEffect(() => {
    onMapReady(map)
  }, [map, onMapReady])

  return null
}

const RegionSelectionPage = () => {
  // Map and view state
  const [indiaGeoData, setIndiaGeoData] = useState<FeatureCollection | null>(null)
  // Cache for loaded state districts (persists when switching states)
  const stateDistrictsCacheRef = useRef<StateDistrictsCache>(new Map())
  const [currentStateDistricts, setCurrentStateDistricts] = useState<FeatureCollection | null>(null)
  const [districtsLoading, setDistrictsLoading] = useState(false)
  const [districtsLoadError, setDistrictsLoadError] = useState<string | null>(null)
  // Single state selection
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)

  // Region management state
  const [regions, setRegions] = useState<Region[]>([])
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set())
  const [regionName, setRegionName] = useState('')
  const [regionalOfficer, setRegionalOfficer] = useState('')
  const [intelligentOfficer, setIntelligentOfficer] = useState('')
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null)

  // Load India states GeoJSON
  useEffect(() => {
    fetch(INDIA_STATES_URL)
      .then((response) => response.json())
      .then((data: FeatureCollection) => setIndiaGeoData(data))
      .catch((error) => console.error('Error loading India GeoJSON:', error))
  }, [])

  // Load districts for a specific state from CDN (cached per state)
  const loadStateDistricts = useCallback((stateName: string) => {
    // Check if already cached
    const cached = stateDistrictsCacheRef.current.get(stateName)
    if (cached) {
      setCurrentStateDistricts(cached)
      return
    }
    
    // Get CDN URL for this state
    const cdnUrl = getStateDistrictsCdnUrl(stateName)
    if (!cdnUrl) {
      console.warn(`No CDN URL for state: ${stateName}`)
      setDistrictsLoadError(`District data not available for ${stateName}`)
      return
    }
    
    setDistrictsLoading(true)
    setDistrictsLoadError(null)
    
    fetch(cdnUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load districts for ${stateName}`)
        return response.json()
      })
      .then((data: FeatureCollection) => {
        // Cache the data
        stateDistrictsCacheRef.current.set(stateName, data)
        setCurrentStateDistricts(data)
        setDistrictsLoading(false)
      })
      .catch((error) => {
        console.error(`Error loading ${stateName} districts:`, error)
        setDistrictsLoadError(error.message)
        setDistrictsLoading(false)
      })
  }, [])

  // Handle state click - directly load districts and zoom
  const handleStateClick = useCallback((stateName: string) => {
    // Check if we have CDN mapping for this state
    if (!STATE_CDN_SLUG_MAP[stateName]) {
      console.warn(`No CDN mapping found for: ${stateName}`)
      return
    }
    
    // Set state and load districts directly
    setSelectedState(stateName)
    setIsTransitioning(true)
    setCurrentSelection(new Set()) // Clear selection when switching states
    loadStateDistricts(stateName)
    
    // Zoom into the state for better view
    if (mapRef.current && indiaGeoData) {
      const stateFeature = indiaGeoData.features.find((f) => {
        const props = f.properties as StateProperties
        return (props.ST_NM || props.name) === stateName
      })
      
      if (stateFeature) {
        const bounds = getBoundsFromFeature(stateFeature)
        if (bounds) {
          mapRef.current.flyToBounds(bounds, {
            duration: 1.0,
            padding: [30, 30],
          })
        }
      }
    }
    
    setTimeout(() => setIsTransitioning(false), 1000)
  }, [indiaGeoData, loadStateDistricts])

  // Map ready callback
  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map
  }, [])

  // ==================== State Level Styling ====================
  // Dark map style with glowing white borders
  const getStateStyle = useCallback((feature: Feature | undefined) => {
    const props = feature?.properties as StateProperties
    const stateName = props?.ST_NM || props?.name || ''
    const isHovered = hoveredState === stateName
    const hasStateCode = STATE_NAME_TO_CODE[stateName] !== undefined

    if (hasStateCode) {
      // States with district data - cyan/light blue glow when hovered
      return {
        fillColor: 'transparent',
        weight: isHovered ? 2.5 : 1.5,
        opacity: isHovered ? 1 : 0.7,
        color: isHovered ? '#67e8f9' : 'rgba(255, 255, 255, 0.5)', // Cyan on hover, white normally
        fillOpacity: isHovered ? 0.15 : 0,
      }
    }

    // States without district data - dimmer white border
    return {
      fillColor: 'transparent',
      weight: 1,
      opacity: 0.4,
      color: 'rgba(255, 255, 255, 0.3)',
      fillOpacity: 0,
    }
  }, [hoveredState])

  const onEachState = useCallback((feature: Feature, layer: Layer) => {
    const props = feature.properties as StateProperties
    const stateName = props.ST_NM || props.name || 'Unknown'
    const hasStateCode = STATE_NAME_TO_CODE[stateName] !== undefined

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setHoveredState(stateName)
        const target = e.target
        // Add 3D projection CSS class
        const element = target.getElement()
        if (element) {
          element.classList.add('state-selected')
        }
        if (hasStateCode) {
          // Dark theme: cyan glow with minimal fill
          target.setStyle({
            color: '#67e8f9', // Cyan border
            fillColor: 'rgba(103, 232, 249, 0.1)',
            fillOpacity: 0.15,
            weight: 2.5,
          })
        } else {
          // States without data: subtle white glow
          target.setStyle({
            color: 'rgba(255, 255, 255, 0.6)',
            fillColor: 'transparent',
            fillOpacity: 0,
            weight: 1.5,
          })
        }
        target.bringToFront()
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredState(null)
        const target = e.target
        // Remove 3D projection CSS class
        const element = target.getElement()
        if (element) {
          element.classList.remove('state-selected')
        }
        target.setStyle(getStateStyle(feature))
      },
      click: () => {
        handleStateClick(stateName)
      },
    })

    // Tooltip with state name
    const tooltipContent = hasStateCode
      ? `<div><strong>${stateName}</strong><br/><span class="text-xs text-green-600">Click to explore districts</span></div>`
      : `<strong>${stateName}</strong>`

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'center',
      className: 'state-tooltip',
    })
  }, [getStateStyle, handleStateClick])

  // ==================== District Level ====================
  const districtToRegion = useMemo(() => {
    const map = new Map<string, Region>()
    regions.forEach((region) => {
      region.districts.forEach((districtId) => {
        map.set(districtId, region)
      })
    })
    return map
  }, [regions])

  // Helper to get district ID from properties (supports multiple GeoJSON formats)
  // IMPORTANT: Include district name to ensure uniqueness (some dt_codes are reused across districts)
  const getDistrictId = useCallback((props: DistrictProperties): string => {
    // CDN format: use st_code + dt_code + district name for uniqueness
    if (props.dt_code && props.st_code) {
      const districtName = props.district || props.district_name || ''
      // Normalize district name for ID (lowercase, remove spaces)
      const normalizedName = districtName.toLowerCase().replace(/\s+/g, '_')
      return `${props.st_code}_${props.dt_code}_${normalizedName}`
    }
    // All-India format: use objectid or combine statecode + district
    if (props.objectid) return props.objectid
    if (props.statecode && props.district) return `${props.statecode}_${props.district}`
    // Fallback for old AP format
    return props.district_id || props.NEW_DIST || `unknown_${props.district || ''}`
  }, [])

  // Helper to get district name from properties
  const getDistrictNameFromProps = useCallback((props: DistrictProperties): string => {
    return props.district || props.district_name || props.NEW_DIST || 'Unknown'
  }, [])

  const getDistrictName = useCallback(
    (districtId: string): string => {
      // Search through all cached state districts (works for regions from any state)
      for (const [, data] of stateDistrictsCacheRef.current) {
        for (const feature of data.features) {
          const props = feature.properties as DistrictProperties
          const id = getDistrictId(props)
          if (id === districtId) {
            return getDistrictNameFromProps(props)
          }
        }
      }
      // Fallback to ID if not found
      return districtId
    },
    [getDistrictId, getDistrictNameFromProps]
  )

  const toggleDistrictSelection = useCallback(
    (districtId: string) => {
      const existingRegion = districtToRegion.get(districtId)
      if (existingRegion) return

      setCurrentSelection((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(districtId)) {
          newSet.delete(districtId)
        } else {
          newSet.add(districtId)
        }
        return newSet
      })
    },
    [districtToRegion]
  )

  const saveRegion = () => {
    if (currentSelection.size === 0 || !regionName.trim() || !selectedState) return

    const usedColors = regions.map((r) => r.color)
    const newRegion: Region = {
      id: generateId(),
      name: regionName.trim(),
      color: getNextColor(usedColors),
      districts: new Set(currentSelection),
      regionalOfficer: regionalOfficer.trim(),
      intelligentOfficer: intelligentOfficer.trim(),
      state: selectedState,
    }

    setRegions((prev) => [...prev, newRegion])
    clearSelection()
  }

  const deleteRegion = (regionId: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== regionId))
  }

  const updateRegionName = (regionId: string, newName: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, name: newName } : r))
    )
  }

  const updateRegionalOfficer = (regionId: string, officer: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, regionalOfficer: officer } : r))
    )
  }

  const updateIntelligentOfficer = (regionId: string, officer: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, intelligentOfficer: officer } : r))
    )
  }

  const clearSelection = () => {
    setCurrentSelection(new Set())
    setRegionName('')
    setRegionalOfficer('')
    setIntelligentOfficer('')
  }

  const removeFromSelection = (districtId: string) => {
    setCurrentSelection((prev) => {
      const newSet = new Set(prev)
      newSet.delete(districtId)
      return newSet
    })
  }

  const getDistrictStyle = useCallback(
    (districtId: string) => {
      const region = districtToRegion.get(districtId)
      if (region) {
        return {
          fillColor: region.color,
          weight: 2,
          opacity: 1,
          color: darkenColor(region.color, 30),
          fillOpacity: 0.75,
        }
      }

      const isSelected = currentSelection.has(districtId)
      if (isSelected) {
        return {
          fillColor: SELECTION_COLOR,
          weight: 2,
          opacity: 1,
          color: SELECTION_BORDER,
          fillOpacity: 0.75,
        }
      }

      const isHovered = hoveredDistrict === districtId
      if (isHovered) {
        return {
          fillColor: HOVER_FILL,
          weight: 2,
          opacity: 1,
          color: HOVER_BORDER,
          fillOpacity: 0.7,
        }
      }

      return {
        fillColor: DEFAULT_FILL,
        weight: 1,
        opacity: 1,
        color: DEFAULT_BORDER,
        fillOpacity: 0.6,
      }
    },
    [currentSelection, hoveredDistrict, districtToRegion]
  )

  const onEachDistrict = useCallback(
    (feature: Feature, layer: Layer) => {
      const props = feature.properties as DistrictProperties
      const districtId = getDistrictId(props)
      const districtName = getDistrictNameFromProps(props)

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          setHoveredDistrict(districtId)
          const target = e.target
          const region = districtToRegion.get(districtId)
          const isSelected = currentSelection.has(districtId)

          // Add 3D projection CSS class
          const element = target.getElement()
          if (element) {
            element.classList.add('district-selected')
          }

          if (!region && !isSelected) {
            target.setStyle({
              fillColor: HOVER_FILL,
              fillOpacity: 0.7,
            })
          }
          target.bringToFront()
        },
        mouseout: (e: LeafletMouseEvent) => {
          setHoveredDistrict(null)
          const target = e.target
          // Remove 3D projection CSS class
          const element = target.getElement()
          if (element) {
            element.classList.remove('district-selected')
          }
          target.setStyle(getDistrictStyle(districtId))
        },
        click: () => {
          toggleDistrictSelection(districtId)
        },
      })

      // Build tooltip content with district info
      const region = districtToRegion.get(districtId)
      const stateName = props.st_nm || props.statecode || ''
      let tooltipContent = `<div><strong>${districtName}</strong>`
      
      if (stateName) {
        tooltipContent += `<br/><small style="opacity: 0.7">${stateName}</small>`
      }

      if (region) {
        tooltipContent += `<br/><span style="color: ${region.color};">● ${region.name}</span>`
      }

      tooltipContent += '</div>'

      // Tooltip shows on hover (not permanent)
      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        className: 'district-tooltip',
      })
    },
    [currentSelection, getDistrictStyle, toggleDistrictSelection, districtToRegion, getDistrictId, getDistrictNameFromProps]
  )
  
  const allCachedDistricts = useMemo(() => {
    const allFeatures: Feature[] = []
    stateDistrictsCacheRef.current.forEach((data) => {
      allFeatures.push(...data.features)
    })
    if (allFeatures.length === 0) return null
    return { type: 'FeatureCollection' as const, features: allFeatures }
  }, [regions]) // Re-compute when regions change

  // Current state districts for district selection
  const mergedDistrictsData = useMemo(() => {
    return currentStateDistricts
  }, [currentStateDistricts])

  const getSelectedDistrictData = (): DistrictData[] => {
    if (!currentStateDistricts) return []

    const districtData: DistrictData[] = []
    const seenIds = new Set<string>()

    currentStateDistricts.features.forEach((feature) => {
      const props = feature.properties as DistrictProperties
      const districtId = getDistrictId(props)
      const districtName = getDistrictNameFromProps(props)
      const stateName = props.st_nm || props.statecode || selectedState || 'Unknown'

      if (currentSelection.has(districtId) && !seenIds.has(districtId)) {
        districtData.push({ id: districtId, name: districtName, state: stateName })
        seenIds.add(districtId)
      }
    })

    return districtData.sort((a, b) => a.name.localeCompare(b.name))
  }

  const selectedData = getSelectedDistrictData()

  // Show ALL regions in sidebar (not filtered by current state)
  const allRegions = regions

  // Key for GeoJSON re-renders
  const geoJsonKey = useMemo(() => {
    const regionKey = regions
      .map((r) => `${r.id}:${Array.from(r.districts).join(',')}`)
      .join('|')
    return `${selectedState}||${regionKey}`
  }, [regions, selectedState])

  // Style for rendering saved regions on map
  const getRegionOverlayStyle = useCallback((districtId: string) => {
    const region = districtToRegion.get(districtId)
    if (region) {
      return {
        fillColor: region.color,
        fillOpacity: 0.5,
        color: region.color,
        weight: 2,
        opacity: 1,
      }
    }
    return null // Don't render if not in a region
  }, [districtToRegion])

  // Computed values
  const isLoading = !indiaGeoData || (selectedState && !currentStateDistricts && !districtsLoadError)
  const showDistricts = selectedState && currentStateDistricts && !isTransitioning

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('streets') // Default to dark theme

  // Handle back to India
  const handleBackToIndia = useCallback(() => {
    setSelectedState(null)
    setCurrentStateDistricts(null)
    setCurrentSelection(new Set())
    setIsTransitioning(true)
    
    if (mapRef.current) {
      mapRef.current.flyTo(INDIA_CENTER, INDIA_ZOOM, {
        duration: 1.5,
      })
    }
    
    setTimeout(() => setIsTransitioning(false), 1500)
  }, [])

  // Custom zoom handlers
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn(1, { animate: true })
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut(1, { animate: true })
    }
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Fullscreen Map */}
      <div className="absolute inset-0">
        {isLoading && !indiaGeoData ? (
          <div className="flex items-center justify-center h-full bg-slate-900">
            <div className="text-center animate-fade-in">
              <div className="earth-spinner mx-auto mb-4" />
              <p className="text-white/70 text-lg">Loading map data...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={INDIA_CENTER}
            zoom={INDIA_ZOOM}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={true}
          >
            {/* Tile Layer with style toggle - DARK THEMES */}
            {mapStyle === 'satellite' ? (
              // ESRI World Imagery - dark satellite
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              // CartoDB Dark Matter - pure dark map
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
              />
            )}

            {/* Map Controller */}
            <MapController onMapReady={handleMapReady} />

            {/* India States Layer */}
            {indiaGeoData && (
              <GeoJSON
                key={`india-states-${showDistricts ? 'border' : 'selectable'}`}
                data={indiaGeoData}
                style={showDistricts ? {
                  fillColor: 'transparent',
                  fillOpacity: 0,
                  color: 'rgba(255,255,255,0.5)',
                  weight: 2,
                  opacity: 0.7,
                } : getStateStyle}
                onEachFeature={showDistricts ? undefined : onEachState}
              />
            )}

            {/* Districts Layer */}
            {showDistricts && mergedDistrictsData && (
              <GeoJSON
                key={`districts-${geoJsonKey}`}
                data={mergedDistrictsData}
                style={(feature) => {
                  const props = feature?.properties as DistrictProperties
                  const districtId = getDistrictId(props)
                  return getDistrictStyle(districtId)
                }}
                onEachFeature={onEachDistrict}
              />
            )}

            {/* Saved Regions Overlay */}
            {showDistricts && allCachedDistricts && regions.length > 0 && (
              <GeoJSON
                key={`regions-overlay-${geoJsonKey}`}
                data={allCachedDistricts}
                style={(feature) => {
                  const props = feature?.properties as DistrictProperties
                  const districtId = getDistrictId(props)
                  const style = getRegionOverlayStyle(districtId)
                  if (!style) return { fillOpacity: 0, stroke: false }
                  return style
                }}
                onEachFeature={(feature, layer) => {
                  const props = feature.properties as DistrictProperties
                  const districtId = getDistrictId(props)
                  const region = districtToRegion.get(districtId)
                  if (region) {
                    let tooltipContent = `<div style="min-width: 150px;">`
                    tooltipContent += `<strong style="color: ${region.color};">● ${region.name}</strong>`
                    tooltipContent += `<br/><small style="opacity: 0.7;">State: ${region.state}</small>`
                    tooltipContent += `<br/><small>${region.districts.size} district${region.districts.size !== 1 ? 's' : ''}</small>`
                    if (region.regionalOfficer) tooltipContent += `<br/><small>Regional Officer: ${region.regionalOfficer}</small>`
                    if (region.intelligentOfficer) tooltipContent += `<br/><small>Intelligent Officer: ${region.intelligentOfficer}</small>`
                    tooltipContent += '</div>'
                    layer.bindTooltip(tooltipContent, { permanent: false, direction: 'top', className: 'earth-tooltip' })
                  }
                }}
              />
            )}
          </MapContainer>
        )}
      </div>

      {/* Top Left - Location Breadcrumb */}
      <div className="absolute top-4 left-4 z-[1000] animate-slide-in-left">
        <div className="location-breadcrumb">
          <div 
            className="location-breadcrumb-item"
            onClick={handleBackToIndia}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>India</span>
          </div>
          {selectedState && (
            <>
              <span className="location-breadcrumb-separator">›</span>
              <div className="location-breadcrumb-item">
                <span className="text-green-400">{selectedState}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Right - Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 animate-slide-in-right">
        {/* Zoom Controls */}
        <button onClick={handleZoomIn} className="map-control-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut} className="map-control-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div className="w-full h-px bg-white/20" />
        {/* Map Style Toggle */}
        <button 
          onClick={() => setMapStyle(s => s === 'satellite' ? 'streets' : 'satellite')} 
          className="map-control-btn"
          title={mapStyle === 'satellite' ? 'Switch to Streets' : 'Switch to Satellite'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </button>
        {/* Toggle Sidebar */}
        <button 
          onClick={() => setSidebarOpen(s => !s)} 
          className="map-control-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
        </button>
      </div>

      {/* Bottom Left - Selection Badge (when items selected) */}
      {currentSelection.size > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] animate-slide-in-up">
          <div className="selection-badge animate-pulse-glow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{currentSelection.size} district{currentSelection.size !== 1 ? 's' : ''} selected</span>
          </div>
        </div>
      )}

      {/* Right Sidebar - Floating Panel */}
      <div 
        className={`absolute top-4 bottom-4 right-16 w-96 z-[1000] transition-all duration-500 ease-out ${
          sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
        }`}
      >
        <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-5 border-b border-white/10">
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              Region Manager
            </h1>
            <p className="text-white/60 text-sm mt-2">
              {selectedState ? `Creating regions in ${selectedState}` : 'Select a state to begin'}
            </p>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-auto p-5 space-y-5 region-panel">
            {!selectedState ? (
              /* No state selected */
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-20 h-20 mb-5 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center animate-float">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-400">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Select a State</h3>
                <p className="text-white/60 text-sm max-w-xs mb-5">
                  Click on any <span className="text-green-400 font-medium">highlighted state</span> on the map to zoom in and create regions
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span>States with district data</span>
                </div>
              </div>
            ) : (
              <>
                {/* New Region Form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    New Region
                  </h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={regionName}
                      onChange={(e) => setRegionName(e.target.value)}
                      placeholder="Region name..."
                      className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                    <input
                      type="text"
                      value={regionalOfficer}
                      onChange={(e) => setRegionalOfficer(e.target.value)}
                      placeholder="Regional Officer..."
                      className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                    <input
                      type="text"
                      value={intelligentOfficer}
                      onChange={(e) => setIntelligentOfficer(e.target.value)}
                      placeholder="Intelligent Officer..."
                      className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>

                  {/* Selected Districts Preview */}
                  {selectedData.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl">
                      {selectedData.slice(0, 5).map((d) => (
                        <span 
                          key={d.id} 
                          className="px-3 py-1 text-xs bg-purple-500/30 text-purple-200 rounded-full cursor-pointer hover:bg-red-500/30 transition-colors"
                          onClick={() => removeFromSelection(d.id)}
                        >
                          {d.name} ×
                        </span>
                      ))}
                      {selectedData.length > 5 && (
                        <span className="px-3 py-1 text-xs text-white/50">
                          +{selectedData.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={clearSelection}
                      className="flex-1 px-4 py-3 text-sm bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={saveRegion}
                      disabled={!regionName.trim() || currentSelection.size === 0}
                      className="flex-1 quick-action-btn disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Region
                    </button>
                  </div>
                </div>

                {/* Saved Regions */}
                {allRegions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white">
                      Saved Regions ({allRegions.length})
                    </h3>
                    <div className="space-y-2">
                      {allRegions.map((region) => (
                        <div 
                          key={region.id}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: region.color }} />
                              <span className="font-medium text-white">{region.name}</span>
                            </div>
                            <button
                              onClick={() => deleteRegion(region.id)}
                              className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                          <div className="text-xs text-white/50 space-y-1">
                            <p>{region.state} • {region.districts.size} districts</p>
                            {region.regionalOfficer && <p>RO: {region.regionalOfficer}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Panel Footer - Legend */}
          <div className="p-4 border-t border-white/10">
            <div className="flex flex-wrap gap-3 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(districtsLoading || isTransitioning) && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <div className="earth-spinner mx-auto mb-4" />
            <p className="text-white font-medium">
              {isTransitioning 
                ? selectedState ? `Flying to ${selectedState}...` : 'Flying to India...'
                : 'Loading districts...'}
            </p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {districtsLoadError && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel rounded-2xl p-8 text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-white font-medium mb-2">Failed to load districts</p>
            <p className="text-white/60 text-sm mb-4">{districtsLoadError}</p>
            <button
              onClick={() => {
                setDistrictsLoadError(null)
                if (selectedState) loadStateDistricts(selectedState)
              }}
              className="quick-action-btn"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegionSelectionPage
