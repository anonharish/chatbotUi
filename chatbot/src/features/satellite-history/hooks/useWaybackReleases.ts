import { useState, useEffect } from 'react';
import { fetchWaybackReleases, type WaybackRelease } from '../utils/waybackUtils';

// ─── useWaybackReleases ────────────────────────────────────────────────────────

export interface UseWaybackReleasesReturn {
  /** All available Wayback releases, sorted ascending by date. Empty while loading. */
  releases: WaybackRelease[];
  /** True while the config JSON is being fetched. */
  isLoading: boolean;
  /** Non-null if the fetch failed. */
  error: string | null;
}

/**
 * Fetches all ArcGIS Wayback imagery releases on mount and exposes them.
 *
 * - Uses module-level caching in `waybackUtils.fetchWaybackReleases()` —
 *   the network request fires at most once per browser session.
 * - Re-mounting this hook does NOT re-fetch; the cached promise resolves
 *   immediately on the next call.
 */
export function useWaybackReleases(): UseWaybackReleasesReturn {
  const [releases, setReleases] = useState<WaybackRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchWaybackReleases()
      .then((data) => {
        if (!cancelled) {
          setReleases(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to load Wayback imagery releases.';
          console.error('[useWaybackReleases]', message);
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []); // Intentionally empty: fetch once on mount

  return { releases, isLoading, error };
}
