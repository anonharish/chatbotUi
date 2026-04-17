import { useCallback } from 'react';
import { Radio } from 'lucide-react';
import {
  MIN_YEAR,
  MAX_YEAR,
  MONTH_LABELS,
  getDefaultDate,
  yearFromDate,
  monthFromDate,
  getYesterday,
} from '../utils/gibsUtils';

interface YearSliderProps {
  date: string;               // YYYY-MM-DD currently selected
  onDateChange: (date: string) => void;
  isLatestMode: boolean;
  onLatestClick: () => void;
}

export function YearSlider({ date, onDateChange, isLatestMode, onLatestClick }: YearSliderProps) {
  const selectedYear = yearFromDate(date);
  const selectedMonth = monthFromDate(date);
  const currentYear = MAX_YEAR;
  const totalYears = currentYear - MIN_YEAR;

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const year = parseInt(e.target.value, 10);
      const newDate = getDefaultDate(year, selectedMonth);
      onDateChange(newDate);
    },
    [selectedMonth, onDateChange]
  );

  const handleMonthClick = useCallback(
    (monthIndex: number) => {
      const month = monthIndex + 1;
      if (selectedYear >= currentYear) {
        // Current year: use yesterday regardless of month choice
        onDateChange(getYesterday());
        return;
      }
      const mm = String(month).padStart(2, '0');
      onDateChange(`${selectedYear}-${mm}-15`);
    },
    [selectedYear, currentYear, onDateChange]
  );

  const thumbPercent = ((selectedYear - MIN_YEAR) / totalYears) * 100;

  return (
    <div className="year-slider-container">
      {/* Year label + LATEST button */}
      <div className="year-slider-header">
        <span className="year-slider-from">{MIN_YEAR}</span>

        <div className="year-slider-center">
          <div className="year-badge" style={{ left: `${thumbPercent}%` }}>
            {isLatestMode ? 'Today' : selectedYear}
          </div>
        </div>

        {/* LATEST button */}
        <button
          className={`latest-btn ${isLatestMode ? 'latest-btn--active' : ''}`}
          onClick={onLatestClick}
          title="Jump to most recent available imagery"
        >
          <span className={`latest-dot ${isLatestMode ? 'latest-dot--pulse' : ''}`} />
          <Radio size={12} />
          LATEST
        </button>
      </div>

      {/* Range Slider */}
      <div className="year-slider-track-wrapper">
        <span className="year-slider-label-end">{MIN_YEAR}</span>
        <div className="year-slider-track">
          <input
            type="range"
            className="year-slider-input"
            min={MIN_YEAR}
            max={currentYear}
            value={selectedYear}
            onChange={handleYearChange}
            step={1}
          />
          {/* Tick marks every 5 years */}
          <div className="year-slider-ticks">
            {Array.from({ length: Math.floor(totalYears / 5) + 1 }, (_, i) => {
              const tickYear = MIN_YEAR + i * 5;
              if (tickYear > currentYear) return null;
              const pct = ((tickYear - MIN_YEAR) / totalYears) * 100;
              return (
                <span
                  key={tickYear}
                  className={`year-tick ${tickYear === currentYear ? 'year-tick--current' : ''}`}
                  style={{ left: `${pct}%` }}
                  title={String(tickYear)}
                />
              );
            })}
          </div>
        </div>
        <span className="year-slider-label-end">{currentYear}</span>
      </div>

      {/* Month chips */}
      <div className="month-chips">
        {MONTH_LABELS.map((label, i) => {
          const isActive = !isLatestMode && selectedMonth === i + 1;
          const isDisabled = selectedYear >= currentYear;
          return (
            <button
              key={label}
              className={`month-chip ${isActive ? 'month-chip--active' : ''} ${isDisabled ? 'month-chip--disabled' : ''}`}
              onClick={() => !isDisabled && handleMonthClick(i)}
              disabled={isDisabled}
              title={isDisabled ? 'Current year always shows latest imagery' : label}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
