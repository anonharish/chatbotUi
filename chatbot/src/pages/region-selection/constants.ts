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
export const LANDMASS_COLOR = "#E9D4BC"

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

// CDN base URL for per-state district GeoJSON files
export const DISTRICTS_CDN_BASE = 'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/states'

// State name to CDN slug mapping (lowercase with hyphens)
export const STATE_CDN_SLUG_MAP: Record<string, string> = {
  'Andhra Pradesh': 'andhra-pradesh',
  'Arunachal Pradesh': 'arunachal-pradesh',
  'Assam': 'assam',
  'Bihar': 'bihar',
  'Chhattisgarh': 'chhattisgarh',
  'Goa': 'goa',
  'Gujarat': 'gujarat',
  'Haryana': 'haryana',
  'Himachal Pradesh': 'himachal-pradesh',
  'Jharkhand': 'jharkhand',
  'Karnataka': 'karnataka',
  'Kerala': 'kerala',
  'Madhya Pradesh': 'madhya-pradesh',
  'Maharashtra': 'maharashtra',
  'Manipur': 'manipur',
  'Meghalaya': 'meghalaya',
  'Mizoram': 'mizoram',
  'Nagaland': 'nagaland',
  'Odisha': 'odisha',
  'Punjab': 'punjab',
  'Rajasthan': 'rajasthan',
  'Sikkim': 'sikkim',
  'Tamil Nadu': 'tamil-nadu',
  'Telangana': 'telangana',
  'Tripura': 'tripura',
  'Uttar Pradesh': 'uttar-pradesh',
  'Uttarakhand': 'uttarakhand',
  'West Bengal': 'west-bengal',
  // Union Territories
  'Andaman and Nicobar Islands': 'andaman-and-nicobar-islands',
  'Chandigarh': 'chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu': 'dadra-and-nagar-haveli-and-daman-and-diu',
  'Delhi': 'delhi',
  'Jammu and Kashmir': 'jammu-and-kashmir',
  'Ladakh': 'ladakh',
  'Lakshadweep': 'lakshadweep',
  'Puducherry': 'puducherry',
}

// Helper to get CDN URL for a state's districts
export const getStateDistrictsCdnUrl = (stateName: string): string | null => {
  const slug = STATE_CDN_SLUG_MAP[stateName]
  if (!slug) return null
  return `${DISTRICTS_CDN_BASE}/${slug}.geojson`
}


