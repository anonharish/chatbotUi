import { useState, useRef, useCallback } from 'react';
import { Satellite, ShieldAlert } from 'lucide-react';
import { PlaceSearchBar } from '@/features/satellite-history/components/PlaceSearchBar';
import { YearSlider } from '@/features/satellite-history/components/YearSlider';
import { InfoPanel } from '@/features/satellite-history/components/InfoPanel';
import { SatelliteMap, type SatelliteMapHandle } from '@/features/satellite-history/components/SatelliteMap';
import { useGEETiles } from '@/features/satellite-history/hooks/useGEETiles';
import {
  yearFromDate,
} from '@/features/satellite-history/utils/gibsUtils';
import '@/features/satellite-history/satellite-history.css';

export default function SatelliteGEEPage() {
  const [date, setDate] = useState<string>('2023-06-15');
  const [placeName, setPlaceName] = useState<string | null>(null);
  const mapRef = useRef<SatelliteMapHandle>(null);

  const year = yearFromDate(date);
  const { tileUrl, attribution, isLoading, error } = useGEETiles(year);

  const handlePlaceSelect = useCallback(
    (lat: number, lon: number, name: string, bbox: [string, string, string, string]) => {
      setPlaceName(name);
      mapRef.current?.flyTo(lat, lon, bbox);
    },
    []
  );

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
  }, []);

  const handleLatestClick = useCallback(() => {
    setDate('2024-06-15');
  }, []);

  return (
    <div className="sat-page">
      <header className="sat-header">
        <div className="sat-header-left">
          <Satellite size={20} className="sat-header-icon" />
          <h1 className="sat-header-title">Google Earth Historical View</h1>
        </div>
        <div className="sat-header-search">
          <PlaceSearchBar onPlaceSelect={handlePlaceSelect} />
        </div>
      </header>

      <main className="sat-map-area">
        {error ? (
          <div className="gee-error-overlay">
            <ShieldAlert size={48} />
            <h2>Backend Offline</h2>
            <p>{error}</p>
            <code>cd gee-backend && npm start</code>
          </div>
        ) : (
          <SatelliteMap 
            ref={mapRef} 
            tileUrl={tileUrl || ''} 
            maxzoom={18}
            coords={null} 
          />
        )}

        <div className="sat-info-overlay">
          <InfoPanel
            placeName={placeName}
            date={date}
            layer={attribution}
          />
        </div>
      </main>

      <footer className="sat-footer">
        <YearSlider
          date={date}
          onDateChange={handleDateChange}
          isLatestMode={year >= 2024}
          onLatestClick={handleLatestClick}
        />
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .gee-error-overlay {
          position: absolute;
          inset: 0;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #f8fafc;
          z-index: 100;
          text-align: center;
          padding: 20px;
        }
        .gee-error-overlay h2 { margin: 16px 0 8px; color: #ef4444; }
        .gee-error-overlay code { background: #1e293b; padding: 4px 8px; border-radius: 4px; margin-top: 12px; }
      `}} />
    </div>
  );
}
