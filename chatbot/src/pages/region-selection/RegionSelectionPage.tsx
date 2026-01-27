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

// Map controller component for smooth animations
const MapController = ({ 
  selectedState,
  statesGeoData,
  onMapReady 
}: { 
  selectedState: string | null
  statesGeoData: FeatureCollection | null
  onMapReady: (map: LeafletMap) => void 
}) => {
  const map = useMap()

  useEffect(() => {
    onMapReady(map)
  }, [map, onMapReady])

  useEffect(() => {
    if (selectedState && statesGeoData) {
      // Find the state feature and get its bounds
      const stateFeature = statesGeoData.features.find((f) => {
        const props = f.properties as StateProperties
        return (props.ST_NM || props.name) === selectedState
      })
      
      if (stateFeature) {
        const bounds = getBoundsFromFeature(stateFeature)
        if (bounds) {
          map.flyToBounds(bounds, {
            duration: 2,
            padding: [20, 20],
          })
          return
        }
      }
    } else if (selectedState === null) {
      // Fly back to India view
      map.flyTo(INDIA_CENTER, INDIA_ZOOM, {
        duration: 2,
        easeLinearity: 0.25,
      })
    }
  }, [selectedState, statesGeoData, map])

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

  // Handle state click
  const handleStateClick = useCallback((stateName: string) => {
    // Check if we have CDN mapping for this state
    if (!STATE_CDN_SLUG_MAP[stateName]) {
      console.warn(`No CDN mapping found for: ${stateName}`)
      return
    }
    
    setIsTransitioning(true)
    setSelectedState(stateName)
    loadStateDistricts(stateName)
    // Allow transition to complete before showing districts
    setTimeout(() => setIsTransitioning(false), 2000)
  }, [loadStateDistricts])

  // Handle back to India view
  const handleBackToIndia = useCallback(() => {
    setIsTransitioning(true)
    setSelectedState(null)
    setCurrentSelection(new Set())
    setTimeout(() => setIsTransitioning(false), 2000)
  }, [])

  // Map ready callback
  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map
  }, [])

  // ==================== State Level Styling ====================
  const getStateStyle = useCallback((feature: Feature | undefined) => {
    const props = feature?.properties as StateProperties
    const stateName = props?.ST_NM || props?.name || ''
    const isHovered = hoveredState === stateName
    const hasStateCode = STATE_NAME_TO_CODE[stateName] !== undefined

    if (hasStateCode) {
      return {
        fillColor: isHovered ? '#22c55e' : '#4ade80',
        weight: isHovered ? 3 : 2,
        opacity: 1,
        color: '#15803d',
        fillOpacity: isHovered ? 0.7 : 0.5,
      }
    }

    return {
      fillColor: isHovered ? '#60a5fa' : '#94a3b8',
      weight: isHovered ? 2 : 1,
      opacity: 0.8,
      color: '#475569',
      fillOpacity: isHovered ? 0.5 : 0.3,
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
        if (hasStateCode) {
          target.setStyle({
            fillColor: '#22c55e',
            fillOpacity: 0.7,
            weight: 3,
          })
        } else {
          target.setStyle({
            fillColor: '#60a5fa',
            fillOpacity: 0.5,
            weight: 2,
          })
        }
        target.bringToFront()
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredState(null)
        const target = e.target
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
  const getDistrictId = useCallback((props: DistrictProperties): string => {
    // CDN format: use dt_code + st_code
    if (props.dt_code && props.st_code) return `${props.st_code}_${props.dt_code}`
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
      if (!currentStateDistricts) return districtId
      for (const feature of currentStateDistricts.features) {
        const props = feature.properties as DistrictProperties
        const id = getDistrictId(props)
        if (id === districtId) {
          return getDistrictNameFromProps(props)
        }
      }
      return districtId
    },
    [currentStateDistricts, getDistrictId, getDistrictNameFromProps]
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
          target.setStyle(getDistrictStyle(districtId))
        },
        click: () => {
          toggleDistrictSelection(districtId)
        },
      })

      const region = districtToRegion.get(districtId)
      let tooltipContent = `<div><strong>${districtName}</strong>`
      
      if (selectedState) {
        tooltipContent += `<br/><small class="text-muted-foreground">${selectedState}</small>`
      }

      if (region) {
        tooltipContent += `<br/><span style="color: ${region.color};">● Region: ${region.name}</span>`
        if (region.regionalOfficer) {
          tooltipContent += `<br/><small>Regional Officer: ${region.regionalOfficer}</small>`
        }
        if (region.intelligentOfficer) {
          tooltipContent += `<br/><small>Intelligent Officer: ${region.intelligentOfficer}</small>`
        }
      }

      tooltipContent += '</div>'

      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'center',
        className: 'district-tooltip',
      })
    },
    [currentSelection, getDistrictStyle, toggleDistrictSelection, districtToRegion, getDistrictId, getDistrictNameFromProps, selectedState]
  )

  const getSelectedDistrictData = (): DistrictData[] => {
    if (!currentStateDistricts) return []

    const districtData: DistrictData[] = []
    const seenIds = new Set<string>()

    currentStateDistricts.features.forEach((feature) => {
      const props = feature.properties as DistrictProperties
      const districtId = getDistrictId(props)
      const districtName = getDistrictNameFromProps(props)

      if (currentSelection.has(districtId) && !seenIds.has(districtId)) {
        districtData.push({ id: districtId, name: districtName, state: selectedState || undefined })
        seenIds.add(districtId)
      }
    })

    return districtData.sort((a, b) => a.name.localeCompare(b.name))
  }

  const selectedData = getSelectedDistrictData()

  // Filter regions for current state
  const currentStateRegions = useMemo(() => {
    if (!selectedState) return []
    return regions.filter((r) => r.state === selectedState)
  }, [regions, selectedState])

  // Key for GeoJSON re-renders - exclude currentSelection to prevent full re-renders on each click
  const geoJsonKey = useMemo(() => {
    const regionKey = regions
      .map((r) => `${r.id}:${Array.from(r.districts).join(',')}`)
      .join('|')
    return `${selectedState}||${regionKey}`
  }, [regions, selectedState])

  const isLoading = !indiaGeoData || (selectedState && !currentStateDistricts && !districtsLoadError)
  const showDistricts = selectedState && currentStateDistricts && !isTransitioning

  return (
    <div className="flex h-screen bg-background">
      {/* Left Side - Map (60%) */}
      <div className="w-[60%] flex flex-col border-r">
        {/* Map Header */}
        <div className="p-3 border-b bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedState ? `${selectedState} Districts` : 'India - Select a State'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedState
                  ? `Click on districts to select. ${currentStateDistricts?.features.length || 0} districts available.`
                  : 'Click on any highlighted state to explore its districts'}
              </p>
            </div>
            {selectedState && (
              <button
                onClick={handleBackToIndia}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to India
              </button>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading && !indiaGeoData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Loading map data...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={INDIA_CENTER}
              zoom={INDIA_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              {/* Satellite Tile Layer */}
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />

              {/* Map Controller for animations */}
              <MapController 
                selectedState={selectedState} 
                statesGeoData={indiaGeoData}
                onMapReady={handleMapReady} 
              />

              {/* India States Layer (shown when no state selected or transitioning) */}
              {indiaGeoData && !showDistricts && (
                <GeoJSON
                  key="india-states"
                  data={indiaGeoData}
                  style={getStateStyle}
                  onEachFeature={onEachState}
                />
              )}

              {/* Districts Layer (shown when state is selected and not transitioning) */}
              {showDistricts && currentStateDistricts && (
                <GeoJSON
                  key={`districts-${geoJsonKey}`}
                  data={currentStateDistricts}
                  style={(feature) => {
                    const props = feature?.properties as DistrictProperties
                    const districtId = getDistrictId(props)
                    return getDistrictStyle(districtId)
                  }}
                  onEachFeature={onEachDistrict}
                />
              )}
            </MapContainer>
          )}

          {/* Loading overlay for districts */}
          {districtsLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-[1000]">
              <div className="bg-card p-4 rounded-lg shadow-lg text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-sm font-medium">Loading districts data...</p>
                <p className="text-xs text-muted-foreground">This may take a moment (74MB file)</p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {districtsLoadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-[1000]">
              <div className="bg-card p-4 rounded-lg shadow-lg text-center max-w-sm">
                <p className="text-sm font-medium text-red-600 mb-2">Failed to load districts</p>
                <p className="text-xs text-muted-foreground mb-3">{districtsLoadError}</p>
                <button
                  onClick={() => {
                    setDistrictsLoadError(null)
                    if (selectedState) loadStateDistricts(selectedState)
                  }}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Transition Overlay */}
          {isTransitioning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-[1000]">
              <div className="bg-card p-4 rounded-lg shadow-lg text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {selectedState ? `Flying to ${selectedState}...` : 'Returning to India...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-3 border-t bg-card">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {!selectedState ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#94a3b8' }} />
                  <span>States (no district data)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4ade80' }} />
                  <span>States with districts (Click to explore)</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: DEFAULT_FILL }} />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: SELECTION_COLOR }} />
                  <span>Current Selection</span>
                </div>
                {currentStateRegions.map((region) => (
                  <div key={region.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: region.color }} />
                    <span>{region.name}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Selection Panel (40%) */}
      <div className="w-[40%] flex flex-col bg-card">
        {/* Panel Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Region Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedState
              ? `Create and manage regions in ${selectedState}`
              : 'Select a state to start creating regions'}
          </p>
          {regions.length > 0 && !selectedState && (
            <p className="text-xs text-muted-foreground mt-2">
              Total regions created: {regions.length} across {new Set(regions.map(r => r.state)).size} state(s)
            </p>
          )}
        </div>

        {/* Selection Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {!selectedState ? (
            // No state selected - show instructions
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-green-600 dark:text-green-400"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Select a State</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Click on any <span className="text-green-600 font-medium">green highlighted state</span> on the map to zoom in and start creating regions
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded bg-green-400" />
                <span>States with district data available</span>
              </div>
            </div>
          ) : (
            <>
              {/* Current Selection Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SELECTION_COLOR }} />
                  New Region Selection
                </h3>

                <RegionForm
                  selectedDistricts={selectedData}
                  regionName={regionName}
                  regionalOfficer={regionalOfficer}
                  intelligentOfficer={intelligentOfficer}
                  onRegionNameChange={setRegionName}
                  onRegionalOfficerChange={setRegionalOfficer}
                  onIntelligentOfficerChange={setIntelligentOfficer}
                  onRemoveDistrict={removeFromSelection}
                  onClear={clearSelection}
                  onSave={saveRegion}
                />
              </div>

              {/* Saved Regions Section (current state only) */}
              {currentStateRegions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Saved Regions in {selectedState} ({currentStateRegions.length})
                  </h3>

                  <div className="space-y-3">
                    {currentStateRegions.map((region) => (
                      <RegionCard
                        key={region.id}
                        region={region}
                        getDistrictName={getDistrictName}
                        onDelete={deleteRegion}
                        onUpdateName={updateRegionName}
                        onUpdateRegionalOfficer={updateRegionalOfficer}
                        onUpdateIntelligentOfficer={updateIntelligentOfficer}
                        isEditing={editingRegionId === region.id}
                        onEditStart={setEditingRegionId}
                        onEditEnd={() => setEditingRegionId(null)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {currentStateRegions.length === 0 && selectedData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-muted-foreground"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">No Regions Created</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Select districts from the map, name your region, assign officers, and save
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegionSelectionPage
