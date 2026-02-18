import { Outlet, Navigate, useNavigate } from 'react-router'
import { GLCLogo as Logo } from '@/assets/icons'
import { useAuth } from '@/context/AuthContext'
import { Map, LogOut } from 'lucide-react'
import { Sidebar } from '@/navigation/Sidebar'
import { Button } from '@/components/ui/button'

export default function MainLayout() {
    const { user, logout, isLoading } = useAuth()
    const navigate = useNavigate()

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
                <div className="w-full px-6 my-4 h-14 flex justify-between items-center" >
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <img src={Logo} alt="Logo" className="h-16 w-auto" />
                    </div>


                    <nav className="ml-auto flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dummy')}
                            className="text-white hover:bg-white/10"
                        >
                            Test Page
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/region-selection')}
                            title="Open 3D Map"
                            className="text-white hover:bg-white/10"
                        >
                            <Map className="h-5 w-5" />
                        </Button>

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
            <Sidebar />

            {/* Main content */}
            <main className="pt-14 w-full h-full">
                <Outlet />
            </main>
        </div>
    )
}
