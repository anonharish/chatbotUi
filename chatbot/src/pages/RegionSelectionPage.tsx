import { useEffect, useState } from 'react'
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
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  useEffect(() => {
    fetch('/AndhraPradesh_Districts.geojson')
      .then((response) => response.json())
      .then((data: FeatureCollection) => setGeoData(data))
      .catch((error) => console.error('Error loading GeoJSON:', error))
  }, [])

  // Style for each district
  const getDistrictStyle = (districtId: string) => {
    const isSelected = selectedDistrict === districtId
    const isHovered = hoveredDistrict === districtId

    return {
      fillColor: isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : '#93c5fd',
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#1d4ed8' : '#2563eb',
      fillOpacity: isSelected ? 0.8 : isHovered ? 0.7 : 0.5,
    }
  }

  // Event handlers for each feature
  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties as DistrictProperties
    const districtId = props.district_id || props.NEW_DIST

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setHoveredDistrict(districtId)
        const target = e.target
        target.setStyle({
          fillColor: selectedDistrict === districtId ? '#3b82f6' : '#60a5fa',
          fillOpacity: 0.7,
        })
        target.bringToFront()
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredDistrict(null)
        const target = e.target
        target.setStyle(getDistrictStyle(districtId))
      },
      click: () => {
        setSelectedDistrict(districtId)
      },
    })

    // Bind tooltip with district name
    layer.bindTooltip(props.district_name || props.NEW_DIST, {
      permanent: false,
      direction: 'center',
      className: 'district-tooltip',
    })
  }

  // Center of Andhra Pradesh
  const center: [number, number] = [15.9129, 79.74]

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h1 className="text-2xl font-bold text-center">
          Andhra Pradesh - Region Selection
        </h1>
        {selectedDistrict && (
          <p className="text-center text-muted-foreground mt-2">
            Selected District:{' '}
            <span className="font-semibold text-primary">{selectedDistrict}</span>
          </p>
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
              key={selectedDistrict || 'default'}
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
            <span>District</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }} />
            <span>Hovered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionSelectionPage
