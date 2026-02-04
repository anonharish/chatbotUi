import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Globe from 'react-globe.gl'
import type { FeatureCollection, Feature } from 'geojson'
import * as THREE from 'three'

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


import { LANDMASS_COLOR, SELECTED_STATE_FILL, SELECTED_STATE_BORDER, DEFAULT_FILL, SELECTED_STATE_SIDE_COLOR } from '../constants'

// India Center roughly
const INDIA_CENTER = { lat: 22.5937, lng: 78.9629, altitude: 0.75 } // Closer initial view (Zoomed in on India)

export const GlobeVisualization = ({
  indiaGeoData,
  currentStateDistricts,
  selectedState,
  hoveredState,
  // hoveredDistrict,
  onStateClick,
  onDistrictClick,
  onStateHover,
  onDistrictHover,
  getDistrictStyle,
  regionDistricts
}: GlobeVisualizationProps) => {
  const globeEl = useRef<any | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  const [worldGeoData, setWorldGeoData] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    // Fetch world countries data
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setWorldGeoData)
      .catch(err => console.error('Failed to load world data:', err))
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Initial animation to rotate to India
    setTimeout(() => {
      if (globeEl.current) {
        globeEl.current.pointOfView(INDIA_CENTER, 2000)
        
        // Hijack Render Loop to update controls
        const controls = globeEl.current.controls()
        const renderer = globeEl.current.renderer()
        
        renderer.setAnimationLoop(() => {
          controls.update()
          renderer.render(globeEl.current.scene(), globeEl.current.camera())
        })
      }
    }, 1000)
    
    // Cleanup
    return () => {
       if (globeEl.current) {
          const renderer = globeEl.current.renderer()
          if (renderer) renderer.setAnimationLoop(null)
       }
    }
  }, [])

  // Auto-rotate when idle
  useEffect(() => {
    if (globeEl.current && !selectedState && !hoveredState) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.35 // Slightly faster for visual appeal
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

    // Process world data
    const worldFeatures = worldGeoData?.features || []
    const styledWorld = worldFeatures
       .filter((f: any) => f.properties?.NAME !== 'India' && f.properties?.name !== 'India') // Exclude India to avoid overlap
       .map((f: any) => ({
          ...f,
          properties: { ...f.properties, isWorld: true }
       }))

    if (!selectedState || !currentStateDistricts) {
       return [...styledWorld, ...globeData, ...regions]
    }
    
    // Filter out the selected state from the main india list, and add districts
    const otherStates = globeData.filter((f: any) => {
      const name = f.properties?.ST_NM || f.properties?.name
      return name !== selectedState
    })
    
    return [...styledWorld, ...otherStates, ...regions, ...districtFeatures]
  }, [globeData, districtFeatures, selectedState, currentStateDistricts, regionDistricts, worldGeoData])


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
    
    // WORLD STYLE
    if (props.isWorld) {
        return {
            sideColor: 'rgba(0,0,0,0)',
            strokeColor: 'rgba(0, 0, 0, 0.2)', // Subtle borders for countries
            capColor: LANDMASS_COLOR, 
            altitude: 0.01 // Increased to prevents patches/z-fighting with bump map
        }
    }

    // DISTRICT STYLE
    if (props.uniqueId) {
       const style = getDistrictStyle(props.uniqueId)
       // Elevate district if it belongs to chosen state (which is elevated)
       const dState = props.st_nm || props.ST_NM || props.state
       const isElevated = selectedState && dState === selectedState
       
       let finalCapColor = style.fillColor
       let finalSideColor = 'rgba(50, 50, 50, 0.0)'
       
       // If this district is part of the selected state and has default (transparent) fill, 
       // Override with Selected State Fill (White)
       if (isElevated && style.fillColor === DEFAULT_FILL) {
           finalCapColor = SELECTED_STATE_FILL
           finalSideColor = SELECTED_STATE_SIDE_COLOR // Use the side color from constants
       }

       return {
          sideColor: finalSideColor,
          strokeColor: style.color,
          capColor: finalCapColor, 
          altitude: isElevated ? 0.03 : 0.015 // Elevated above base
       }
    }

    // STATE STYLE
    const name = props.ST_NM || props.name
    const isHovered = hoveredState === name
    const isSelected = selectedState === name

    if (isSelected) {
      return {
        sideColor: SELECTED_STATE_SIDE_COLOR, // Invisible Side (Floating)
        strokeColor: SELECTED_STATE_BORDER, // Active Border
        capColor: SELECTED_STATE_FILL, // Active Fill
        altitude: 0.03 // Lower elevation
      }
    }

    if (isHovered) {
      return {
        sideColor: 'rgba(0,0,0,0)', // Invisible Side
        strokeColor: '#ffffff', // Bright White
        capColor: 'rgba(0, 0, 0, 0)',
        altitude: 0.03
      }
    }

    return {
      sideColor: 'rgba(0,0,0,0)',
      strokeColor: 'rgba(255, 255, 255, 0.2)', // Slightly visible borders
      capColor: LANDMASS_COLOR, // Match world color
      altitude: 0.012 // Slightly above world base
    }
  }, [hoveredState, selectedState, getDistrictStyle])

  // Paths Data for Selected State Border (Thick Line)
  const selectedStatePaths = useMemo(() => {
    if (!selectedState || !indiaGeoData) return [];
    
    const stateFeature = indiaGeoData.features.find((f: any) => 
      (f.properties?.ST_NM || f.properties?.name) === selectedState
    );

    if (!stateFeature) return [];

    const paths: any[] = [];
    
    const processPolygon = (coords: any[]) => {
       // coords is array of [lng, lat]
       // Globe expects [lat, lng, alt] or just [lat, lng]
       // We need to map [lng, lat] -> [lat, lng]
       return coords.map(p => [p[1], p[0], 0.04]); // Altitude slightly above selected state districts (0.03)
    };

    if (stateFeature.geometry?.type === 'Polygon') {
       stateFeature.geometry.coordinates.forEach((ring: any[]) => {
          paths.push(processPolygon(ring));
       });
    } else if (stateFeature.geometry?.type === 'MultiPolygon') {
       stateFeature.geometry.coordinates.forEach((polygon: any[]) => {
          polygon.forEach((ring: any[]) => {
             paths.push(processPolygon(ring));
          });
       });
    }
    
    return paths;
  }, [selectedState, indiaGeoData])

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
          
          // Paths (Animated Borders) - ENABLED
          pathsData={selectedStatePaths} 
          pathPointAlt={p => p[2]} // Use the altitude we set in selectedStatePaths
          
          // Use Active Border Color
          pathColor={() => SELECTED_STATE_BORDER}
          
          pathStroke={2} // Thicker border (reference was 3px)
          pathDashLength={1} // Long dashes to simulate continuous flow
          pathDashGap={0} // Short gaps
          pathDashAnimateTime={5000} // 3s animation loop from reference
          pathResolution={5} // Higher resolution for smoother curves
          
          polygonsData={displayFeatures}
          polygonsTransitionDuration={400} // Snappy transition for hover
          polygonAltitude={d => {
             const style = getPolygonStyle(d)
             return style.altitude
          }}
          polygonCapColor={d => getPolygonStyle(d).capColor}
          polygonSideColor={d => getPolygonStyle(d).sideColor}
          polygonStrokeColor={d => getPolygonStyle(d).strokeColor}
          polygonLabel={getPolygonLabel}
          onPolygonHover={onPolygonHover}
          onPolygonClick={onPolygonClick}
          
          // Enhanced Atmosphere
          atmosphereColor="#3b82f6" // Deeper blue
          atmosphereAltitude={0.1} // Reduced altitude
          
          animateIn={true}
        />
      )}
    </div>
  )
}
