import { MapboxVisualization } from './components/MapboxVisualization'

const MapboxRegionSelectionPage = () => {
  return (
    <div 
      className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden"
      style={{ 
        backgroundColor: '#0f172a',  // Dark navy background
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 50%),
          radial-gradient(1px 1px at 20% 30%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 40% 70%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 50% 50%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 80% 20%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 10% 80%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 70% 60%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 30% 10%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 90% 90%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 60% 40%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 15% 55%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 85% 45%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 45% 85%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 25% 95%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 75% 15%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 5% 35%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 95% 75%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 35% 25%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 65% 95%, #fff 0.5px, transparent 0),
          radial-gradient(1px 1px at 55% 5%, #fff 0.5px, transparent 0)
        `,
        backgroundSize: '100% 100%',
      }}
    >
      {/* Globe glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.05) 30%, transparent 60%)',
        }}
      />
      <MapboxVisualization />
    </div>
  )
}

export default MapboxRegionSelectionPage
