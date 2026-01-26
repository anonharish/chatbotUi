// Types for Region Selection feature

export interface DistrictProperties {
  district_name: string
  district_id: string
  NEW_DIST: string
}

export interface Region {
  id: string
  name: string
  color: string
  districts: Set<string>
  regionalOfficer: string
  intelligentOfficer: string
}

export interface DistrictData {
  id: string
  name: string
}
