import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, MapPin, Loader2, Satellite } from 'lucide-react';
import { useGeocoding, type GeocodingResult } from '../hooks/useGeocoding';

interface PlaceSearchBarProps {
  onSelect: (lat: number, lon: number, displayName: string, bbox: [string, string, string, string]) => void;
}

export function PlaceSearchBar({ onSelect }: PlaceSearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, isLoading, error, search, clearResults } = useGeocoding();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setSelectedName('');
      if (val.trim().length >= 2) {
        search(val);
        setOpen(true);
      } else {
        clearResults();
        setOpen(false);
      }
    },
    [search, clearResults]
  );

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      setSelectedName(result.display_name);
      setQuery(result.display_name.split(',')[0]); // short label in input
      setOpen(false);
      clearResults();
      onSelect(
        parseFloat(result.lat),
        parseFloat(result.lon),
        result.display_name,
        result.boundingbox
      );
    },
    [onSelect, clearResults]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSelectedName('');
    clearResults();
    setOpen(false);
  }, [clearResults]);

  const showDropdown = open && (results.length > 0 || isLoading || !!error);

  return (
    <div ref={containerRef} className="satellite-search-wrapper">
      {/* Input */}
      <div className="satellite-search-bar">
        <span className="satellite-search-icon">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" style={{ color: '#60a5fa' }} />
          ) : selectedName ? (
            <Satellite size={16} style={{ color: '#34d399' }} />
          ) : (
            <Search size={16} style={{ color: '#94a3b8' }} />
          )}
        </span>

        <input
          type="text"
          className="satellite-search-input"
          placeholder="Search a place — city, country, landmark…"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button className="satellite-search-clear" onClick={handleClear} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul className="satellite-search-dropdown">
          {isLoading && (
            <li className="satellite-search-item satellite-search-loading">
              <Loader2 size={14} className="animate-spin" />
              <span>Searching…</span>
            </li>
          )}
          {error && !isLoading && (
            <li className="satellite-search-item satellite-search-error">{error}</li>
          )}
          {!isLoading && results.map((r) => (
            <li
              key={r.place_id}
              className="satellite-search-item satellite-search-option"
              onMouseDown={() => handleSelect(r)}
            >
              <MapPin size={13} style={{ flexShrink: 0, color: '#60a5fa' }} />
              <span className="satellite-search-result-text">{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
