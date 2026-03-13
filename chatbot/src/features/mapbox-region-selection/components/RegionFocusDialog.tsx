import type { Region } from '../types'

interface RegionFocusDialogProps {
  region: Region
  onClose: () => void
}

export const RegionFocusDialog = ({ region, onClose }: RegionFocusDialogProps) => {
  return (
    <div className="absolute inset-0 z-2000 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div 
        className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
      >
        {/* Header - Colored by Region */}
        <div 
          className="h-24 relative overflow-hidden"
          style={{ backgroundColor: `${region.color}33` }}
        >
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${region.color}, transparent)`,
              mixBlendMode: 'overlay'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6"
                style={{ backgroundColor: region.color }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{region.name}</h2>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{region.state} Operation</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all transform hover:rotate-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Districts</span>
              <span className="text-2xl font-black text-white">{region.districtIds.size}</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Status</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-lg font-bold text-white">Active</span>
              </span>
            </div>
          </div>

          {/* Officers */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Command Personnel
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-cyan-500/20 rounded-2xl group hover:bg-white/10 transition-colors">
                <div>
                  <span className="block text-cyan-400 text-[10px] font-bold">Regional Officer</span>
                  <span className="text-white font-bold">{region.regionalOfficer || 'Not Assigned'}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">
                  {region.regionalOfficer?.charAt(0) || 'RO'}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-purple-500/20 rounded-2xl group hover:bg-white/10 transition-colors">
                <div>
                  <span className="block text-purple-400 text-[10px] font-bold">Intelligence Lead</span>
                  <span className="text-white font-bold">{region.intelligentOfficer || 'Not Assigned'}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                  {region.intelligentOfficer?.charAt(0) || 'IO'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Standard Map View
            </button>
            <button 
              className="px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Region Report
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
