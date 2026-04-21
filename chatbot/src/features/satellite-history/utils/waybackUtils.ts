// ─── ArcGIS Wayback Core Utilities ────────────────────────────────────────────
//
// Data source: Esri's canonical Wayback config JSON (hosted on S3).
//
// REAL JSON structure (verified 2026-04-20):
//   {
//     "22869": {
//       "itemID": "b4c5...",
//       "itemTitle": "World Imagery (Wayback 2026-03-26)",
//       "itemURL": "https://wayback.maptiles.arcgis.com/.../tile/22869/{level}/{row}/{col}",
//       "metadataLayerUrl": "...",
//       "metadataLayerItemID": "...",
//       "layerIdentifier": "WB_2026_R03"
//     },
//     ...
//   }
//
// Key facts:
//   - Top-level keys ARE the releaseNum (numeric string, e.g. "22869")
//   - The date is parsed from itemTitle: "World Imagery (Wayback YYYY-MM-DD)"
//   - There is NO releaseDateLabel or releaseDatetime field in this JSON
//   - Tile REST URL: https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{releaseId}/{z}/{y}/{x}
// ──────────────────────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────

const WAYBACK_CONFIG_URL =
  'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json';

const WAYBACK_TILE_BASE =
  'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile';

/**
 * Regex to extract a YYYY-MM-DD date from an itemTitle like:
 * "World Imagery (Wayback 2026-03-26)"
 */
const TITLE_DATE_REGEX = /Wayback\s+(\d{4}-\d{2}-\d{2})/i;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Represents a single published Wayback imagery snapshot.
 */
export interface WaybackRelease {
  /** Numeric release ID — used as {releaseId} in the tile URL */
  id: number;
  /** ISO date string extracted from itemTitle: "YYYY-MM-DD" */
  date: string;
  /** Milliseconds timestamp derived from date (noon UTC, to avoid timezone drift) */
  timestamp: number;
  /** Human-readable title, e.g. "World Imagery (Wayback 2026-03-26)" */
  title: string;
}

/**
 * MapLibre raster source configuration for a specific Wayback release.
 */
export interface SourceConfig {
  /** Full tile URL template with {z}/{y}/{x} placeholders */
  url: string;
  /** Maximum zoom level the service supports */
  maxzoom: number;
  /** Attribution string for display */
  attribution: string;
  /** Tile size in pixels — 512 for sharp (non-blurry) rendering */
  tileSize: number;
}

// ─── Raw config JSON shape ────────────────────────────────────────────────────

/** Shape of each entry value in the Esri Wayback config JSON */
interface WaybackConfigEntry {
  itemID?: string;
  itemTitle?: string;
  itemURL?: string;
  metadataLayerUrl?: string;
  metadataLayerItemID?: string;
  layerIdentifier?: string;
  // NOTE: releaseDateLabel and releaseDatetime do NOT exist in this JSON
}

/** The full config JSON: { "releaseNum": WaybackConfigEntry, ... } */
type WaybackConfigJSON = Record<string, WaybackConfigEntry>;

// ─── Module-level cache ───────────────────────────────────────────────────────

let _cache: WaybackRelease[] | null = null;
let _fetchPromise: Promise<WaybackRelease[]> | null = null;

// ─── fetchWaybackReleases ─────────────────────────────────────────────────────

/**
 * Fetches all available ArcGIS Wayback imagery releases from Esri's config JSON.
 *
 * - Date is parsed from itemTitle ("World Imagery (Wayback YYYY-MM-DD)")
 * - Release ID is the numeric key of each entry
 * - Result is sorted ascending by date (oldest first)
 * - Cached at module level — fetches once per browser session
 *
 * @throws Error if the network request fails or no valid releases can be parsed.
 */
