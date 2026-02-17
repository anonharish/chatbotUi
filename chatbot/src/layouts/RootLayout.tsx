import { Outlet, useLocation, useNavigate } from 'react-router'
import { Map } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Check if we're on the region-selection page (fullscreen mode)
  const isFullscreenPage = location.pathname === '/region-selection' || location.pathname === '/mapbox-region-selection' || location.pathname === '/'
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Glassmorphic for fullscreen pages */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isFullscreenPage 
            ? 'bg-black/30 backdrop-blur-md border-b border-white/10' 
            : 'bg-background/95 backdrop-blur border-b border-border supports-[backdrop-filter]:bg-background/60'
        }`}
      >
        <div className={`flex h-14 items-center ${isFullscreenPage ? 'px-6' : 'container mx-auto px-4'}`}>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">DA</span>
            </div>
            <span className={`text-xl font-bold ${isFullscreenPage ? 'text-white' : ''}`}>
              Demo App
            </span>
          </div>
          
          {/* Breadcrumb for region-selection */}
          {isFullscreenPage && (
            <div className="ml-4 flex items-center text-sm text-white/60">
              <span className="mx-2">›</span>
              <span className="text-white/80">Region Selection</span>
            </div>
          )}
          
          <nav className="ml-auto flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/region-selection')} 
              className={isFullscreenPage ? "text-white hover:bg-white/10" : ""}
              title="Open 3D Map"
            >
               <Map className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content - No padding for fullscreen pages */}
      <main className={isFullscreenPage 
        ? 'pt-14' // Only add padding-top for fixed header
        : 'container mx-auto px-4 py-6 pt-20'
      }>
        <Outlet />
      </main>
    </div>
  )
}
