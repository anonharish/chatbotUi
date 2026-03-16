import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
} from "geojson";
import { getStateDistrictsCdnUrl } from "@/features/region-selection/constants";
import * as turf from "@turf/turf";
import type { Region, FieldOfficer } from "../types";
import { createDistrictKey } from "../types";

// India center coordinates
const INDIA_CENTER: [number, number] = [78.9629, 22.5937];
const INITIAL_ZOOM = 3.5;

// India States GeoJSON URL
const INDIA_STATES_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

// Colors
const DISTRICT_HOVER_COLOR = "rgba(245, 222, 179, 0.6)"; // Beige/wheat
const DISTRICT_SELECTED_COLOR = "rgba(135, 206, 250, 0.7)"; // Light sky blue
const DISTRICT_BORDER_COLOR = "#22d3ee"; // Cyan

interface MapboxVisualizationProps {
  onStateClick?: (stateName: string) => void;
  onStateHover?: (stateName: string | null) => void;
  onDistrictClick?: (
    districtId: number,
    districtName: string,
    stateName: string,
  ) => void;
  onDistrictHover?: (districtName: string | null) => void;
  regions?: Region[];
  currentSelection?: Set<string>; // Composite keys: "stateName_featureId"
  onRegionClick?: (regionId: string) => void;
  onRegisterGetFeatures?: (
    getter: (ids: Set<number>) => GeoJSON.Feature[],
  ) => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  text: string;
  isRegion?: boolean;
  regionId?: string;
  regionInfo?: {
    name: string;
    regionalOfficer?: string;
    intelligentOfficer?: string;
    districtCount: number;
    state: string;
    fieldOfficers?: FieldOfficer[];
  };
}

