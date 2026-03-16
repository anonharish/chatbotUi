// Types for Mapbox Region Selection feature

export interface FieldOfficer {
  id: string;
  name: string;
  phone: string;
  mandals: string[];
  mandalIds: string[];
  district: string;
  region: string;
  state: string;
  color: string;
}

export const OFFICER_COLORS = [
  "#ef4444", "#3b82f6", "#eab308", "#ec4899", "#a855f7",
  "#22c55e", "#f97316", "#14b8a6", "#6366f1", "#8b5cf6"
];

export interface Region {
  id: string
  name: string
  color: string
  districtIds: Set<string>    // Composite keys: "stateName_featureId" for unique identification
  districtNames: string[]     // Display names
  regionalOfficer: string
  intelligentOfficer: string
  state: string               // Parent state name
  // GeoJSON features for persistent rendering across all states
  geometry?: GeoJSON.Feature[]
  fieldOfficers?: FieldOfficer[]
}

export interface DistrictInfo {
  id: string      // Composite key: "stateName_featureId"
  featureId: number  // Numeric ID for MapLibre feature-state
  name: string    // Display name
  state: string   // Parent state
}

// Create composite district key
export const createDistrictKey = (state: string, featureId: number): string => `${state}_${featureId}`

// Parse composite district key
export const parseDistrictKey = (key: string): { state: string, featureId: number } | null => {
  const lastUnderscore = key.lastIndexOf('_')
  if (lastUnderscore === -1) return null
  const state = key.substring(0, lastUnderscore)
  const featureId = parseInt(key.substring(lastUnderscore + 1), 10)
  return isNaN(featureId) ? null : { state, featureId }
}

// Colors for regions (vibrant palette)
export const REGION_COLORS = [
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

// Get next available color
export const getNextColor = (usedColors: string[]): string => {
  const availableColor = REGION_COLORS.find((c) => !usedColors.includes(c))
  return availableColor || REGION_COLORS[Math.floor(Math.random() * REGION_COLORS.length)]
}

// Generate unique ID
export const generateId = (): string => Math.random().toString(36).substring(2, 9)

// Darken a hex color for borders
export const darkenColor = (hex: string, percent: number = 20): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max((num >> 16) - amt, 0)
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0)
  const B = Math.max((num & 0x0000ff) - amt, 0)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
