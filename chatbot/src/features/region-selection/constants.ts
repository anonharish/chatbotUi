// Constants and utilities for Region Selection feature

// Predefined vibrant colors for regions
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

// Generate a unique ID
export const generateId = (): string => Math.random().toString(36).substring(2, 9)

// Get next available color
export const getNextColor = (usedColors: string[]): string => {
  const availableColor = REGION_COLORS.find((c) => !usedColors.includes(c))
  return availableColor || REGION_COLORS[Math.floor(Math.random() * REGION_COLORS.length)]
}

// Darken a hex color for borders
export const darkenColor = (hex: string, percent: number = 20): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max((num >> 16) - amt, 0)
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0)
  const B = Math.max((num & 0x0000ff) - amt, 0)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

// Current selection color (purple)
export const SELECTION_COLOR = '#a855f7'
export const SELECTION_BORDER = '#7c3aed'

// Default district colors
export const DEFAULT_FILL = 'rgba(0, 0, 0, 0)' // Transparent fill to prevent glow
export const DEFAULT_BORDER = 'rgba(100, 255, 255, 0.3)' // Faint cyan border


// Hover colors
export const HOVER_FILL = '#60a5fa'
export const HOVER_BORDER = '#2563eb'

// Landmass Color
export const LANDMASS_COLOR = `rgba(233, 212, 188, 0.5)` // 50% opacity

// Active/Selected State Colors
export const SELECTED_STATE_FILL = "#FFFFFF"
export const SELECTED_STATE_BORDER = "#16A34A"
export const SELECTED_STATE_SIDE_COLOR = "rgba(0, 0, 0, 0)" // Invisible side by default as per user request

// India Colors
export const INDIA_BORDER_COLOR = "#FF9933" // Saffron distinct border
export const DEFAULT_STATE_BORDER = "#8BC462"
export const DEFAULT_STATE_FILL = DEFAULT_STATE_BORDER // Alias for backward compatibility/cache clearing

// Hover Colors
export const STATE_HOVER_COLOR = "#BBF7D0"

// Water Colors
export const WATER_REGION_COLOR = "#F3F4F6"

// State code to name mapping (from INDIA_DISTRICTS.geojson)
export const STATE_CODE_MAP: Record<string, string> = {
  '1': 'Jammu and Kashmir',
  '2': 'Himachal Pradesh',
  '3': 'Punjab',
  '4': 'Chandigarh',
  '5': 'Uttarakhand',
  '6': 'Haryana',
  '7': 'Delhi',
  '8': 'Rajasthan',
  '9': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Ladakh',
}

// Reverse mapping: State name to code
export const STATE_NAME_TO_CODE: Record<string, string> = Object.entries(STATE_CODE_MAP).reduce(
  (acc, [code, name]) => ({ ...acc, [name]: code }),
  {}
)

// CDN base URL for per-state district GeoJSON files (from INDIAN-SHAPEFILES)
export const DISTRICTS_CDN_BASE = 'https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/STATES'

// State name to CDN folder mapping (handles exact naming conventions in repo)
export const STATE_NAME_TO_SHAPEFILE: Record<string, string> = {
  'Odisha': 'ORISSA',
  'Uttarakhand': 'UTTARANCHAL',
  'Delhi': 'NCT OF DELHI',
  'Jammu & Kashmir': 'JAMMU AND KASHMIR',
  'Andaman & Nicobar Island': 'ANDAMAN AND NICOBAR',
  'Dadra and Nagar Haveli and Daman and Diu': 'DADRA AND NAGAR HAVELI',
}

// State name to specific district filename overrides
export const DISTRICT_FILE_OVERRIDES: Record<string, string> = {
  'Andhra Pradesh': 'ANDHRA PRADESH_NEW_DISTRICTS.geojson',
  'Odisha': 'ODISHA_DISTRICTS.geojson',
}

// State name to specific subdistrict filename overrides
export const SUBDISTRICT_FILE_OVERRIDES: Record<string, string> = {
  'Odisha': 'ODISHA_SUBDISTRICTS.geojson',
  'Tamil Nadu': 'TAMILNADU_SUBDISTRICTS.geojson',
}

// Helper to get CDN URL for a state's districts
export const getStateDistrictsCdnUrl = (stateName: string): string | null => {
  // Use our mapping or default to .toUpperCase()
  const slug = STATE_NAME_TO_SHAPEFILE[stateName] ?? stateName.toUpperCase()
  const fileName = DISTRICT_FILE_OVERRIDES[stateName] ?? `${slug}_DISTRICTS.geojson`
  return `${DISTRICTS_CDN_BASE}/${slug}/${fileName}`
}

// Complete map of valid states to their CDN slugs, used for validation in the main component
export const STATE_CDN_SLUG_MAP: Record<string, string> = Object.keys(STATE_NAME_TO_CODE).reduce((acc, stateName) => {
  acc[stateName] = STATE_NAME_TO_SHAPEFILE[stateName] ?? stateName.toUpperCase();
  return acc;
}, {} as Record<string, string>);