export async function fetchWaybackReleases(): Promise<WaybackRelease[]> {
  if (_cache !== null) {
    return _cache;
  }

  if (_fetchPromise !== null) {
    return _fetchPromise;
  }

  _fetchPromise = (async (): Promise<WaybackRelease[]> => {
    const res = await fetch(WAYBACK_CONFIG_URL);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch Wayback config: HTTP ${res.status} ${res.statusText}`
      );
    }

    const raw: WaybackConfigJSON = await res.json();
    const releases: WaybackRelease[] = [];

    for (const key of Object.keys(raw)) {
      const entry = raw[key];

      // Release ID comes from the object key (e.g. "22869")
      const id = parseInt(key, 10);
      if (!Number.isFinite(id) || id <= 0) {
        continue; // skip non-numeric keys if any
      }

      // Extract date from itemTitle: "World Imagery (Wayback 2026-03-26)"
      const title = entry.itemTitle ?? '';
      const dateMatch = TITLE_DATE_REGEX.exec(title);
      if (!dateMatch) {
        // Can't determine date — skip this entry
        continue;
      }

      const date = dateMatch[1]; // "YYYY-MM-DD"

      // Convert to a noon-UTC timestamp to avoid timezone midnight issues
      const timestamp = new Date(`${date}T12:00:00Z`).getTime();
      if (!Number.isFinite(timestamp)) {
        continue;
      }

      releases.push({ id, date, timestamp, title });
    }

    if (releases.length === 0) {
      throw new Error(
        'Wayback config returned no valid releases. ' +
        'The config JSON may have changed — check TITLE_DATE_REGEX in waybackUtils.ts.'
      );
    }

    // Sort ascending: oldest release first
    releases.sort((a, b) => a.timestamp - b.timestamp);

    _cache = releases;
    _fetchPromise = null;
    return releases;
  })();

  return _fetchPromise;
}

// ─── getClosestRelease ────────────────────────────────────────────────────────

/**
 * Finds the Wayback release whose date is closest to the given target date.
 *
 * @param date     - Target date in "YYYY-MM-DD" format.
 * @param releases - Sorted list of all available Wayback releases.
 * @returns The release with the smallest timestamp difference.
 *
 * Edge cases:
 * - Invalid date format → logs a warning and returns the latest release.
 * - Empty releases array → throws.
 */
export function getClosestRelease(
  date: string,
  releases: WaybackRelease[]
): WaybackRelease {
  if (releases.length === 0) {
    throw new Error('getClosestRelease: releases array is empty.');
  }

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!isValidDate) {
    console.warn(
      `[waybackUtils] Invalid date "${date}" — falling back to latest release.`
    );
    return releases[releases.length - 1];
  }

  const targetTs = new Date(`${date}T12:00:00Z`).getTime();
  if (!Number.isFinite(targetTs)) {
    console.warn(
      `[waybackUtils] Date "${date}" produced an invalid timestamp — falling back to latest release.`
    );
    return releases[releases.length - 1];
  }

  let closest = releases[0];
  let minDiff = Math.abs(releases[0].timestamp - targetTs);

  for (let i = 1; i < releases.length; i++) {
    const diff = Math.abs(releases[i].timestamp - targetTs);
    if (diff < minDiff) {
      minDiff = diff;
      closest = releases[i];
    }
  }

  return closest;
}

// ─── buildSourceConfig ────────────────────────────────────────────────────────

/**
 * Builds a MapLibre raster source configuration for a specific Wayback release.
 *
 * Image quality:
 * - tileSize: 512  — prevents blurry 256→512 upscaling
 * - maxzoom: 18    — never overscale beyond server capacity
 * - REST tile URL (not WMTS)
 *
 * @param releaseId - Numeric Wayback release ID (WaybackRelease.id)
 */
export function buildSourceConfig(releaseId: number): SourceConfig {
  return {
    // ✅ REST tile endpoint: NOT WMTS
    url: `${WAYBACK_TILE_BASE}/${releaseId}/{z}/{y}/{x}`,
    maxzoom: 18,
    attribution: '© Esri Wayback Imagery',
    tileSize: 512,
  };
}
