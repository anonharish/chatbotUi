import { Outlet, Navigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'

export default function FullScreenLayout() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Main content without header/sidebar/padding */}
            <main className="w-full h-full">
                <Outlet />
            </main>
        </div>
    )
}
