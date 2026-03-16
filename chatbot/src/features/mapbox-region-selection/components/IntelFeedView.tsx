import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Region } from "../types";
import type { Feature, FeatureCollection, GeoJSON } from "geojson";
import * as turf from "@turf/turf";

interface IntelFeedViewProps {
  region: Region;
  onClose: () => void;
}

interface FieldOfficer {
  name: string;
  phone: string;
  mandals: string[];
  district: string;
  region: string;
  state: string;
}

import { STATE_NAME_TO_SHAPEFILE, SUBDISTRICT_FILE_OVERRIDES } from "@/features/region-selection/constants";


const SUBDISTRICTS_BASE =
  "https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/STATES";

function getMandalUrl(stateName: string): string {
  const slug = STATE_NAME_TO_SHAPEFILE[stateName] ?? stateName.toUpperCase();
  const fileName = SUBDISTRICT_FILE_OVERRIDES[stateName] ?? `${slug}_SUBDISTRICTS.geojson`;
  return `${SUBDISTRICTS_BASE}/${slug}/${fileName}`;
}


export const IntelFeedView = ({ region, onClose }: IntelFeedViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRef = useRef<maplibregl.Popup | null>(null);
  const selectedRef = useRef<Set<string>>(new Set());

  const [mounted, setMounted] = useState(false);
  const [mandalLoading, setMandalLoading] = useState(true);
  const [mandalError, setMandalError] = useState<string | null>(null);
  const [mandalCount, setMandalCount] = useState(0);


  const [selectedMandals, setSelectedMandals] = useState<Map<string, string>>(
    new Map(),
  );

  const [panelMode, setPanelMode] = useState<"info" | "form">("info");

  const [foName, setFoName] = useState("");
  const [foPhone, setFoPhone] = useState("");
  const [savedOfficers, setSavedOfficers] = useState<FieldOfficer[]>([]);
  const [formSuccess, setFormSuccess] = useState(false);


  const regionBbox = (() => {
    if (!region.geometry?.length) return null;
    try {
      const fc: FeatureCollection = {
        type: "FeatureCollection",
        features: region.geometry as Feature[],
      };
      return turf.bbox(fc) as [number, number, number, number];
    } catch {
      return null;
    }
  })();

  // ── Initialize MapLibre ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [78.9629, 22.5937],
      zoom: 4,
      attributionControl: false,
    });

    mapRef.current = map;

    // Fit to region bounds
    if (regionBbox) {
      map.fitBounds(regionBbox, { padding: 60, duration: 0 });
    }

    // Tooltip popup (hidden by default)
    const tooltip = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "mandal-tooltip",
      offset: 8,
    });
    tooltipRef.current = tooltip;

    map.on("load", () => {
      setMounted(true);

      // ── District fill layer ─────────────────────────────────────────────
      const districtFC: FeatureCollection = {
        type: "FeatureCollection",
        features: (region.geometry ?? []) as Feature[],
      };

      map.addSource("districts", { type: "geojson", data: districtFC });

      map.addLayer({
        id: "districts-fill",
        type: "fill",
        source: "districts",
        paint: {
          "fill-color": region.color,
          "fill-opacity": 0.12,
        },
      });

      map.addLayer({
        id: "districts-line",
        type: "line",
        source: "districts",
        paint: {
          "line-color": "#00f2ff",
          "line-width": 2,
          "line-opacity": 0.9,
          "line-dasharray": [4, 2],
        },
      });

      // ── Fetch & add mandal layers ───────────────────────────────────────
      const url = getMandalUrl(region.state);
      const districtNamesUpper = new Set(
        (region.districtNames ?? []).map((n) => n.toUpperCase()),
      );

      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<FeatureCollection>;
        })
        .then((data) => {
          // Filter to mandals that belong to this region's districts
          const filtered: FeatureCollection = {
            type: "FeatureCollection",
            features: data.features
              .filter((f) => {
                let dt = (f.properties?.dtname || "").toUpperCase();
                if (dt === 'THOOTHUKKUDI') {
                  dt = 'TUTICORIN';
                } else if (dt === 'WEST NIMAR') {
                  dt = 'KHARGONE';
                } else if (dt === 'EAST NIMAR') {
                  dt = 'KHANDWA';
                }

                return (
                  districtNamesUpper.size === 0 || districtNamesUpper.has(dt)
                );
              })
              .map((f, idx) => ({
                ...f,
                id: idx,
                properties: {
                  ...f.properties,
                  mandalId: String(f.id ?? idx),
                  selected: false,
                },
              })),
          };

          setMandalCount(filtered.features.length);

          map.addSource("mandals", {
            type: "geojson",
            data: filtered as GeoJSON,
            generateId: true,
          });

          // Mandal fill (shows selection state)
          map.addLayer({
            id: "mandals-fill",
            type: "fill",
            source: "mandals",
            paint: {
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ff88",
                "rgba(0,242,255,0.04)",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.35,
                0.1,
              ],
            },
          });

          // Mandal borders
          map.addLayer({
            id: "mandals-line",
            type: "line",
            source: "mandals",
            paint: {
              "line-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ff88",
                "rgba(0,242,255,0.5)",
              ],
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                1.5,
                0.6,
              ],
              "line-dasharray": [3, 1.5],
            },
          });

          setMandalLoading(false);

          // ── Hover: show tooltip ─────────────────────────────────────────
          map.on("mousemove", "mandals-fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            if (!e.features?.length) return;
            const f = e.features[0];
            const name =
              f.properties?.sdtname || f.properties?.mandalId || "Unknown";
            const district = f.properties?.dtname || "";
            tooltip
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font-family:monospace;font-size:11px;color:#00f2ff;letter-spacing:.06em;line-height:1.5">
                  <div style="color:#00ff88;font-weight:700;font-size:12px">${name}</div>
                  ${district ? `<div style="color:rgba(0,242,255,0.55);font-size:10px">${district}</div>` : ""}
                </div>`,
              )
              .addTo(map);
          });

          map.on("mouseleave", "mandals-fill", () => {
            map.getCanvas().style.cursor = "";
            tooltip.remove();
          });

          // ── Click: toggle mandal selection ──────────────────────────────
          map.on("click", "mandals-fill", (e) => {
            if (!e.features?.length) return;
            const f = e.features[0];
            const fid = f.id as number;
            const name = f.properties?.sdtname || String(fid);
            const mandalId = String(fid);

            const isSelected = selectedRef.current.has(mandalId);

            if (isSelected) {
              selectedRef.current.delete(mandalId);
              map.setFeatureState(
                { source: "mandals", id: fid },
                { selected: false },
              );
            } else {
              selectedRef.current.add(mandalId);
              map.setFeatureState(
                { source: "mandals", id: fid },
                { selected: true },
              );
            }

            // Update React state for the right panel
            setSelectedMandals((prev) => {
              const next = new Map(prev);
              if (isSelected) next.delete(mandalId);
              else next.set(mandalId, name);
              return next;
            });
          });
        })
        .catch((err) => {
          setMandalError(err.message);
          setMandalLoading(false);
        });
    });

    return () => {
      tooltip.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Deselect a mandal from chip ─────────────────────────────────────────────
  const deselectMandal = useCallback((id: string) => {
    const map = mapRef.current;
    if (map) {
      map.setFeatureState(
        { source: "mandals", id: Number(id) },
        { selected: false },
      );
    }
    selectedRef.current.delete(id);
    setSelectedMandals((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // ── Save field officer ──────────────────────────────────────────────────────
  const saveOfficer = useCallback(() => {
    if (!foName.trim()) return;
    const mandalNames = [...selectedMandals.values()];
    const officer: FieldOfficer = {
      name: foName.trim(),
      phone: foPhone.trim(),
      mandals: mandalNames,
      district: region.districtNames?.join(", ") || "",
      region: region.name,
      state: region.state,
    };
    setSavedOfficers((prev) => [...prev, officer]);
    setFoName("");
    setFoPhone("");
    // Clear map selections
    const map = mapRef.current;
    if (map) {
      selectedRef.current.forEach((id) => {
        map.setFeatureState(
          { source: "mandals", id: Number(id) },
          { selected: false },
        );
      });
    }
    selectedRef.current.clear();
    setSelectedMandals(new Map());
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setPanelMode("info");
    }, 2000);
  }, [foName, foPhone, selectedMandals, region]);

  return (
    <div
      className="absolute inset-0 z-[2000] flex"
      style={{
        background: "rgba(5, 10, 20, 0.96)",
        backdropFilter: "blur(12px)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease",
        fontFamily: "monospace",
      }}
    >
      <CornersDecoration />

      {/* Back Button */}
      <button
        onClick={onClose}
        className="absolute top-5 left-5 flex items-center gap-2 z-10"
        style={{
          color: "#00f2ff",
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          fontWeight: 700,
          border: "1px solid rgba(0,242,255,0.4)",
          padding: "6px 14px",
          background: "rgba(5,10,20,0.8)",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M7 1L2 5L7 9"
            stroke="#00f2ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        BACK TO GLOBAL VIEW
      </button>

      {/* Officers assigned badge */}
      {savedOfficers.length > 0 && (
        <div
          className="absolute top-5 right-5 flex items-center gap-2 z-10"
          style={{
            color: "#00ff88",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              background: "#00ff88",
              borderRadius: "50%",
              boxShadow: "0 0 6px #00ff88",
            }}
          />
          {savedOfficers.length} FIELD OFFICER
          {savedOfficers.length > 1 ? "S" : ""} ASSIGNED
        </div>
      )}

      {/* ══════ LEFT: Map Area ══════ */}
      <div className="relative flex-1 flex flex-col">
        {/* Map title bar */}
        <div className="flex items-center gap-3 px-5 pt-14 pb-3">
          <div
            style={{
              width: 6,
              height: 6,
              background: region.color,
              borderRadius: "50%",
              boxShadow: `0 0 8px ${region.color}`,
            }}
          />
          <span
            style={{
              color: region.color,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            {region.name.toUpperCase()} — TACTICAL MAP
          </span>
          <span
            style={{
              color: "rgba(0,242,255,0.3)",
              fontSize: "0.55rem",
              letterSpacing: "0.12em",
              marginLeft: 8,
            }}
          >
            {mandalLoading
              ? "LOADING MANDALS..."
              : mandalError
                ? "MANDAL DATA UNAVAILABLE"
                : `${mandalCount} MANDALS · SCROLL TO ZOOM · CLICK TO SELECT`}
          </span>
        </div>

        {/* Map container */}
        <div
          className="relative flex-1 mx-5 mb-5"
          style={{
            border: "1px solid rgba(0,242,255,0.2)",
            overflow: "hidden",
          }}
        >
          <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

          {/* Loading overlay */}
          {mandalLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                background: "rgba(5,10,20,0.4)",
                color: "rgba(0,242,255,0.5)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
              }}
            >
              <span>◌ LOADING MANDAL BOUNDARIES...</span>
            </div>
          )}

          {/* Corner HUD overlays */}
          <div
            className="absolute top-3 left-3 pointer-events-none"
            style={{
              color: "rgba(0,242,255,0.35)",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
            }}
          >
            MAP_SYS v2 · DARK MATTER
          </div>
          <div
            className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-2"
            style={{
              color: "rgba(0,242,255,0.3)",
              fontSize: "0.5rem",
              letterSpacing: "0.08em",
            }}
          >
            {selectedMandals.size > 0 && (
              <span style={{ color: "#00ff88" }}>
                {selectedMandals.size} SELECTED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ══════ RIGHT: Intel Panel ══════ */}
      <div
        className="flex flex-col py-14 pr-6"
        style={{ width: 320, borderLeft: "1px solid rgba(0,242,255,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 px-4">
          <div
            style={{
              width: 6,
              height: 6,
              background: "#00f2ff",
              borderRadius: "50%",
              boxShadow: "0 0 6px #00f2ff",
            }}
          />
          <span
            style={{
              color: "rgba(0,242,255,0.5)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
            }}
          >
            INTEL_FEED_v4.2
          </span>
        </div>
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,#00f2ff44,transparent)",
            marginBottom: 20,
            marginLeft: 16,
          }}
        />

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {panelMode === "info" ? (
            <>
              {/* Region Info */}
              <div className="space-y-4 mb-5">
                <IntelField
                  label="REGION"
                  value={region.name.toUpperCase()}
                  color={region.color}
                />
                <IntelField
                  label="COMMANDING OFFICER"
                  value={region.regionalOfficer?.toUpperCase() || "—"}
                />
                <IntelField
                  label="INTELLIGENCE LEAD"
                  value={region.intelligentOfficer?.toUpperCase() || "—"}
                />
                <IntelField label="STATE" value={region.state.toUpperCase()} />
                {region.districtNames?.length > 0 && (
                  <IntelField
                    label={`DISTRICTS (${region.districtNames.length})`}
                    value={
                      region.districtNames
                        .slice(0, 3)
                        .join(", ")
                        .toUpperCase() +
                      (region.districtNames.length > 3 ? "…" : "")
                    }
                  />
                )}
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(0,242,255,0.1)",
                  margin: "16px 0",
                }}
              />

              {/* Selected mandal chips */}
              {selectedMandals.size > 0 && (
                <div className="mb-4">
                  <div
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.2em",
                      color: "rgba(0,255,136,0.6)",
                      marginBottom: 8,
                    }}
                  >
                    SELECTED MANDALS ({selectedMandals.size})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[...selectedMandals.entries()].map(([id, name]) => (
                      <span
                        key={id}
                        onClick={() => deselectMandal(id)}
                        style={{
                          fontSize: "0.58rem",
                          letterSpacing: "0.04em",
                          color: "#00ff88",
                          border: "1px solid rgba(0,255,136,0.35)",
                          padding: "2px 7px",
                          background: "rgba(0,255,136,0.06)",
                          cursor: "pointer",
                        }}
                      >
                        {name} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assign button */}
              <button
                disabled={selectedMandals.size === 0}
                onClick={() => setPanelMode("form")}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  border: `1px solid ${selectedMandals.size > 0 ? "#00ff88" : "rgba(0,242,255,0.18)"}`,
                  color:
                    selectedMandals.size > 0
                      ? "#00ff88"
                      : "rgba(0,242,255,0.28)",
                  background:
                    selectedMandals.size > 0
                      ? "rgba(0,255,136,0.06)"
                      : "transparent",
                  cursor: selectedMandals.size > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {selectedMandals.size > 0
                  ? `ASSIGN FIELD OFFICER → ${selectedMandals.size} MANDAL${selectedMandals.size > 1 ? "S" : ""}`
                  : "SELECT MANDALS ON MAP TO ASSIGN"}
              </button>

              {/* Saved officers */}
              {savedOfficers.length > 0 && (
                <div className="mt-5">
                  <div
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.2em",
                      color: "rgba(0,242,255,0.38)",
                      marginBottom: 8,
                    }}
                  >
                    ASSIGNED OFFICERS
                  </div>
                  <div className="space-y-2">
                    {savedOfficers.map((o, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid rgba(0,255,136,0.2)",
                          padding: "7px 10px",
                          background: "rgba(0,255,136,0.03)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#00ff88",
                            fontWeight: 700,
                          }}
                        >
                          {o.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.55rem",
                            color: "rgba(0,242,255,0.45)",
                            marginTop: 2,
                          }}
                        >
                          {o.mandals.length} mandal
                          {o.mandals.length !== 1 ? "s" : ""}
                          {o.phone ? ` · ${o.phone}` : ""}
                        </div>
                        <div
                          style={{
                            fontSize: "0.5rem",
                            color: "rgba(0,242,255,0.3)",
                            marginTop: 2,
                          }}
                        >
                          {o.mandals.slice(0, 3).join(", ")}
                          {o.mandals.length > 3 ? "…" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── Field Officer Form ── */
            <>
              <div
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "#00ff88",
                  marginBottom: 16,
                }}
              >
                ASSIGNING TO {selectedMandals.size} MANDAL
                {selectedMandals.size > 1 ? "S" : ""}
              </div>

              {formSuccess ? (
                <div
                  className="flex items-center gap-3 py-10 justify-center"
                  style={{
                    color: "#00ff88",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 10l5 5 9-9"
                      stroke="#00ff88"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  OFFICER ASSIGNED
                </div>
              ) : (
                <div className="space-y-4">
                  <FormField
                    label="OFFICER NAME *"
                    value={foName}
                    onChange={setFoName}
                    placeholder="Enter full name"
                  />
                  <FormField
                    label="PHONE NUMBER"
                    value={foPhone}
                    onChange={setFoPhone}
                    placeholder="+91-XXXXXXXXXX"
                  />
                  <AutoField
                    label="MANDALS"
                    value={
                      [...selectedMandals.values()].slice(0, 4).join(", ") +
                      (selectedMandals.size > 4
                        ? `… +${selectedMandals.size - 4}`
                        : "")
                    }
                  />
                  <AutoField
                    label="DISTRICT"
                    value={region.districtNames?.slice(0, 2).join(", ") || "—"}
                  />
                  <AutoField label="REGION" value={region.name} />
                  <AutoField label="STATE" value={region.state} />

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setPanelMode("info")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        fontSize: "0.58rem",
                        letterSpacing: "0.1em",
                        border: "1px solid rgba(0,242,255,0.22)",
                        color: "rgba(0,242,255,0.45)",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={saveOfficer}
                      disabled={!foName.trim()}
                      style={{
                        flex: 2,
                        padding: "8px",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        fontWeight: 700,
                        border: `1px solid ${foName.trim() ? "#00ff88" : "rgba(0,242,255,0.15)"}`,
                        color: foName.trim()
                          ? "#00ff88"
                          : "rgba(0,242,255,0.28)",
                        background: foName.trim()
                          ? "rgba(0,255,136,0.07)"
                          : "transparent",
                        cursor: foName.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      SAVE OFFICER
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function IntelField({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.2em",
          color: "rgba(0,242,255,0.38)",
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.95rem",
          letterSpacing: "0.06em",
          fontWeight: 700,
          color: color || "#00f2ff",
          textShadow: `0 0 8px ${color || "#00f2ff"}55`,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          color: "rgba(0,242,255,0.42)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "rgba(0,242,255,0.04)",
          border: "1px solid rgba(0,242,255,0.22)",
          color: "#00f2ff",
          fontFamily: "monospace",
          fontSize: "0.75rem",
          padding: "7px 10px",
          outline: "none",
          letterSpacing: "0.05em",
        }}
      />
    </div>
  );
}

function AutoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          color: "rgba(0,242,255,0.32)",
          marginBottom: 3,
        }}
      >
        {label} <span style={{ color: "rgba(0,255,136,0.45)" }}>(AUTO)</span>
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.7rem",
          color: "rgba(0,242,255,0.65)",
          letterSpacing: "0.05em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function CornersDecoration() {
  const s: React.CSSProperties = {
    position: "absolute",
    width: 20,
    height: 20,
    pointerEvents: "none",
  };
  const c = "rgba(0,242,255,0.35)";
  return (
    <>
      <div
        style={{
          ...s,
          top: 12,
          left: 12,
          borderTop: `1px solid ${c}`,
          borderLeft: `1px solid ${c}`,
        }}
      />
      <div
        style={{
          ...s,
          top: 12,
          right: 12,
          borderTop: `1px solid ${c}`,
          borderRight: `1px solid ${c}`,
        }}
      />
      <div
        style={{
          ...s,
          bottom: 12,
          left: 12,
          borderBottom: `1px solid ${c}`,
          borderLeft: `1px solid ${c}`,
        }}
      />
      <div
        style={{
          ...s,
          bottom: 12,
          right: 12,
          borderBottom: `1px solid ${c}`,
          borderRight: `1px solid ${c}`,
        }}
      />
    </>
  );
}
