import type { Region, DistrictData } from '../types'
import { darkenColor } from '../constants'

interface RegionFormProps {
  selectedDistricts: DistrictData[]
  regionName: string
  regionalOfficer: string
  intelligentOfficer: string
  onRegionNameChange: (name: string) => void
  onRegionalOfficerChange: (name: string) => void
  onIntelligentOfficerChange: (name: string) => void
  onRemoveDistrict: (districtId: string) => void
  onClear: () => void
  onSave: () => void
}

export const RegionForm = ({
  selectedDistricts,
  regionName,
  regionalOfficer,
  intelligentOfficer,
  onRegionNameChange,
  onRegionalOfficerChange,
  onIntelligentOfficerChange,
  onRemoveDistrict,
  onClear,
  onSave,
}: RegionFormProps) => {
  const canSave = regionName.trim() !== '' && selectedDistricts.length > 0

  if (selectedDistricts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md text-center">
        Click on available districts to start creating a new region
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {/* Region Name Input */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
          Region Name *
        </label>
        <input
          type="text"
          value={regionName}
          onChange={(e) => onRegionNameChange(e.target.value)}
          placeholder="Enter region name..."
          className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Regional Officer Input */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
          Regional Officer
        </label>
        <input
          type="text"
          value={regionalOfficer}
          onChange={(e) => onRegionalOfficerChange(e.target.value)}
          placeholder="Enter regional officer name..."
          className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Intelligent Officer Input */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
          Intelligent Officer
        </label>
        <input
          type="text"
          value={intelligentOfficer}
          onChange={(e) => onIntelligentOfficerChange(e.target.value)}
          placeholder="Enter intelligent officer name..."
          className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Selected Districts */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
          Selected Districts ({selectedDistricts.length})
        </label>
        <div className="space-y-2 max-h-32 overflow-auto">
          {selectedDistricts.map((district) => (
            <div
              key={district.id}
              className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
            >
              <span className="text-sm text-purple-800 dark:text-purple-200">
                {district.name}
              </span>
              <button
                onClick={() => onRemoveDistrict(district.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Region
        </button>
      </div>
    </div>
  )
}

interface RegionCardProps {
  region: Region
  getDistrictName: (id: string) => string
  onDelete: (id: string) => void
  onUpdateName: (id: string, name: string) => void
  onUpdateRegionalOfficer: (id: string, officer: string) => void
  onUpdateIntelligentOfficer: (id: string, officer: string) => void
  isEditing: boolean
  onEditStart: (id: string) => void
  onEditEnd: () => void
}

export const RegionCard = ({
  region,
  getDistrictName,
  onDelete,
  onUpdateName,
  onUpdateRegionalOfficer,
  onUpdateIntelligentOfficer,
  isEditing,
  onEditStart,
  onEditEnd,
}: RegionCardProps) => {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        backgroundColor: `${region.color}15`,
        borderColor: `${region.color}40`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: region.color }}
          />
          {isEditing ? (
            <input
              type="text"
              defaultValue={region.name}
              autoFocus
              onBlur={(e) => {
                onUpdateName(region.id, e.target.value)
                onEditEnd()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateName(region.id, e.currentTarget.value)
                  onEditEnd()
                }
              }}
              className="px-2 py-1 text-sm border rounded bg-background"
            />
          ) : (
            <span
              className="font-medium cursor-pointer hover:underline"
              onClick={() => onEditStart(region.id)}
              title="Click to edit name"
            >
              {region.name}
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(region.id)}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
          title="Delete region"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Officers Info */}
      <div className="space-y-1 mb-2 text-xs">
        {region.regionalOfficer && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Regional Officer:</span>
            <input
              type="text"
              value={region.regionalOfficer}
              onChange={(e) => onUpdateRegionalOfficer(region.id, e.target.value)}
              className="flex-1 px-1 py-0.5 border rounded bg-background text-xs"
            />
          </div>
        )}
        {region.intelligentOfficer && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Intelligent Officer:</span>
            <input
              type="text"
              value={region.intelligentOfficer}
              onChange={(e) => onUpdateIntelligentOfficer(region.id, e.target.value)}
              className="flex-1 px-1 py-0.5 border rounded bg-background text-xs"
            />
          </div>
        )}
        {!region.regionalOfficer && !region.intelligentOfficer && (
          <span className="text-muted-foreground">No officers assigned</span>
        )}
      </div>

      {/* State Name */}
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {region.state}
      </div>

      {/* Districts Count */}
      <div className="text-xs text-muted-foreground mb-2">
        {region.districts.size} district{region.districts.size !== 1 ? 's' : ''}
      </div>

      {/* Districts Preview */}
      <div className="flex flex-wrap gap-1">
        {Array.from(region.districts)
          .slice(0, 5)
          .map((districtId) => (
            <span
              key={districtId}
              className="px-2 py-0.5 text-xs rounded"
              style={{
                backgroundColor: `${region.color}30`,
                color: darkenColor(region.color, 40),
              }}
            >
              {getDistrictName(districtId)}
            </span>
          ))}
        {region.districts.size > 5 && (
          <span className="px-2 py-0.5 text-xs text-muted-foreground">
            +{region.districts.size - 5} more
          </span>
        )}
      </div>
    </div>
  )
}
