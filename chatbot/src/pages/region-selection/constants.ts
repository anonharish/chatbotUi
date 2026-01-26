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
export const DEFAULT_FILL = '#e2e8f0'
export const DEFAULT_BORDER = '#94a3b8'

// Hover colors
export const HOVER_FILL = '#60a5fa'
export const HOVER_BORDER = '#2563eb'
