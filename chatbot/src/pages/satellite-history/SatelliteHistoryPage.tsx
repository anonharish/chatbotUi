import { useState, useRef, useCallback } from 'react';
import { Satellite } from 'lucide-react';
import { PlaceSearchBar } from '@/features/satellite-history/components/PlaceSearchBar';
import { YearSlider } from '@/features/satellite-history/components/YearSlider';
import { InfoPanel } from '@/features/satellite-history/components/InfoPanel';
import { SatelliteMap, type SatelliteMapHandle } from '@/features/satellite-history/components/SatelliteMap';
import {
  getYesterday,
  yearFromDate,
  getSourceConfig,
} from '@/features/satellite-history/utils/gibsUtils';
import '@/features/satellite-history/satellite-history.css';

export default function SatelliteHistoryPage() {
  const [date, setDate] = useState<string>(getYesterday());
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [isLatestMode, setIsLatestMode] = useState(true);
  const mapRef = useRef<SatelliteMapHandle>(null);

  const sourceConfig = getSourceConfig(date);

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

      {/* ── Map ── */}
      <main className="sat-map-area">
        <SatelliteMap 
          ref={mapRef} 
          tileUrl={sourceConfig.url} 
          maxzoom={sourceConfig.maxzoom} 
          coords={null} 
        />

        {/* Floating Info Panel */}
        <div className="sat-info-overlay">
          <InfoPanel
            placeName={placeName}
            date={date}
            layer="Esri World Imagery"
            isLatestMode={isLatestMode}
            sourceMode="refined"
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
