import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import type { FeatureCollection, Feature } from 'geojson'
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
  getStateDistrictsCdnUrl,
} from './constants'
import { GlobeVisualization } from './components/GlobeVisualization' // Import the new component
import './styles.css'

// Types for state properties
// interface StateProperties {
//   name: string
//   state_code?: string
//   ST_NM?: string
// }

import type { Region, DistrictData, DistrictProperties } from './types'

// India States GeoJSON URL
const INDIA_STATES_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'

// Cache for loaded state districts GeoJSON
type StateDistrictsCache = Map<string, FeatureCollection>

export const RegionSelectionFeature = () => {
  // Map and view state
  const [indiaGeoData, setIndiaGeoData] = useState<FeatureCollection | null>(null)

  // Cache for loaded state districts
  const stateDistrictsCacheRef = useRef<StateDistrictsCache>(new Map())
  const [currentStateDistricts, setCurrentStateDistricts] = useState<FeatureCollection | null>(null)
  const [districtsLoading, setDistrictsLoading] = useState(false)
  const [districtsLoadError, setDistrictsLoadError] = useState<string | null>(null)

  // Single state selection
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Region management state
  const [regions, setRegions] = useState<Region[]>([])
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set())
  const [regionName, setRegionName] = useState('')
  const [regionalOfficer, setRegionalOfficer] = useState('')
  const [intelligentOfficer, setIntelligentOfficer] = useState('')
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  // Load India states GeoJSON
  useEffect(() => {
    fetch(INDIA_STATES_URL)
      .then((response) => response.json())
      .then((data: FeatureCollection) => setIndiaGeoData(data))
      .catch((error) => console.error('Error loading India GeoJSON:', error))
  }, [])

  // Load districts for a specific state
  const loadStateDistricts = useCallback((stateName: string) => {
    const cached = stateDistrictsCacheRef.current.get(stateName)
    if (cached) {
      setCurrentStateDistricts(cached)
      return
    }

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
    if (!STATE_CDN_SLUG_MAP[stateName]) {
      console.warn(`No CDN mapping found for: ${stateName}`)
      return
    }

    setSelectedState(stateName)
    setIsTransitioning(true)
    setCurrentSelection(new Set())
    setSidebarOpen(true) // specific change: open sidebar
    loadStateDistricts(stateName)

    // Globe component handles flying/zooming based on state change automatically (or we can trigger it)
    setTimeout(() => setIsTransitioning(false), 1000)
  }, [loadStateDistricts])

  // ==================== District Logic ====================
  const districtToRegion = useMemo(() => {
    const map = new Map<string, Region>()
    regions.forEach((region) => {
      region.districts.forEach((districtId) => {
        map.set(districtId, region)
      })
    })
    return map
  }, [regions])

  const getDistrictId = useCallback((props: DistrictProperties): string => {
    if (props.dt_code && props.st_code) {
      const districtName = props.district || props.district_name || ''
      const normalizedName = districtName.toLowerCase().replace(/\s+/g, '_')
      return `${props.st_code}_${props.dt_code}_${normalizedName}`
    }
    if (props.objectid) return props.objectid
    if (props.statecode && props.district) return `${props.statecode}_${props.district}`
    return props.district_id || props.NEW_DIST || `unknown_${props.district || ''}`
  }, [])

  const getDistrictNameFromProps = useCallback((props: DistrictProperties): string => {
    return props.district || props.district_name || props.NEW_DIST || 'Unknown'
  }, [])

  // Prepare Districts Data with Unique IDs for Globe
  const globeDistrictsData = useMemo(() => {
    if (!currentStateDistricts) return null;

    const featuresWithIds = currentStateDistricts.features.map(f => {
      const props = f.properties as DistrictProperties;
      const id = getDistrictId(props);
      return {
        ...f,
        properties: {
          ...props,
          uniqueId: id
        }
      }
    });

    return { ...currentStateDistricts, features: featuresWithIds } as FeatureCollection;
  }, [currentStateDistricts, getDistrictId]);

  // Combined Saved Region Districts (for displaying regions from other states)
  const regionDistrictsData = useMemo(() => {
    const features: Feature[] = []

    // Iterate over all regions
    regions.forEach(region => {
      const stateName = region.state
      // Get state data from cache
      const stateData = stateDistrictsCacheRef.current.get(stateName)

      if (stateData) {
        // Find features for this region's districts
        const regionFeatures = stateData.features.filter(f => {
          const props = f.properties as DistrictProperties
          const id = getDistrictId(props)
          return region.districts.has(id)
        })

        // Add uniqueId and region color
        const styledFeatures = regionFeatures.map(f => ({
          ...f,
          properties: {
            ...f.properties,
            uniqueId: getDistrictId(f.properties as DistrictProperties),
            regionColor: region.color,
            isRegion: true
          }
        }))

        features.push(...styledFeatures)
      }
    })

    return { type: 'FeatureCollection', features } as FeatureCollection
  }, [regions, getDistrictId]) // stateDistrictsCacheRef is stable match

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

  const getDistrictStyle = useCallback(
    (districtId: string) => {
      const region = districtToRegion.get(districtId)
      if (region) {
        return {
          fillColor: region.color,
          color: darkenColor(region.color, 30),
          fillOpacity: 0.75,
        }
      }

      const isSelected = currentSelection.has(districtId)
      if (isSelected) {
        return {
          fillColor: SELECTION_COLOR,
          color: SELECTION_BORDER,
          fillOpacity: 0.75,
        }
      }

      const isHovered = hoveredDistrict === districtId
      if (isHovered) {
        return {
          fillColor: HOVER_FILL,
          color: HOVER_BORDER,
          fillOpacity: 0.7,
        }
      }

      return {
        fillColor: DEFAULT_FILL,
        color: DEFAULT_BORDER,
        fillOpacity: 0.6,
      }
    },
    [currentSelection, hoveredDistrict, districtToRegion]
  )

  // Handle back to India
  const handleBackToIndia = useCallback(() => {
    setSelectedState(null)
    setCurrentStateDistricts(null)
    setCurrentSelection(new Set())
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 1500)
  }, [])

  // ==================== Sidebar Logic (Restored) ====================
  const clearSelection = () => {
    setCurrentSelection(new Set())
    setRegionName('')
    setRegionalOfficer('')
    setIntelligentOfficer('')
  }

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

  const removeFromSelection = (districtId: string) => {
    setCurrentSelection((prev) => {
      const newSet = new Set(prev)
      newSet.delete(districtId)
      return newSet
    })
  }

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
  const allRegions = regions

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-black">
      {/* 3D Globe Visualization */}
      <GlobeVisualization
        indiaGeoData={indiaGeoData}
        currentStateDistricts={globeDistrictsData}
        selectedState={selectedState}
        hoveredState={hoveredState}
        hoveredDistrict={hoveredDistrict}
        onStateClick={handleStateClick}
        onDistrictClick={(id) => {
          // The ID passed from Globe is constructed from properties.
          // We need to ensure it matches what toggleDistrictSelection expects.
          // Our toggleDistrictSelection works with the string ID.
          toggleDistrictSelection(id)
        }}
        onStateHover={setHoveredState}
        onDistrictHover={setHoveredDistrict}
        getDistrictStyle={getDistrictStyle}
        regionDistricts={regionDistrictsData}
      />

      {/* Region Manager Toggle - Visible when sidebar is closed */}
      {!sidebarOpen && selectedState && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-20 right-6 z-[1000] flex items-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all animate-fade-in shadow-lg shadow-black/50 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs text-white/60">Region Manager</span>
            <span className="block text-sm font-bold">Open Panel</span>
          </div>
        </button>
      )}

      {/* Top Left - Location Breadcrumb */}
      <div className="absolute top-4 left-4 z-[1000] animate-slide-in-left">
        <div className="location-breadcrumb flex items-center gap-2 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 text-white">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
            onClick={handleBackToIndia}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="font-semibold">India</span>
          </div>
          {selectedState && (
            <>
              <span className="text-white/30">›</span>
              <div className="px-3 py-1">
                <span className="text-cyan-400 font-bold">{selectedState}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selection Badge */}
      {currentSelection.size > 0 && (
        <div className="absolute bottom-6 left-6 z-[1000] animate-slide-in-up">
          <div className="flex items-center gap-2 bg-cyan-900/80 text-cyan-100 px-4 py-2 rounded-lg border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-bold">{currentSelection.size} district{currentSelection.size !== 1 ? 's' : ''} selected</span>
          </div>
        </div>
      )}


      {/* Right Sidebar - Floating Panel */}
      <div
        className={`absolute top-4 bottom-4 right-16 w-96 z-[1000] transition-all duration-500 ease-out ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
          }`}
      >
        <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-5 border-b border-white/10 relative">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                Region Manager
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-white/60 text-sm mt-3 ml-1">
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


