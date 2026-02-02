import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Globe from 'react-globe.gl'
import type { FeatureCollection, Feature } from 'geojson'
// import * as THREE from 'three'

interface GlobeVisualizationProps {
  indiaGeoData: FeatureCollection | null
  currentStateDistricts: FeatureCollection | null
  selectedState: string | null
  hoveredState: string | null
  hoveredDistrict: string | null
  onStateClick: (stateName: string) => void
  onDistrictClick: (districtId: string) => void
  onStateHover: (stateName: string | null) => void
  onDistrictHover: (districtId: string | null) => void
  getDistrictStyle: (districtId: string) => { color: string; fillOpacity: number; fillColor: string }
  regionDistricts?: FeatureCollection | null
  width?: number
  height?: number
}

// India Center roughly
const INDIA_CENTER = { lat: 22.5937, lng: 78.9629, altitude: 1.0 } // Closer initial view (Zoomed in on India)
// const FOCUS_CENTER_OFFSET = { lat: 0, lng: 0, altitude: 0.4 } // Very close "cinematic" zoom for state

export const GlobeVisualization = ({
  indiaGeoData,
  currentStateDistricts,
  selectedState,
  hoveredState,
  hoveredDistrict,
  onStateClick,
  onDistrictClick,
  onStateHover,
  onDistrictHover,
  getDistrictStyle,
  regionDistricts
}: GlobeVisualizationProps) => {
  const globeEl = useRef<any | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  // const [hoveredPolygon, setHoveredPolygon] = useState<object | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Initial animation to rotate to India
    setTimeout(() => {
      if (globeEl.current) {
        globeEl.current.pointOfView(INDIA_CENTER, 2000)
      }
    }, 1000)
  }, [])

  // Auto-rotate when idle
  useEffect(() => {
    if (globeEl.current && !selectedState && !hoveredState) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.25 // Slowed down
    } else if (globeEl.current) {
      globeEl.current.controls().autoRotate = false
    }
  }, [selectedState, hoveredState])

  // Zoom to State when selected
  useEffect(() => {
    if (selectedState && globeEl.current && indiaGeoData) {
      // Find state feature to get centroid
      const stateFeature = indiaGeoData.features.find((f: any) => 
        (f.properties?.ST_NM || f.properties?.name) === selectedState
      )

      if (stateFeature) {
        // Calculate rough centroid
        let lat = INDIA_CENTER.lat
        let lng = INDIA_CENTER.lng
        
        // Try to get centroid from geometry
        if (stateFeature.geometry?.type === 'Polygon' || stateFeature.geometry?.type === 'MultiPolygon') {
           const coords = stateFeature.geometry.type === 'Polygon' 
              ? stateFeature.geometry.coordinates[0] 
              : stateFeature.geometry.coordinates[0][0];
           
           if (Array.isArray(coords) && coords.length > 0) {
              let sumLat = 0, sumLng = 0, count = 0;
              coords.forEach((p: any) => {
                 if (Array.isArray(p) && p.length >= 2) {
                    sumLng += p[0];
                    sumLat += p[1];
                    count++;
                 }
              });
              if (count > 0) {
                 lat = sumLat / count;
                 lng = sumLng / count;
              }
           }
        }

        // Zoom deep into the state
        globeEl.current.pointOfView({ lat, lng, altitude: 0.5 }, 2000)
      }
    } else if (!selectedState && globeEl.current) {
      // Zoom out back to India view (Closer default)
      globeEl.current.pointOfView(INDIA_CENTER, 2000)
    }
  }, [selectedState, indiaGeoData])

  // Polygon styling
  const getPolygonLabel = useCallback((d: object) => {
    const f = d as Feature
    return f.properties?.ST_NM || f.properties?.name || f.properties?.district || ''
  }, [])

  // Combined GeoJSON data logic
  const globeData = useMemo(() => {
    if (!indiaGeoData) return []
    return indiaGeoData.features
  }, [indiaGeoData])

  const districtFeatures = useMemo(() => {
    if (!currentStateDistricts) return []
    return currentStateDistricts.features
  }, [currentStateDistricts])
  
  const displayFeatures = useMemo(() => {
    const regions = regionDistricts?.features || []

    if (!selectedState || !currentStateDistricts) {
       return [...globeData, ...regions]
    }
    
    // Filter out the selected state from the main india list, and add districts
    const otherStates = globeData.filter((f: any) => {
      const name = f.properties?.ST_NM || f.properties?.name
      return name !== selectedState
    })
    
    return [...otherStates, ...regions, ...districtFeatures]
  }, [globeData, districtFeatures, selectedState, currentStateDistricts, regionDistricts])

  // Interaction Handlers
  const onPolygonHover = useCallback((d: object | null) => {
    // setHoveredPolygon(d)
    
    if (!d) {
      onStateHover(null)
      onDistrictHover(null)
      return
    }

    const f = d as Feature
    const props = f.properties as any
    
    // Check if district (has uniqueId)
    if (props.uniqueId) {
       onDistrictHover(props.uniqueId)
    } else {
       const stateName = props.ST_NM || props.name
       if (stateName) onStateHover(stateName)
    }

  }, [onStateHover, onDistrictHover])

  const onPolygonClick = useCallback((d: object) => {
     const f = d as Feature
     const props = f.properties as any
     
     if (props.uniqueId) {
         // District Click
         onDistrictClick(props.uniqueId)
     } else {
         // State Click
         const stateName = props.ST_NM || props.name
         if (stateName) onStateClick(stateName)
     }
  }, [onStateClick, onDistrictClick])

  // Style Calculator
  const getPolygonStyle = useCallback((d: object) => {
    const f = d as Feature
    const props = f.properties as any
    
    // DISTRICT STYLE
    if (props.uniqueId) {
       const style = getDistrictStyle(props.uniqueId)
       return {
          sideColor: 'rgba(50, 50, 50, 0.5)',
          strokeColor: style.color,
          capColor: style.fillColor, 
          altitude: 0.02
       }
    }

    // STATE STYLE
    const name = props.ST_NM || props.name
    const isHovered = hoveredState === name
    const isSelected = selectedState === name

    if (isSelected) {
      return {
        sideColor: 'rgba(100, 200, 255, 0.1)',
        strokeColor: '#67e8f9',
        capColor: 'rgba(0, 0, 0, 0)', // Transparent
        altitude: 0.015
      }
    }

    if (isHovered) {
      return {
        sideColor: 'rgba(100, 200, 255, 0.3)',
        strokeColor: '#67e8f9',
        capColor: 'rgba(103, 232, 249, 0.1)',
        altitude: 0.02
      }
    }

    return {
      sideColor: 'rgba(50, 50, 50, 0.1)',
      strokeColor: 'rgba(255, 255, 255, 0.3)',
      capColor: 'rgba(0,0,0,0.3)', // Darker fill
      altitude: 0.01
    }
  }, [hoveredState, selectedState, getDistrictStyle])

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {mounted && (
        <Globe
          ref={globeEl}
          // Use dark texture or null for black background
          backgroundColor="#000000"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          // Removed backgroundImageUrl for pure black/starfield background from parent
          
          polygonsData={displayFeatures}
          polygonAltitude={d => (d as any).properties?.uniqueId ? 0.02 : 0.01}
          polygonCapColor={d => getPolygonStyle(d).capColor}
          polygonSideColor={d => getPolygonStyle(d).sideColor}
          polygonStrokeColor={d => getPolygonStyle(d).strokeColor}
          polygonLabel={getPolygonLabel}
          onPolygonHover={onPolygonHover}
          onPolygonClick={onPolygonClick}
          
          // Enhanced Atmosphere
          atmosphereColor="#67e8f9"
          atmosphereAltitude={0.15}
          
          animateIn={true}
        />
      )}
    </div>
  )
}
