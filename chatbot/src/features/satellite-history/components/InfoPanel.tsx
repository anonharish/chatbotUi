import { MapPin, Satellite, Clock, Database, ExternalLink } from 'lucide-react';
import { yearFromDate } from '../utils/gibsUtils';

interface InfoPanelProps {
  placeName: string | null;
  date: string;         // YYYY-MM-DD
  layer: string;        // Mode or source name
}

export function InfoPanel({ placeName, date, layer }: InfoPanelProps) {
  const year = yearFromDate(date);

  const formattedDate = new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="info-panel">
      {/* Location */}
      <div className="info-panel-row">
        <MapPin size={14} className="info-panel-icon info-panel-icon--blue" />
        <span className="info-panel-value info-panel-place">
          {placeName ?? 'Search a location…'}
        </span>
      </div>

      {/* Date */}
      <div className="info-panel-row">
        <Clock size={14} className="info-panel-icon info-panel-icon--purple" />
        <span className="info-panel-value">{formattedDate}</span>
      </div>

      {/* Sensor */}
      <div className="info-panel-row">
        <Satellite size={14} className="info-panel-icon info-panel-icon--cyan" />
        <span className="info-panel-value">{layer}</span>
      </div>

      {/* Archive badge */}
      <div className="info-panel-badge-row">
        <span className="info-badge info-badge--archive">
          <Database size={10} />
          Archive ({year})
        </span>
      </div>

      {/* Attribution */}
      <div className="info-panel-attribution">
        <a
          href="https://livingatlas.arcgis.com/wayback"
          target="_blank"
          rel="noopener noreferrer"
          className="info-panel-link"
        >
          Esri Wayback <ExternalLink size={10} />
        </a>
        <span style={{ color: '#475569' }}>· © Esri, World Imagery</span>
      </div>
    </div>
  );
}
