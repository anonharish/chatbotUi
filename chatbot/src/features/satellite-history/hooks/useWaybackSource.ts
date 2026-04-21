import { useMemo } from 'react';
import { useWaybackReleases } from './useWaybackReleases';
import {
  getClosestRelease,
  buildSourceConfig,
  type WaybackRelease,
  type SourceConfig,
} from '../utils/waybackUtils';

// ─── useWaybackSource ─────────────────────────────────────────────────────────

export interface UseWaybackSourceReturn {
  /**
   * The MapLibre raster source config for the matched release.
   * Null while releases are still loading.
   */
  sourceConfig: SourceConfig | null;
  /**
   * The actual Wayback release that was chosen as the closest match.
   * Null while loading.
   */
  release: WaybackRelease | null;
  /** True while fetching the release list. */
  isLoading: boolean;
  /** Non-null if fetching failed. */
  error: string | null;
}

/**
 * Given a user-selected date string (YYYY-MM-DD), resolves the closest
 * available ArcGIS Wayback release and returns its MapLibre source config.
 *
 * - Internally calls `useWaybackReleases` once (cached).
 * - Recomputes the closest release only when `date` or `releases` changes (memoized).
 * - Returns null sourceConfig until releases are loaded.
 *
 * @param date - The selected date in "YYYY-MM-DD" format.
 */
export function useWaybackSource(date: string): UseWaybackSourceReturn {
  const { releases, isLoading, error } = useWaybackReleases();

  const { release, sourceConfig } = useMemo(() => {
    // Don't compute until we have releases — avoids unnecessary work on mount
    if (releases.length === 0) {
      return { release: null, sourceConfig: null };
    }

    try {
      const matched = getClosestRelease(date, releases);
      const config = buildSourceConfig(matched.id);
      return { release: matched, sourceConfig: config };
    } catch (err) {
      console.error('[useWaybackSource] Failed to resolve release:', err);
      return { release: null, sourceConfig: null };
    }
  }, [date, releases]);

  return { sourceConfig, release, isLoading, error };
}
