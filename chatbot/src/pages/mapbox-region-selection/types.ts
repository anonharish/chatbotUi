// Types for Mapbox Region Selection feature

export interface Region {
  id: string
  name: string
  color: string
  districtIds: Set<number>    // Feature IDs for map rendering
  districtNames: string[]     // Display names
  regionalOfficer: string
  intelligentOfficer: string
  state: string               // Parent state name
}

export interface DistrictInfo {
  id: number      // Feature ID
  name: string    // Display name
  state: string   // Parent state
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
