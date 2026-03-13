import { useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { MapboxVisualization } from './components/MapboxVisualization'
import { IntelFeedView } from './components/IntelFeedView'
import type { Region, DistrictInfo } from './types'
import { generateId, getNextColor, createDistrictKey, parseDistrictKey } from './types'

export const MapboxRegionSelectionFeature = () => {
  // State management
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [focusedRegionId, setFocusedRegionId] = useState<string | null>(null)
  // Use string composite keys: "stateName_featureId"
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set())
  const [districtInfoMap, setDistrictInfoMap] = useState<Map<string, DistrictInfo>>(new Map())

  // Form state
  const [regionName, setRegionName] = useState('')
  const [regionalOfficer, setRegionalOfficer] = useState('')
  const [intelligentOfficer, setIntelligentOfficer] = useState('')

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
  const navigate = useNavigate()

  // Ref for getting district features from map (accepts numeric feature IDs)
  const getDistrictFeaturesRef = useRef<((ids: Set<number>) => GeoJSON.Feature[]) | null>(null)

  // Build a map of composite districtKey to region for quick lookup
  const districtToRegion = useMemo(() => {
    const map = new Map<string, Region>()
    regions.forEach(region => {
      region.districtIds.forEach(key => {
        map.set(key, region)
      })
    })
    return map
  }, [regions])

  // Handle state click
  const handleStateClick = useCallback((stateName: string) => {
    setSelectedState(stateName)
    setCurrentSelection(new Set())
    setDistrictInfoMap(new Map())
    setSidebarOpen(true)
  }, [])

  // Handle district click - toggle selection
  const handleDistrictClick = useCallback((districtId: number, districtName: string, stateName: string) => {
    // Create composite key for unique identification
    const districtKey = createDistrictKey(stateName, districtId)

    // Check if already in a region
    if (districtToRegion.has(districtKey)) {
      return
    }

    setCurrentSelection(prev => {
      const newSet = new Set(prev)
      if (newSet.has(districtKey)) {
        newSet.delete(districtKey)
      } else {
        newSet.add(districtKey)
        // Store district info for display
        setDistrictInfoMap(prevMap => {
          const newMap = new Map(prevMap)
          newMap.set(districtKey, { id: districtKey, featureId: districtId, name: districtName, state: stateName })
          return newMap
        })
      }
      return newSet
    })
  }, [districtToRegion])

  // Get selected district data for display
  const selectedDistrictsData = useMemo(() => {
    return Array.from(currentSelection).map(key => {
      const info = districtInfoMap.get(key)
      const parsed = parseDistrictKey(key)
      return info || { id: key, featureId: parsed?.featureId || 0, name: `District ${parsed?.featureId}`, state: parsed?.state || selectedState || '' }
    })
  }, [currentSelection, districtInfoMap, selectedState])

  // Clear selection
  const clearSelection = useCallback(() => {
    setCurrentSelection(new Set())
    setRegionName('')
    setRegionalOfficer('')
    setIntelligentOfficer('')
  }, [])

  // Save region
  const saveRegion = useCallback(() => {
    if (currentSelection.size === 0 || !regionName.trim() || !selectedState) return

    const usedColors = regions.map(r => r.color)
    // Get district geometries for persistent rendering
    // Extract numeric feature IDs for the current state only
    const featureIds = new Set<number>()
    currentSelection.forEach(key => {
      const parsed = parseDistrictKey(key)
      if (parsed && parsed.state === selectedState) {
        featureIds.add(parsed.featureId)
      }
    })
    const geometry = getDistrictFeaturesRef.current?.(featureIds) || []

    const newRegion: Region = {
      id: generateId(),
      name: regionName.trim(),
      color: getNextColor(usedColors),
      districtIds: new Set(currentSelection),
      districtNames: selectedDistrictsData.map(d => d.name),
      regionalOfficer: regionalOfficer.trim(),
      intelligentOfficer: intelligentOfficer.trim(),
      state: selectedState,
      geometry: geometry,
    }

    setRegions(prev => [...prev, newRegion])
    clearSelection()
  }, [currentSelection, regionName, regionalOfficer, intelligentOfficer, selectedState, regions, selectedDistrictsData, clearSelection])

  // Delete region
  const deleteRegion = useCallback((regionId: string) => {
    setRegions(prev => prev.filter(r => r.id !== regionId))
  }, [])

  // Remove district from selection
  const removeFromSelection = useCallback((districtKey: string) => {
    setCurrentSelection(prev => {
      const newSet = new Set(prev)
      newSet.delete(districtKey)
      return newSet
    })
  }, [])

  // Back to India view
  const handleBackToIndia = useCallback(() => {
    setSelectedState(null)
    setCurrentSelection(new Set())
    setDistrictInfoMap(new Map())
    setFocusedRegionId(null)
  }, [])

  const handleRegionClick = useCallback((regionId: string) => {
    setFocusedRegionId(regionId)
  }, [])

  const focusedRegion = regions.find(r => r.id === focusedRegionId) ?? null

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 50%),
          radial-gradient(1px 1px at 20% 30%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 40% 70%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 50% 50%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 80% 20%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 10% 80%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 70% 60%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 30% 10%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 90% 90%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 60% 40%, #fff 0.5px, transparent 0)
        `,
        backgroundSize: '100% 100%',
      }}
    >
      {/* Globe glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.05) 30%, transparent 60%)',
        }}
      />

      {/* Map Visualization */}
      <MapboxVisualization
        onStateClick={handleStateClick}
        onDistrictClick={handleDistrictClick}
        onDistrictHover={setHoveredDistrict}
        onRegionClick={handleRegionClick}
        regions={regions}
        currentSelection={currentSelection}
        onRegisterGetFeatures={(getter) => { getDistrictFeaturesRef.current = getter }}
      />

      {/* Top Left - Location Breadcrumb */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/20 transition-all text-xs font-medium group"
          title="Back to Dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-x-0.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 text-white">
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
        <div className="absolute bottom-6 left-6 z-[1000]">
          <div className="flex items-center gap-2 bg-cyan-900/80 text-cyan-100 px-4 py-2 rounded-lg border border-cyan-500/50 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-bold">{currentSelection.size} district{currentSelection.size !== 1 ? 's' : ''} selected</span>
          </div>
        </div>
      )}

      {/* Hovered District Indicator */}
      {hoveredDistrict && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg border border-white/20">
            <span className="font-medium">{hoveredDistrict}</span>
          </div>
        </div>
      )}

      {/* Region Manager Toggle - When sidebar is closed */}
      {!sidebarOpen && selectedState && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-20 right-6 z-[1000] flex items-center gap-2 px-4 py-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all shadow-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
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

      {/* Right Sidebar - Floating Panel */}
      <div
        className={`absolute top-4 bottom-4 right-4 w-96 z-[1000] transition-all duration-500 ease-out ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
          }`}
      >
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl h-full flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-5 border-b border-white/10">
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
          <div className="flex-1 overflow-auto p-5 space-y-5">
            {!selectedState ? (
              /* No state selected */
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-20 h-20 mb-5 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
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
                  {selectedDistrictsData.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl">
                      {selectedDistrictsData.slice(0, 5).map((d) => (
                        <span
                          key={d.id}
                          className="px-3 py-1 text-xs bg-purple-500/30 text-purple-200 rounded-full cursor-pointer hover:bg-red-500/30 transition-colors"
                          onClick={() => removeFromSelection(d.id)}
                        >
                          {d.name} ×
                        </span>
                      ))}
                      {selectedDistrictsData.length > 5 && (
                        <span className="px-3 py-1 text-xs text-white/50">
                          +{selectedDistrictsData.length - 5} more
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
                      className="flex-1 px-4 py-3 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                {regions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white">
                      Saved Regions ({regions.length})
                    </h3>
                    <div className="space-y-2">
                      {regions.map((region) => (
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
                            <p>{region.state} • {region.districtIds.size} districts</p>
                            {region.regionalOfficer && <p>RO: {region.regionalOfficer}</p>}
                            {region.intelligentOfficer && <p>IO: {region.intelligentOfficer}</p>}
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
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-300" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {focusedRegion && (
        <IntelFeedView
          region={focusedRegion}
          onClose={() => setFocusedRegionId(null)}
        />
      )}
    </div>
  )
}