export const MapboxVisualization = ({
  onStateClick,
  onStateHover,
  onDistrictClick,
  onDistrictHover,
  regions = [],
  currentSelection = new Set(),
  onRegionClick,
  onRegisterGetFeatures,
}: MapboxVisualizationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const hoveredStateIdRef = useRef<number | null>(null);
  const hoveredDistrictIdRef = useRef<number | null>(null);
  const selectedStateRef = useRef<string | null>(null);
  const statesDataRef = useRef<FeatureCollection | null>(null);
  const districtClickedRef = useRef<boolean>(false);
  const districtsLoadedRef = useRef<boolean>(false);
  const districtCountRef = useRef<number>(0);
  // Store district features for retrieval
  const districtFeaturesRef = useRef<Feature[]>([]);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  // Track hover timeouts
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store callbacks in refs to avoid useEffect re-runs
  const onStateClickRef = useRef(onStateClick);
  const onStateHoverRef = useRef(onStateHover);
  const onDistrictClickRef = useRef(onDistrictClick);
  const onDistrictHoverRef = useRef(onDistrictHover);
  const regionsRef = useRef(regions);
  const currentSelectionRef = useRef(currentSelection);
  const onRegionClickRef = useRef(onRegionClick);

  // Update refs when props change
  useEffect(() => {
    onStateClickRef.current = onStateClick;
    onStateHoverRef.current = onStateHover;
    onDistrictClickRef.current = onDistrictClick;
    onDistrictHoverRef.current = onDistrictHover;
    regionsRef.current = regions;
    currentSelectionRef.current = currentSelection;
    onRegionClickRef.current = onRegionClick;
  }, [
    onStateClick,
    onStateHover,
    onDistrictClick,
    onDistrictHover,
    regions,
    currentSelection,
    onRegionClick,
  ]);

  // Register the getDistrictFeatures function with parent
  useEffect(() => {
    if (onRegisterGetFeatures) {
      const getFeatures = (ids: Set<number>): GeoJSON.Feature[] => {
        return districtFeaturesRef.current.filter((f) =>
          ids.has(f.id as number),
        );
      };
      onRegisterGetFeatures(getFeatures);
    }
  }, [onRegisterGetFeatures]);

  // Update district colors when regions or selection change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !districtsLoadedRef.current) return;
    if (!map.getSource("state-districts")) return;

    const count = districtCountRef.current;
    const currentState = selectedStateRef.current;

    for (let featureId = 0; featureId < count; featureId++) {
      // Create composite key for this featureId
      const districtKey = currentState
        ? createDistrictKey(currentState, featureId)
        : null;

      // Only apply region color if it's for the current state
      const region = regions.find(
        (r) => r.state === currentState && r.districtIds.has(districtKey || ""),
      );
      const isSelected = districtKey
        ? currentSelection.has(districtKey)
        : false;

      map.setFeatureState(
        { source: "state-districts", id: featureId },
        {
          regionColor: region?.color || null,
          selected: isSelected,
        },
      );
    }
  }, [regions, currentSelection]);

  // Update persistent all-regions layer when regions change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Wait for map to be ready
    if (!map.isStyleLoaded()) {
      const checkStyle = () => {
        if (map.isStyleLoaded()) {
          updateAllRegionsLayer();
        }
      };
      map.once("styledata", checkStyle);
      return;
    }

    updateAllRegionsLayer();

    function updateAllRegionsLayer() {
      // Collect all features from all regions with geometry
      const allFeatures: GeoJSON.Feature[] = [];

      regions.forEach((region) => {
        if (region.geometry) {
          region.geometry.forEach((feature) => {
            allFeatures.push({
              ...feature,
              properties: {
                ...feature.properties,
                regionId: region.id,
                regionName: region.name,
                regionColor: region.color,
                regionState: region.state,
                regionalOfficer: region.regionalOfficer,
                intelligentOfficer: region.intelligentOfficer,
                districtCount: region.districtIds.size,
                // Make field list accessible globally to MapLibre
                fieldOfficersRaw: JSON.stringify(region.fieldOfficers ?? []), 
              },
              id: allFeatures.length,
            });
          });
        }
      });

      const featureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: allFeatures,
      };

      // Update or create the source
      if (!map) return;
      const existingSource = map.getSource(
        "all-regions",
      ) as maplibregl.GeoJSONSource;

      if (existingSource) {
        existingSource.setData(featureCollection);
      } else if (allFeatures.length > 0) {
        // Add source and layer for persistent regions
        map.addSource("all-regions", {
          type: "geojson",
          data: featureCollection,
        });

        // Add fill layer for persistent regions
        map.addLayer(
          {
            id: "all-regions-fill",
            type: "fill",
            source: "all-regions",
            paint: {
              "fill-color": ["get", "regionColor"],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.85,
                0.65,
              ],
            },
          },
          "india-state-fill",
        ); // Insert below state fill layer

        // Add border layer for persistent regions
        map.addLayer(
          {
            id: "all-regions-border",
            type: "line",
            source: "all-regions",
            paint: {
              "line-color": ["get", "regionColor"],
              "line-width": 2,
              "line-opacity": 0.9,
            },
          },
          "india-state-fill",
        );

        // Add hover handlers for all-regions layer
        map.on("mouseenter", "all-regions-fill", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "all-regions-fill", () => {
          map.getCanvas().style.cursor = "";
          // Clear hover state for all features
          const features = map.querySourceFeatures("all-regions");
          features.forEach((f) => {
            if (f.id !== undefined) {
              map.setFeatureState(
                { source: "all-regions", id: f.id },
                { hover: false },
              );
            }
          });
          
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = setTimeout(() => {
            setTooltip((prev) => ({ ...prev, visible: false }));
          }, 300); // 300ms buffer to move mouse into popup
        });

        map.on("mousemove", "all-regions-fill", (e) => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const featureId = feature.id as number;

            // Set hover state
            map.setFeatureState(
              { source: "all-regions", id: featureId },
              { hover: true },
            );

            // Show region tooltip
            const props = feature.properties;
            let loadedOfficers: FieldOfficer[] = [];
            if (props?.fieldOfficersRaw) {
              try { loadedOfficers = JSON.parse(props.fieldOfficersRaw); } 
              catch(e) {}
            }
            
            setTooltip({
              visible: true,
              x: e.originalEvent.clientX,
              y: e.originalEvent.clientY,
              text: props?.regionName || "Unknown Region",
              isRegion: true,
              regionId: props?.regionId,
              regionInfo: {
                name: props?.regionName || "Unknown",
                regionalOfficer: props?.regionalOfficer,
                intelligentOfficer: props?.intelligentOfficer,
                districtCount: props?.districtCount || 0,
                state: props?.regionState || "",
                fieldOfficers: loadedOfficers,
              },
            });
          }
        });

        map.on("click", "all-regions-fill", (e) => {
          if (e.features && e.features.length > 0) {
            const regionId = e.features[0].properties?.regionId;
            if (regionId && onRegionClickRef.current) {
              onRegionClickRef.current(regionId);
            }
          }
        });
      }
    }
  }, [regions]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: "Satellite Globe",
        sources: {
          "esri-satellite": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          "carto-labels": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png",
              "https://c.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            maxzoom: 20,
          },
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "esri-satellite",
            minzoom: 0,
            maxzoom: 22,
            paint: {
              "raster-brightness-max": 1,
              "raster-brightness-min": 0.1,
              "raster-saturation": 0.2,
              "raster-contrast": 0.1,
            },
          },
          {
            id: "labels-layer",
            type: "raster",
            source: "carto-labels",
            minzoom: 0,
            maxzoom: 22,
            paint: { "raster-opacity": 1 },
          },
        ],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: INDIA_CENTER,
      zoom: INITIAL_ZOOM,
      maxPitch: 85,
    });

    // Helper: Zoom to state bounds
    const zoomToState = (stateName: string) => {
      if (!statesDataRef.current) return;

      const stateFeature = statesDataRef.current.features.find(
        (f) => f.properties?.ST_NM === stateName,
      );

      if (!stateFeature || !stateFeature.geometry) {
        console.warn(`State feature not found: ${stateName}`);
        return;
      }

      const bbox = turf.bbox(stateFeature as Feature<Polygon | MultiPolygon>);

      map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ] as maplibregl.LngLatBoundsLike,
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1500,
          maxZoom: 8,
        },
      );
    };

    // Helper: Load districts for a state
    const loadStateDistricts = (stateName: string) => {
      const districtsUrl = getStateDistrictsCdnUrl(stateName);
      if (!districtsUrl) {
        console.warn(`No district data URL for state: ${stateName}`);
        return;
      }

      console.log(`Loading districts for ${stateName}:`, districtsUrl);
      districtsLoadedRef.current = false;

      fetch(districtsUrl)
        .then((res) => res.json())
        .then((data: FeatureCollection) => {
          console.log(
            `Districts loaded for ${stateName}:`,
            data.features.length,
          );

          // Remove existing district source and layers if they exist
          if (map.getLayer("region-fill")) {
            map.removeLayer("region-fill");
          }
          if (map.getLayer("district-borders")) {
            map.removeLayer("district-borders");
          }
          if (map.getLayer("district-fill")) {
            map.removeLayer("district-fill");
          }
          if (map.getSource("state-districts")) {
            map.removeSource("state-districts");
          }

          // Add IDs for feature-state
          const featuresWithIds = data.features.map(
            (f: Feature, i: number) => ({
              ...f,
              id: i,
            }),
          );

          // Add new district source
          map.addSource("state-districts", {
            type: "geojson",
            data: { type: "FeatureCollection", features: featuresWithIds },
            generateId: true,
          });

          // District fill - colors based on region, selection, or hover
          map.addLayer({
            id: "district-fill",
            type: "fill",
            source: "state-districts",
            paint: {
              "fill-color": [
                "case",
                // Selected color (takes priority for visual feedback)
                ["boolean", ["feature-state", "selected"], false],
                DISTRICT_SELECTED_COLOR,
                // Hover color
                ["boolean", ["feature-state", "hover"], false],
                DISTRICT_HOVER_COLOR,
                // Default transparent
                "rgba(0, 0, 0, 0)",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.7,
                ["boolean", ["feature-state", "hover"], false],
                0.6,
                0,
              ],
            },
          });

          // District borders - cyan
          map.addLayer({
            id: "district-borders",
            type: "line",
            source: "state-districts",
            paint: {
              "line-color": DISTRICT_BORDER_COLOR,
              "line-width": 1.5,
              "line-opacity": 0.9,
            },
          });

          // Region fill layer - for saved regions (rendered on top)
          map.addLayer({
            id: "region-fill",
            type: "fill",
            source: "state-districts",
            paint: {
              "fill-color": [
                "coalesce",
                ["feature-state", "regionColor"],
                "transparent",
              ],
              "fill-opacity": [
                "case",
                ["to-boolean", ["feature-state", "regionColor"]],
                0.7,
                0,
              ],
            },
          });

          districtsLoadedRef.current = true;
          districtCountRef.current = featuresWithIds.length;
          // Store features for retrieval when saving regions
          districtFeaturesRef.current = featuresWithIds;
          // Apply region colors only for regions belonging to THIS state
          // Note: We don't apply old selections here because feature IDs are reused per state
          for (
            let featureId = 0;
            featureId < featuresWithIds.length;
            featureId++
          ) {
            // Create composite key and check if region contains this district
            const districtKey = createDistrictKey(stateName, featureId);
            const region = regionsRef.current.find(
              (r) => r.state === stateName && r.districtIds.has(districtKey),
            );

            if (region) {
              map.setFeatureState(
                { source: "state-districts", id: featureId },
                {
                  regionColor: region.color,
                  selected: false,
                },
              );
            }
          }
        })
        .catch((err) =>
          console.error(`Error loading districts for ${stateName}:`, err),
        );
    };

    // Helper: Handle state click
    const handleStateClick = (stateName: string) => {
      selectedStateRef.current = stateName;
      zoomToState(stateName);
      loadStateDistricts(stateName);
      onStateClickRef.current?.(stateName);
    };

    // Helper: Handle district click
    const handleDistrictClick = (featureId: number, districtName: string) => {
      console.log("District clicked:", districtName, "ID:", featureId);
      onDistrictClickRef.current?.(
        featureId,
        districtName,
        selectedStateRef.current || "",
      );
    };

    map.on("load", () => {
      map.setProjection({ type: "globe" });

      map.setSky({
        "sky-color": "#0b0b19",
        "sky-horizon-blend": 0.4,
        "horizon-color": "#1e3a8a",
        "horizon-fog-blend": 0.2,
        "fog-color": "#172554",
        "fog-ground-blend": 0.8,
      });

      // Load India States
      fetch(INDIA_STATES_URL)
        .then((res) => res.json())
        .then((data: FeatureCollection) => {
          statesDataRef.current = data;

          const featuresWithIds = data.features.map(
            (f: Feature, i: number) => ({
              ...f,
              id: i,
            }),
          );

          map.addSource("india-states", {
            type: "geojson",
            data: { type: "FeatureCollection", features: featuresWithIds },
            generateId: true,
          });

          // India country border - glow
          map.addLayer({
            id: "india-border-glow",
            type: "line",
            source: "india-states",
            paint: {
              "line-color": "#ffffff",
              "line-width": 2,
              "line-opacity": 0.8,
              "line-blur": 1,
            },
          });

          // India country border - main
          map.addLayer({
            id: "india-border-main",
            type: "line",
            source: "india-states",
            paint: {
              "line-color": "#ffffff",
              "line-width": 2,
              "line-opacity": 0.2,
            },
          });

          // State fill for hover/click
          map.addLayer({
            id: "india-state-fill",
            type: "fill",
            source: "india-states",
            paint: {
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "rgba(139, 196, 98, 0.4)",
                "rgba(0, 0, 0, 0)",
              ],
              "fill-opacity": 1,
            },
          });

          // State borders - green
          map.addLayer({
            id: "india-state-borders",
            type: "line",
            source: "india-states",
            paint: {
              "line-color": "#ffffff",
              "line-width": 2,
              "line-opacity": 0.9,
            },
          });

          console.log("State layers added");
        });

    });

    // === STATE HOVER HANDLERS ===
    map.on("mouseenter", "india-state-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "india-state-fill", () => {
      map.getCanvas().style.cursor = "";
      if (hoveredStateIdRef.current !== null) {
        map.setFeatureState(
          { source: "india-states", id: hoveredStateIdRef.current },
          { hover: false },
        );
      }
      hoveredStateIdRef.current = null;
      onStateHoverRef.current?.(null);
    });

    map.on("mousemove", "india-state-fill", (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const featureId = feature.id as number;

        if (
          hoveredStateIdRef.current !== null &&
          hoveredStateIdRef.current !== featureId
        ) {
          map.setFeatureState(
            { source: "india-states", id: hoveredStateIdRef.current },
            { hover: false },
          );
        }

        hoveredStateIdRef.current = featureId;
        map.setFeatureState(
          { source: "india-states", id: featureId },
          { hover: true },
        );

        const stateName = feature.properties?.ST_NM;
        if (stateName) onStateHoverRef.current?.(stateName);
      }
    });

    // State click handler
    map.on("click", "india-state-fill", (e) => {
      // Skip if a district was just clicked
      if (districtClickedRef.current) {
        districtClickedRef.current = false;
        return;
      }

      // Check if clicking on a district (district layer takes priority)
      if (map.getLayer("district-fill")) {
        const districtFeatures = map.queryRenderedFeatures(e.point, {
          layers: ["district-fill"],
        });
        if (districtFeatures && districtFeatures.length > 0) {
          // District exists at this point, let district handler handle it
          return;
        }
      }

      if (e.features && e.features.length > 0) {
        const stateName = e.features[0].properties?.ST_NM;
        if (stateName) {
          handleStateClick(stateName);
        }
      }
    });

    // === DISTRICT HOVER HANDLERS ===
    map.on("mouseenter", "district-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "district-fill", () => {
      map.getCanvas().style.cursor = "";
      if (hoveredDistrictIdRef.current !== null) {
        map.setFeatureState(
          { source: "state-districts", id: hoveredDistrictIdRef.current },
          { hover: false },
        );
      }
      hoveredDistrictIdRef.current = null;
      setTooltip((prev) => ({ ...prev, visible: false }));
      onDistrictHoverRef.current?.(null);
    });

    map.on("mousemove", "district-fill", (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const featureId = feature.id as number;

        if (
          hoveredDistrictIdRef.current !== null &&
          hoveredDistrictIdRef.current !== featureId
        ) {
          map.setFeatureState(
            { source: "state-districts", id: hoveredDistrictIdRef.current },
            { hover: false },
          );
        }

        hoveredDistrictIdRef.current = featureId;
        map.setFeatureState(
          { source: "state-districts", id: featureId },
          { hover: true },
        );

        // Get district name from the INDIAN-SHAPEFILES data source (fallback to NAME for AP new districts)
        const districtName = feature.properties?.dtname || feature.properties?.NAME || "Unknown District";

        // Show tooltip at cursor position
        setTooltip({
          visible: true,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
          text: districtName,
        });

        onDistrictHoverRef.current?.(districtName);
      }
    });

    // District click handler - toggle selection
    map.on("click", "district-fill", (e) => {
      // Set flag to prevent state click handler from firing
      districtClickedRef.current = true;

      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const featureId = feature.id as number;
        const districtName = feature.properties?.dtname || feature.properties?.NAME || "Unknown District";

        handleDistrictClick(featureId, districtName);
      }
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {tooltip.visible && (
        <div
          className="fixed z-50 overflow-hidden rounded-md border border-slate-700/80 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-2xl animate-in fade-in-0 zoom-in-95 backdrop-blur-md"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 10,
            pointerEvents: "none",
            minWidth: tooltip.isRegion ? "240px" : "auto",
          }}
        >
          {tooltip.isRegion && tooltip.regionInfo ? (
            <div className="space-y-3">
              <div>
                <div className="font-bold text-base text-white">
                  {tooltip.regionInfo.name}
                </div>
                <div className="text-xs text-sky-300/80 font-medium">
                  {tooltip.regionInfo.state}
                </div>
              </div>
              <div className="text-xs space-y-1 pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {tooltip.regionInfo.districtCount} district
                  {tooltip.regionInfo.districtCount !== 1 ? "s" : ""}
                </div>
                {tooltip.regionInfo.regionalOfficer && (
                  <div className="text-slate-400">RO: <span className="text-slate-200">{tooltip.regionInfo.regionalOfficer}</span></div>
                )}
                {tooltip.regionInfo.intelligentOfficer && (
                  <div className="text-slate-400">IO: <span className="text-slate-200">{tooltip.regionInfo.intelligentOfficer}</span></div>
                )}
              </div>

              {/* Dynamic Field Officer Interactive Area */}
              <div className="pt-2 border-t border-slate-700/50 mt-2">
                 {tooltip.regionInfo.fieldOfficers && tooltip.regionInfo.fieldOfficers.length > 0 ? (
                    <div className="space-y-2">
                       <p className="text-xs font-semibold text-emerald-400">
                          {tooltip.regionInfo.fieldOfficers.length} Assigned Officer{tooltip.regionInfo.fieldOfficers.length !== 1 && 's'}
                       </p>
                       <div className="space-y-1 mt-1 mb-2">
                          {tooltip.regionInfo.fieldOfficers.slice(0, 3).map((fo) => (
                            <div key={fo.id} className="flex items-center gap-1.5 text-xs text-slate-300">
                               <div className="w-1.5 h-1.5 rounded-full" style={{ background: fo.color }}></div>
                               <span className="truncate max-w-[140px]">{fo.name}</span>
                            </div>
                          ))}
                          {tooltip.regionInfo.fieldOfficers.length > 3 && (
                            <p className="text-[10px] text-slate-500 italic pl-3">
                              +{tooltip.regionInfo.fieldOfficers.length - 3} more...
                            </p>
                          )}
                       </div>
                    </div>
                 ) : (
                    <div className="pt-1 pb-1">
                       <p className="text-xs text-slate-400 italic">No field officers active.</p>
                       <p className="text-[10px] text-slate-500 mt-1">Click region to Add Field Officer.</p>
                    </div>
                 )}
              </div>
            </div>
          ) : (
            tooltip.text
          )}
        </div>
      )}
    </div>
  );
};
