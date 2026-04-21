import { useState, useRef, useCallback } from 'react';
import { Satellite, AlertTriangle, Loader2 } from 'lucide-react';
import { PlaceSearchBar } from '@/features/satellite-history/components/PlaceSearchBar';
import { YearSlider } from '@/features/satellite-history/components/YearSlider';
import { InfoPanel } from '@/features/satellite-history/components/InfoPanel';
import { SatelliteMap, type SatelliteMapHandle } from '@/features/satellite-history/components/SatelliteMap';
import { useWaybackSource } from '@/features/satellite-history/hooks/useWaybackSource';
import {
  getYesterday,
  yearFromDate,
} from '@/features/satellite-history/utils/gibsUtils';
import '@/features/satellite-history/satellite-history.css';

// ─── SatelliteHistoryPage ─────────────────────────────────────────────────────

export default function SatelliteHistoryPage() {
  const [date, setDate] = useState<string>(getYesterday());
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [isLatestMode, setIsLatestMode] = useState(true);
  const mapRef = useRef<SatelliteMapHandle>(null);

  // ── Dynamic Wayback source — replaces hardcoded WAYBACK_MAPPING ──────────
  const { sourceConfig, release, isLoading, error } = useWaybackSource(date);

  // ─── Event handlers ───────────────────────────────────────────────────────

  const handlePlaceSelect = useCallback(
    (lat: number, lon: number, name: string, bbox: [string, string, string, string]) => {
      setPlaceName(name);
      mapRef.current?.flyTo(lat, lon, bbox);
    },
    []
  );

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
    const y = yearFromDate(newDate);
    const currentYear = new Date().getFullYear();
    setIsLatestMode(y >= currentYear);
  }, []);

  const handleLatestClick = useCallback(() => {
    const today = getYesterday();
    setDate(today);
    setIsLatestMode(true);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="sat-page">
      {/* ── Top Header Bar ── */}
      <header className="sat-header">
        <div className="sat-header-brand">
          <Satellite size={20} className="sat-header-icon" />
          <span className="sat-header-title">Satellite History Viewer</span>
          <span className="sat-header-sub">Powered by Esri Wayback</span>
        </div>
        <div className="sat-header-search">
          <PlaceSearchBar onSelect={handlePlaceSelect} />
        </div>
      </header>

      {/* ── Error Banner (fetch failures) ── */}
      {error && (
        <div className="sat-error-banner" role="alert">
          <AlertTriangle size={14} />
          <span>Unable to load Wayback releases: {error}</span>
        </div>
      )}

      {/* ── Map Area ── */}
      <main className="sat-map-area">
        {/* Loading overlay — shown while releasing data is being fetched */}
        {isLoading && (
          <div className="sat-loading-overlay">
            <div className="sat-loading-card">
              <Loader2 size={28} className="sat-loading-spinner" />
              <span className="sat-loading-text">Loading Wayback imagery releases…</span>
            </div>
          </div>
        )}

        {/* Map — always mounted; tileUrl is undefined until sourceConfig is ready */}
        <SatelliteMap
          ref={mapRef}
          tileUrl={sourceConfig?.url ?? ''}
          maxzoom={sourceConfig?.maxzoom ?? 18}
          coords={null}
        />

        {/* Floating Info Panel */}
        <div className="sat-info-overlay">
          <InfoPanel
            placeName={placeName}
            date={date}
            layer="Esri World Imagery"
            releaseDate={release?.date}
          />
        </div>
      </main>

      {/* ── Bottom Slider Bar ── */}
      <footer className="sat-footer">
        <YearSlider
          date={date}
          onDateChange={handleDateChange}
          isLatestMode={isLatestMode}
          onLatestClick={handleLatestClick}
        />
      </footer>
    </div>
  );
}
