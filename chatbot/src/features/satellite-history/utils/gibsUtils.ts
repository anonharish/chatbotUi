// ─── Constants ────────────────────────────────────────────────────────────────

export const MIN_YEAR = 2014; // Esri Wayback starts in 2014
export const MAX_YEAR = 2026; 

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns today's date placeholder for the latest imagery.
 */
export function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

/**
 * Formats a Date object as YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * For a given year and month (1-indexed), returns a date string proxy for the yearly release.
 */
export function getDefaultDate(year: number, month: number = 6): string {
  const mm = String(month).padStart(2, '0');
  return `${year}-${mm}-15`;
}

/**
 * Extracts the year from a YYYY-MM-DD string.
 */
export function yearFromDate(date: string): number {
  return parseInt(date.slice(0, 4), 10);
}

/**
 * Extracts the month (1-indexed) from a YYYY-MM-DD string.
 */
export function monthFromDate(date: string): number {
  return parseInt(date.slice(5, 7), 10);
}

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ─── Esri Wayback ────────────────────────────────────────────────────────────

// Mapping of years to representative, cloud-free Esri Wayback release IDs (Release Numbers)
export const WAYBACK_MAPPING: Record<number, number> = {
  2014: 11033, // 2014-06-25
  2015: 11952, // 2015-06-24
  2016: 11509, // 2016-06-13
  2017: 4073,  // 2017-06-27
  2018: 11334, // 2018-06-27
  2019: 645,   // 2019-06-26
  2020: 11135, // 2020-06-10
  2021: 13534, // 2021-06-30
  2022: 4905,  // 2022-06-29
  2023: 47963, // 2023-06-29
  2024: 39767, // 2024-06-27
  2025: 48925, // 2025-06-26
  2026: 22869, // 2026-03-26 (Latest)
};

export interface SourceConfig {
  url: string;
  maxzoom: number;
  attribution: string;
}

/**
 * Returns the source configuration based on the selected year/date.
 */
export function getSourceConfig(date: string): SourceConfig {
  const year = yearFromDate(date);
  const waybackId = WAYBACK_MAPPING[year] || WAYBACK_MAPPING[2024];
  
  return {
    url: `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${waybackId}/{z}/{y}/{x}`,
    maxzoom: 18, 
    attribution: '© Esri Wayback Imagery',
  };
}
