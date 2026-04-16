import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Region, FieldOfficer } from './types';

interface RegionContextState {
  regions: Region[];
  addRegion: (region: Region) => void;
  deleteRegion: (regionId: string) => void;
  updateRegionOfficers: (regionId: string, officers: FieldOfficer[]) => void;
}

const RegionContext = createContext<RegionContextState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mapbox_regions_state';

const loadRegionsFromStorage = (): Region[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((r: any) => ({
      ...r,
      districtIds: new Set(r.districtIds || [])
    }));
  } catch (error) {
    console.error('Failed to load regions from storage:', error);
    return [];
  }
};

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [regions, setRegions] = useState<Region[]>(loadRegionsFromStorage);

  useEffect(() => {
    try {
      const serializable = regions.map(r => ({
        ...r,
        districtIds: Array.from(r.districtIds)
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save regions to storage:', error);
    }
  }, [regions]);

  const addRegion = (region: Region) => {
    setRegions((prev) => [...prev, region]);
  };

  const deleteRegion = (regionId: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== regionId));
  };

  const updateRegionOfficers = (regionId: string, customOfficers: FieldOfficer[]) => {
    setRegions((prev) => 
      prev.map((r) => {
        if (r.id === regionId) {
          return { ...r, fieldOfficers: customOfficers };
        }
        return r;
      })
    );
  };

  return (
    <RegionContext.Provider value={{ regions, addRegion, deleteRegion, updateRegionOfficers }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegionContext = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegionContext must be used within a RegionProvider');
  }
  return context;
};
