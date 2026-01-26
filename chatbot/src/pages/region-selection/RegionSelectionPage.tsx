import { useEffect, useState, useCallback, useMemo } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import type { Layer, LeafletMouseEvent } from 'leaflet'
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

const RegionSelectionPage = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set())
  const [regionName, setRegionName] = useState('')
  const [regionalOfficer, setRegionalOfficer] = useState('')
  const [intelligentOfficer, setIntelligentOfficer] = useState('')
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
  const toggleDistrictSelection = useCallback(
    (districtId: string) => {
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
    },
    [districtToRegion]
  )

  // Save current selection as a region
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

  // Delete a region
  const deleteRegion = (regionId: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== regionId))
  }

  // Update region name
  const updateRegionName = (regionId: string, newName: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, name: newName } : r))
    )
  }

  // Update regional officer
  const updateRegionalOfficer = (regionId: string, officer: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, regionalOfficer: officer } : r))
    )
  }

  // Update intelligent officer
  const updateIntelligentOfficer = (regionId: string, officer: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, intelligentOfficer: officer } : r))
    )
  }

  // Clear current selection
  const clearSelection = () => {
    setCurrentSelection(new Set())
    setRegionName('')
    setRegionalOfficer('')
    setIntelligentOfficer('')
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

      // Default non-selected districts
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

      // Build tooltip content with region and officer info
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

  // Get selected district data for display
  const getSelectedDistrictData = (): DistrictData[] => {
    if (!geoData) return []

    const districtData: DistrictData[] = []
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
    const regionKey = regions
      .map((r) => `${r.id}:${Array.from(r.districts).join(',')}`)
      .join('|')
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
          </div>
        </div>
      </div>

      {/* Right Side - Selection Panel (40%) */}
      <div className="w-[40%] flex flex-col bg-card">
        {/* Panel Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Region Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage custom regions with officers
          </p>
        </div>

        {/* Selection Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
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
        </div>
      </div>
    </div>
  )
}

export default RegionSelectionPage
