import { Outlet, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { Map, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MainLayout() {
    const { user, logout, isLoading } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    // Check if we're on the region-selection page (fullscreen mode)
    // Note: Adjust paths as needed based on new router structure
    const isFullscreenPage = location.pathname === '/region-selection' || location.pathname === '/mapbox-region-selection' || location.pathname === '/dummy'

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen text-foreground relative">
            {/* Global Background Image */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/background.jpg")',
                    // Optional: Add a dark overlay to ensure text readability
                    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)'
                }}
            />

            {/* Header - Transparent */}
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent text-white"
            >
                <div className="container mx-auto px-4 h-14 flex items-center">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-green-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">DA</span>
                        </div>
                        <span className="text-xl font-bold text-white">
                            Demo App
                        </span>
                    </div>

                    {/* Breadcrumb for region-selection */}
                    {isFullscreenPage && location.pathname !== '/dummy' && (
                        <div className="ml-4 flex items-center text-sm text-white/60">
                            <span className="mx-2">›</span>
                            <span className="text-white/80">Region Selection</span>
                        </div>
                    )}

                    <nav className="ml-auto flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dummy')}
                            className="text-white hover:bg-white/10"
                        >
                            Test Page
                        </Button>

                        {!isFullscreenPage && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/region-selection')}
                                title="Open 3D Map"
                                className="text-white hover:bg-white/10"
                            >
                                <Map className="h-5 w-5" />
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => logout()}
                            className="text-white hover:bg-white/10"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className={`flex-1 ${isFullscreenPage ? 'pt-14' : 'container mx-auto px-4 py-6 pt-20'}`}>
                <Outlet />
            </main>
        </div>
    )
}
