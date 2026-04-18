import { useState, useEffect, useRef, useCallback } from 'react';

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string]; // [minLat, maxLat, minLon, maxLon]
  place_id: number;
}

interface UseGeocodingReturn {
  results: GeocodingResult[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  clearResults: () => void;
}

const CACHE = new Map<string, GeocodingResult[]>();
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS = 600;

export function useGeocoding(): UseGeocodingReturn {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      return;
    }

    // Return cached result immediately
    if (CACHE.has(trimmed)) {
      setResults(CACHE.get(trimmed)!);
      return;
    }

    // Cancel previous in-flight request
    abortController.current?.abort();
    abortController.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        format: 'jsonv2',
        q: trimmed,
        limit: '5',
        addressdetails: '0',
      });

      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        signal: abortController.current.signal,
        headers: {
          // Required by Nominatim usage policy
          'User-Agent': 'SatelliteHistoryViewer/1.0 (educational)',
          'Accept-Language': 'en',
        },
      });

      if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

      const data: GeocodingResult[] = await res.json();
      CACHE.set(trimmed, data);
      setResults(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return; // intentional cancel
      setError('Failed to search location. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(
    (query: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      debounceTimer.current = setTimeout(() => fetchResults(query), DEBOUNCE_MS);
    },
    [fetchResults]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      abortController.current?.abort();
    };
  }, []);

  return { results, isLoading, error, search, clearResults };
}
