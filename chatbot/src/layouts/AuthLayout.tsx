// import { Navigate, Outlet } from 'react-router'
// import { useAuth } from '@/context/AuthContext'

// export default function AuthLayout() {
//     const { user, isLoading } = useAuth()

//     if (isLoading) {
//         return <div className="flex h-screen items-center justify-center">Loading...</div>
//     }

//     if (user) {
//         return <Navigate to="/dashboard" replace />
//     }

//     return (
//         <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
//             <div className="w-full max-w-md p-8">
//                 <Outlet />
//             </div>
//         </div>
//     )
// }
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/context/AuthContext'

export default function AuthLayout() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (user) {
        // Redirect to role-specific dashboard instead of generic /dashboard
        const home = user.role === 'super_admin' ? '/super-admin' : '/dashboardpage'
        return <Navigate to={home} replace />
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8">
                <Outlet />
            </div>
        </div>
    )
}