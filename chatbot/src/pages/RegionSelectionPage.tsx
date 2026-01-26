import { useEffect, useState, useCallback, useMemo } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import type { Layer, LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface DistrictProperties {
  district_name: string
  district_id: string
  NEW_DIST: string
}

interface Region {
  id: string
  name: string
  color: string
  districts: Set<string>
}

// Predefined vibrant colors for regions
const REGION_COLORS = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
]

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Get next available color
const getNextColor = (usedColors: string[]): string => {
  const availableColor = REGION_COLORS.find((c) => !usedColors.includes(c))
  return availableColor || REGION_COLORS[Math.floor(Math.random() * REGION_COLORS.length)]
}

// Darken a hex color for borders
const darkenColor = (hex: string, percent: number = 20): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max((num >> 16) - amt, 0)
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0)
  const B = Math.max((num & 0x0000ff) - amt, 0)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const RegionSelectionPage = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set())
  const [regionName, setRegionName] = useState('')
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/AndhraPradesh_Districts.geojson')
      .then((response) => response.json())
      .then((data: FeatureCollection) => setGeoData(data))
      .catch((error) => console.error('Error loading GeoJSON:', error))
  }, [])

  // Build a map from district ID to region for quick lookup
  const districtToRegion = useMemo(() => {
    const map = new Map<string, Region>()
    regions.forEach((region) => {
      region.districts.forEach((districtId) => {
        map.set(districtId, region)
      })
    })
    return map
  }, [regions])

  // Get district name from ID
  const getDistrictName = useCallback(
    (districtId: string): string => {
      if (!geoData) return districtId
      for (const feature of geoData.features) {
        const props = feature.properties as DistrictProperties
        const id = props.district_id || props.NEW_DIST
        if (id === districtId) {
          return props.district_name || props.NEW_DIST
        }
      }
      return districtId
    },
    [geoData]
  )

  // Toggle district selection
  const toggleDistrictSelection = useCallback((districtId: string) => {
    // Check if district belongs to an existing region
    const existingRegion = districtToRegion.get(districtId)
    if (existingRegion) {
      // Cannot select districts that belong to saved regions
      return
    }

    setCurrentSelection((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(districtId)) {
        newSet.delete(districtId)
      } else {
        newSet.add(districtId)
      }
      return newSet
    })
  }, [districtToRegion])

  // Save current selection as a region
  const saveRegion = () => {
    if (currentSelection.size === 0 || !regionName.trim()) return

    const usedColors = regions.map((r) => r.color)
    const newRegion: Region = {
      id: generateId(),
      name: regionName.trim(),
      color: getNextColor(usedColors),
      districts: new Set(currentSelection),
    }

    setRegions((prev) => [...prev, newRegion])
    setCurrentSelection(new Set())
    setRegionName('')
  }

  // Delete a region
  const deleteRegion = (regionId: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== regionId))
  }

  // Update region name
  const updateRegionName = (regionId: string, newName: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, name: newName } : r))
    )
    setEditingRegionId(null)
  }

  // Clear current selection
  const clearSelection = () => {
    setCurrentSelection(new Set())
    setRegionName('')
  }

  // Remove single district from current selection
  const removeFromSelection = (districtId: string) => {
    setCurrentSelection((prev) => {
      const newSet = new Set(prev)
      newSet.delete(districtId)
      return newSet
    })
  }

  // Style for each district
  const getDistrictStyle = useCallback(
    (districtId: string) => {
      // Check if district belongs to a saved region
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

      // Check if district is in current selection
      const isSelected = currentSelection.has(districtId)
      if (isSelected) {
        return {
          fillColor: '#a855f7', // Purple for current selection
          weight: 2,
          opacity: 1,
          color: '#7c3aed',
          fillOpacity: 0.75,
        }
      }

      const isHovered = hoveredDistrict === districtId
      if (isHovered) {
        return {
          fillColor: '#60a5fa',
          weight: 2,
          opacity: 1,
          color: '#2563eb',
          fillOpacity: 0.7,
        }
      }

      // Default non-selected districts
      return {
        fillColor: '#e2e8f0',
        weight: 1,
        opacity: 1,
        color: '#94a3b8',
        fillOpacity: 0.6,
      }
    },
    [currentSelection, hoveredDistrict, districtToRegion]
  )

  // Event handlers for each feature
  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
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
              fillColor: '#60a5fa',
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

      // Build tooltip content with region info
      const region = districtToRegion.get(districtId)
      const tooltipContent = region
        ? `<div><strong>${districtName}</strong><br/><span style="color: ${region.color};">● Region: ${region.name}</span></div>`
        : `<strong>${districtName}</strong>`

      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'center',
        className: 'district-tooltip',
      })
    },
    [currentSelection, getDistrictStyle, toggleDistrictSelection, districtToRegion]
  )

  // Get selected district data for display
  const getSelectedDistrictData = (): { id: string; name: string }[] => {
    if (!geoData) return []

    const districtData: { id: string; name: string }[] = []
    const seenIds = new Set<string>()

    geoData.features.forEach((feature) => {
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

  // Center of Andhra Pradesh
  const center: [number, number] = [15.9129, 79.74]
  const selectedData = getSelectedDistrictData()

  // Generate key for GeoJSON to force re-render
  const geoJsonKey = useMemo(() => {
    const regionKey = regions.map((r) => `${r.id}:${Array.from(r.districts).join(',')}`).join('|')
    const selectionKey = Array.from(currentSelection).join(',')
    return `${regionKey}||${selectionKey}`
  }, [regions, currentSelection])

  return (
    <div className="flex h-screen bg-background">
      {/* Left Side - Map (60%) */}
      <div className="w-[60%] flex flex-col border-r">
        {/* Map Header */}
        <div className="p-3 border-b bg-card">
          <h2 className="text-lg font-semibold">Andhra Pradesh Map</h2>
          <p className="text-xs text-muted-foreground">
            Click on districts to select. Hover to see region info.
          </p>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {geoData ? (
            <MapContainer
              center={center}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <GeoJSON
                key={geoJsonKey}
                data={geoData}
                style={(feature) => {
                  const props = feature?.properties as DistrictProperties
                  const districtId = props?.district_id || props?.NEW_DIST
                  return getDistrictStyle(districtId)
                }}
                onEachFeature={onEachFeature}
              />
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Loading map data...</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-3 border-t bg-card">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#e2e8f0' }} />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#a855f7' }} />
              <span>Current Selection</span>
            </div>
            {regions.map((region) => (
              <div key={region.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: region.color }} />
                <span>{region.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Selection Panel (40%) */}
      <div className="w-[40%] flex flex-col bg-card">
        {/* Panel Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Region Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage custom regions
          </p>
        </div>

        {/* Selection Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Current Selection Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              New Region Selection
            </h3>

            {selectedData.length > 0 ? (
              <div className="space-y-3">
                {/* Region Name Input */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Region Name
                  </label>
                  <input
                    type="text"
                    value={regionName}
                    onChange={(e) => setRegionName(e.target.value)}
                    placeholder="Enter region name..."
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Selected Districts */}
                <div className="space-y-2 max-h-40 overflow-auto">
                  {selectedData.map((district) => (
                    <div
                      key={district.id}
                      className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
                    >
                      <span className="text-sm text-purple-800 dark:text-purple-200">
                        {district.name}
                      </span>
                      <button
                        onClick={() => removeFromSelection(district.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                        title="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={clearSelection}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={saveRegion}
                    disabled={!regionName.trim()}
                    className="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Region
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md text-center">
                Click on available districts to start creating a new region
              </p>
            )}
          </div>

          {/* Saved Regions Section */}
          {regions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Saved Regions ({regions.length})
              </h3>

              <div className="space-y-3">
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: `${region.color}15`,
                      borderColor: `${region.color}40`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                        {editingRegionId === region.id ? (
                          <input
                            type="text"
                            defaultValue={region.name}
                            autoFocus
                            onBlur={(e) => updateRegionName(region.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateRegionName(region.id, e.currentTarget.value)
                              }
                            }}
                            className="px-2 py-1 text-sm border rounded bg-background"
                          />
                        ) : (
                          <span
                            className="font-medium cursor-pointer hover:underline"
                            onClick={() => setEditingRegionId(region.id)}
                            title="Click to edit name"
                          >
                            {region.name}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteRegion(region.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                        title="Delete region"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-xs text-muted-foreground mb-2">
                      {region.districts.size} district{region.districts.size !== 1 ? 's' : ''}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {Array.from(region.districts)
                        .slice(0, 5)
                        .map((districtId) => (
                          <span
                            key={districtId}
                            className="px-2 py-0.5 text-xs rounded"
                            style={{
                              backgroundColor: `${region.color}30`,
                              color: darkenColor(region.color, 40),
                            }}
                          >
                            {getDistrictName(districtId)}
                          </span>
                        ))}
                      {region.districts.size > 5 && (
                        <span className="px-2 py-0.5 text-xs text-muted-foreground">
                          +{region.districts.size - 5} more
                        </span>
                      )}
                    </div>
                  </div>
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
                Select districts from the map, name your region, and save it to create custom regions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegionSelectionPage
