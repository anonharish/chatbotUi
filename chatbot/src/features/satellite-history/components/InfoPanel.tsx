import { MapPin, Satellite, Clock, Database, ExternalLink, CalendarCheck } from 'lucide-react';
import { yearFromDate } from '../utils/gibsUtils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface InfoPanelProps {
  /** Display name of the selected place (from geocoding). */
  placeName: string | null;
  /** User-selected date in YYYY-MM-DD format. */
  date: string;
  /** Source / layer name label. */
  layer: string;
  /**
   * The actual Wayback release date matched to the user's selected date.
   * May differ from `date` since releases don't exist for every calendar day.
   * When provided, shown as a secondary "Release" row below the selected date.
   */
  releaseDate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDisplayDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── InfoPanel ────────────────────────────────────────────────────────────────

export function InfoPanel({ placeName, date, layer, releaseDate }: InfoPanelProps) {
  const year = yearFromDate(date);
  const formattedDate = formatDisplayDate(date);

  // Only show release date row when it differs from the selected date
  const showReleaseDate = releaseDate && releaseDate !== date;
  const formattedReleaseDate = releaseDate ? formatDisplayDate(releaseDate) : null;

  return (
    <div className="info-panel">
      {/* ── Location ── */}
      <div className="info-panel-row">
        <MapPin size={14} className="info-panel-icon info-panel-icon--blue" />
        <span className="info-panel-value info-panel-place">
          {placeName ?? 'Search a location…'}
        </span>
      </div>

      {/* ── Selected Date ── */}
      <div className="info-panel-row">
        <Clock size={14} className="info-panel-icon info-panel-icon--purple" />
        <span className="info-panel-value">{formattedDate}</span>
      </div>

      {/* ── Actual Release Date (when it differs) ── */}
      {showReleaseDate && (
        <div className="info-panel-row">
          <CalendarCheck size={14} className="info-panel-icon info-panel-icon--green" />
          <span className="info-panel-value info-panel-release">
            Release: {formattedReleaseDate}
          </span>
        </div>
      )}

      {/* ── Sensor / Source ── */}
      <div className="info-panel-row">
        <Satellite size={14} className="info-panel-icon info-panel-icon--cyan" />
        <span className="info-panel-value">{layer}</span>
      </div>

      {/* ── Archive Year Badge ── */}
      <div className="info-panel-badge-row">
        <span className="info-badge info-badge--archive">
          <Database size={10} />
          Archive ({year})
        </span>
      </div>

      {/* ── Attribution ── */}
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
