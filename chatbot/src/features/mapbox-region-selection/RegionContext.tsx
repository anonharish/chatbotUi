import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Region, FieldOfficer } from './types';

interface RegionContextState {
  regions: Region[];
  addRegion: (region: Region) => void;
  deleteRegion: (regionId: string) => void;
  updateRegionOfficers: (regionId: string, officers: FieldOfficer[]) => void;
}

const RegionContext = createContext<RegionContextState | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [regions, setRegions] = useState<Region[]>([]);

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
