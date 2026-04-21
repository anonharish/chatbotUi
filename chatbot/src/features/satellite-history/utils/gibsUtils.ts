// ─── gibsUtils.ts ─────────────────────────────────────────────────────────────
//
// Pure date / time helpers for the Satellite History Viewer.
// Release ID resolution and source config are handled in waybackUtils.ts.
// ──────────────────────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────

/** Earliest year with Wayback imagery available */
export const MIN_YEAR = 2014;

/** Latest year currently shown in the slider */
export const MAX_YEAR = new Date().getFullYear();

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/**
 * Returns yesterday's date string (YYYY-MM-DD).
 * Used as the "latest" date proxy since today's imagery is rarely available yet.
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
 * Returns a representative date string for a given year and optional month.
 * Defaults to the 15th of the month (mid-month proxy).
 */
export function getDefaultDate(year: number, month: number = 6): string {
  const mm = String(month).padStart(2, '0');
  return `${year}-${mm}-15`;
}

/**
 * Extracts the year from a YYYY-MM-DD string safely.
 * @throws Error if the date format is invalid.
 */
export function yearFromDate(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: "${date}"`);
  }

  const year = Number(date.slice(0, 4));

  if (isNaN(year)) {
    throw new Error(`Invalid year extracted from date: "${date}"`);
  }

  return year;
}

/**
 * Extracts the month (1-indexed) from a YYYY-MM-DD string safely.
 * @throws Error if the date format or month value is invalid.
 */
export function monthFromDate(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: "${date}"`);
  }

  const month = Number(date.slice(5, 7));

  if (isNaN(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month extracted from date: "${date}"`);
  }

  return month;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;