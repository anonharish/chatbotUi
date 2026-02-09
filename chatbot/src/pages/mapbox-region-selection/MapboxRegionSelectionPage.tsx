const MapboxRegionSelectionPage = () => {
  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Under Construction Banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Animated Globe Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="text-cyan-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          {/* Construction Icon Overlay */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            >
              <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M17 18h1" />
              <path d="M12 18h1" />
              <path d="M7 18h1" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Mapbox Region Selection
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-white/60 mb-6">
          🚧 Under Construction 🚧
        </p>

        {/* Description */}
        <div className="max-w-md text-center px-4">
          <p className="text-sm text-white/50 mb-4">
            This page will feature an enhanced map experience with dynamic tiles, 
            smooth zooming, and field officer clustering powered by Mapbox GL JS.
          </p>
        </div>

        {/* Feature List */}
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <span className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30">
            📍 Dynamic Tiles
          </span>
          <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30">
            🔍 Sharp Zoom
          </span>
          <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
            👥 Officer Clusters
          </span>
        </div>

        {/* Back Link */}
        <a 
          href="/region-selection" 
          className="mt-8 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all border border-white/20 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Globe View
        </a>
      </div>
    </div>
  )
}

export default MapboxRegionSelectionPage
