import { useState, useEffect } from 'react';

interface GEETileResponse {
  urlFormat: string;
  attribution: string;
}

/**
 * Hook to fetch Google Earth Engine tile URLs from the local backend.
 */
export function useGEETiles(year: number) {
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string>('Google Earth Engine');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTiles() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Our news backend running on port 3001
        const response = await fetch(`http://localhost:3001/api/gee/tiles?year=${year}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch GEE tiles. Is the backend running?');
        }

        const data: GEETileResponse = await response.json();
        setTileUrl(data.urlFormat);
        setAttribution(data.attribution);
      } catch (err: any) {
        console.error('GEE Fetch Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTiles();
  }, [year]);

  return { tileUrl, attribution, isLoading, error };
}
