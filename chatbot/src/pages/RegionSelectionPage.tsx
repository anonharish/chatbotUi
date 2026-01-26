import { useEffect, useState, useCallback } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import type { Layer, LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface DistrictProperties {
  district_name: string
  district_id: string
  NEW_DIST: string
}

const RegionSelectionPage = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  const [selectedDistricts, setSelectedDistricts] = useState<Set<string>>(new Set())
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  useEffect(() => {
    fetch('/AndhraPradesh_Districts.geojson')
      .then((response) => response.json())
      .then((data: FeatureCollection) => setGeoData(data))
      .catch((error) => console.error('Error loading GeoJSON:', error))
  }, [])

  // Toggle district selection
  const toggleDistrictSelection = useCallback((districtId: string) => {
    setSelectedDistricts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(districtId)) {
        newSet.delete(districtId)
      } else {
        newSet.add(districtId)
      }
      return newSet
    })
  }, [])

  // Clear all selections
  const clearSelection = () => {
    setSelectedDistricts(new Set())
  }

  // Style for each district
  const getDistrictStyle = useCallback((districtId: string) => {
    const isSelected = selectedDistricts.has(districtId)
    const isHovered = hoveredDistrict === districtId

    // Selected districts get a unified green color to represent a single region
    if (isSelected) {
      return {
        fillColor: '#22c55e', // Green for selected/region
        weight: 2,
        opacity: 1,
        color: '#15803d', // Darker green border
        fillOpacity: 0.75,
      }
    }

    // Hovered (non-selected) districts
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
      fillColor: '#93c5fd',
      weight: 1,
      opacity: 1,
      color: '#2563eb',
      fillOpacity: 0.5,
    }
  }, [selectedDistricts, hoveredDistrict])

  // Event handlers for each feature
  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties as DistrictProperties
    const districtId = props.district_id || props.NEW_DIST

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setHoveredDistrict(districtId)
        const target = e.target
        const isSelected = selectedDistricts.has(districtId)
        if (!isSelected) {
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

    // Bind tooltip with district name
    layer.bindTooltip(props.district_name || props.NEW_DIST, {
      permanent: false,
      direction: 'center',
      className: 'district-tooltip',
    })
  }, [selectedDistricts, getDistrictStyle, toggleDistrictSelection])

  // Get selected district names for display
  const getSelectedDistrictNames = (): string[] => {
    if (!geoData) return []
    
    const districtNames: string[] = []
    const seenNames = new Set<string>()
    
    geoData.features.forEach((feature) => {
      const props = feature.properties as DistrictProperties
      const districtId = props.district_id || props.NEW_DIST
      const districtName = props.district_name || props.NEW_DIST
      
      if (selectedDistricts.has(districtId) && !seenNames.has(districtName)) {
        districtNames.push(districtName)
        seenNames.add(districtName)
      }
    })
    
    return districtNames.sort()
  }

  // Center of Andhra Pradesh
  const center: [number, number] = [15.9129, 79.74]
  const selectedNames = getSelectedDistrictNames()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h1 className="text-2xl font-bold text-center">
          Andhra Pradesh - Region Selection
        </h1>
        <p className="text-center text-muted-foreground mt-1 text-sm">
          Click districts to add/remove from your region
        </p>
        
        {/* Selected Districts Display */}
        {selectedNames.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-green-800 dark:text-green-200">
                Selected Region ({selectedNames.length} district{selectedNames.length !== 1 ? 's' : ''})
              </span>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedNames.map((name) => (
                <span
                  key={name}
                  className="px-2 py-1 bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 rounded text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
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
              key={Array.from(selectedDistricts).join(',')}
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
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#93c5fd' }} />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }} />
            <span>Hovered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span>Selected Region</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionSelectionPage
