// Types for Region Selection feature

export interface DistrictProperties {
  // CDN GeoJSON format (from udit-001/india-maps-data)
  dt_code?: string  // District code
  st_code?: string  // State code
  st_nm?: string    // State name
  year?: string     // Census year
  // All-India GeoJSON format
  district?: string
  statecode?: string
  objectid?: string
  dist_code?: string
  D_CODE?: string
  remarks?: string | null
  // Old AP-specific format (for backward compatibility)
  district_name?: string
  district_id?: string
  NEW_DIST?: string
}

export interface Region {
  id: string
  name: string
  color: string
  districts: Set<string>
  regionalOfficer: string
  intelligentOfficer: string
  state: string // Track which state this region belongs to
}

export interface DistrictData {
  id: string
  name: string
  state?: string
}
