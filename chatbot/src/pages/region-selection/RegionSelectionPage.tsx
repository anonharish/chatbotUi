import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet'
import type { FeatureCollection, Feature } from 'geojson'
import type { Layer, LeafletMouseEvent, Map as LeafletMap } from 'leaflet'
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

// Andhra Pradesh center and bounds
const AP_CENTER: [number, number] = [15.9129, 79.74]
const AP_ZOOM = 7

// India States GeoJSON URL (from a public CDN)
const INDIA_STATES_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'

// Map controller component for smooth animations
const MapController = ({ 
  selectedState, 
  onMapReady 
}: { 
  selectedState: string | null
  onMapReady: (map: LeafletMap) => void 
}) => {
  const map = useMap()

  useEffect(() => {
    onMapReady(map)
  }, [map, onMapReady])

  useEffect(() => {
    if (selectedState === 'Andhra Pradesh') {
      // Smooth fly to Andhra Pradesh
      map.flyTo(AP_CENTER, AP_ZOOM, {
        duration: 2,
        easeLinearity: 0.25,
      })
    } else if (selectedState === null) {
      // Fly back to India view
      map.flyTo(INDIA_CENTER, INDIA_ZOOM, {
        duration: 2,
        easeLinearity: 0.25,
      })
    }
  }, [selectedState, map])

  return null
}

const RegionSelectionPage = () => {
  // Map and view state
  const [indiaGeoData, setIndiaGeoData] = useState<FeatureCollection | null>(null)
  const [apDistrictsData, setApDistrictsData] = useState<FeatureCollection | null>(null)
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

  // Load AP districts when state is selected
  useEffect(() => {
    if (selectedState === 'Andhra Pradesh') {
      fetch('/AndhraPradesh_Districts.geojson')
        .then((response) => response.json())
        .then((data: FeatureCollection) => setApDistrictsData(data))
        .catch((error) => console.error('Error loading AP districts:', error))
    }
  }, [selectedState])

  // Handle state click
  const handleStateClick = useCallback((stateName: string) => {
    if (stateName === 'Andhra Pradesh') {
      setIsTransitioning(true)
      setSelectedState(stateName)
      // Allow transition to complete before showing districts
      setTimeout(() => setIsTransitioning(false), 2000)
    }
  }, [])

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
    const isAP = stateName === 'Andhra Pradesh'

    if (isAP) {
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

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setHoveredState(stateName)
        const target = e.target
        if (stateName === 'Andhra Pradesh') {
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
    const isAP = stateName === 'Andhra Pradesh'
    const tooltipContent = isAP
      ? `<div><strong>${stateName}</strong><br/><span class="text-xs text-green-600">Click to explore districts</span></div>`
      : `<strong>${stateName}</strong>`

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'center',
      className: 'state-tooltip',
    })
  }, [getStateStyle, handleStateClick])

  // ==================== District Level (existing logic) ====================
  const districtToRegion = useMemo(() => {
    const map = new Map<string, Region>()
    regions.forEach((region) => {
      region.districts.forEach((districtId) => {
        map.set(districtId, region)
      })
    })
    return map
  }, [regions])

  const getDistrictName = useCallback(
    (districtId: string): string => {
      if (!apDistrictsData) return districtId
      for (const feature of apDistrictsData.features) {
        const props = feature.properties as DistrictProperties
        const id = props.district_id || props.NEW_DIST
        if (id === districtId) {
          return props.district_name || props.NEW_DIST
        }
      }
      return districtId
    },
    [apDistrictsData]
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
    if (currentSelection.size === 0 || !regionName.trim()) return

    const usedColors = regions.map((r) => r.color)
    const newRegion: Region = {
      id: generateId(),
      name: regionName.trim(),
      color: getNextColor(usedColors),
      districts: new Set(currentSelection),
      regionalOfficer: regionalOfficer.trim(),
      intelligentOfficer: intelligentOfficer.trim(),
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
      const districtId = props.district_id || props.NEW_DIST
      const districtName = props.district_name || props.NEW_DIST

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
    [currentSelection, getDistrictStyle, toggleDistrictSelection, districtToRegion]
  )

  const getSelectedDistrictData = (): DistrictData[] => {
    if (!apDistrictsData) return []

    const districtData: DistrictData[] = []
    const seenIds = new Set<string>()

    apDistrictsData.features.forEach((feature) => {
      const props = feature.properties as DistrictProperties
      const districtId = props.district_id || props.NEW_DIST
      const districtName = props.district_name || props.NEW_DIST

      if (currentSelection.has(districtId) && !seenIds.has(districtId)) {
        districtData.push({ id: districtId, name: districtName })
        seenIds.add(districtId)
      }
    })

    return districtData.sort((a, b) => a.name.localeCompare(b.name))
  }

  const selectedData = getSelectedDistrictData()

  const geoJsonKey = useMemo(() => {
    const regionKey = regions
      .map((r) => `${r.id}:${Array.from(r.districts).join(',')}`)
      .join('|')
    const selectionKey = Array.from(currentSelection).join(',')
    return `${regionKey}||${selectionKey}`
  }, [regions, currentSelection])

  const isLoading = !indiaGeoData || (selectedState === 'Andhra Pradesh' && !apDistrictsData)
  const showDistricts = selectedState === 'Andhra Pradesh' && apDistrictsData && !isTransitioning

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
                  ? 'Click on districts to select. Hover to see region info.'
                  : 'Click on Andhra Pradesh to explore districts'}
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
              <MapController selectedState={selectedState} onMapReady={handleMapReady} />

              {/* India States Layer (shown when no state selected or transitioning) */}
              {indiaGeoData && !showDistricts && (
                <GeoJSON
                  key="india-states"
                  data={indiaGeoData}
                  style={getStateStyle}
                  onEachFeature={onEachState}
                />
              )}

              {/* AP Districts Layer (shown when AP is selected and not transitioning) */}
              {showDistricts && apDistrictsData && (
                <GeoJSON
                  key={`ap-districts-${geoJsonKey}`}
                  data={apDistrictsData}
                  style={(feature) => {
                    const props = feature?.properties as DistrictProperties
                    const districtId = props?.district_id || props?.NEW_DIST
                    return getDistrictStyle(districtId)
                  }}
                  onEachFeature={onEachDistrict}
                />
              )}
            </MapContainer>
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
                  <span>Other States</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4ade80' }} />
                  <span>Andhra Pradesh (Click to explore)</span>
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
                {regions.map((region) => (
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
              : 'Select Andhra Pradesh to start creating regions'}
          </p>
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
                Click on <span className="text-green-600 font-medium">Andhra Pradesh</span> on the map to zoom in and start creating regions
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded bg-green-400" />
                <span>Andhra Pradesh is highlighted in green</span>
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

              {/* Saved Regions Section */}
              {regions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Saved Regions ({regions.length})</h3>

                  <div className="space-y-3">
                    {regions.map((region) => (
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
              {regions.length === 0 && selectedData.length === 0 && (
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
