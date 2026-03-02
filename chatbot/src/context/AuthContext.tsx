import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
// import { useNavigate } from 'react-router' // Note: This might cause issues if used outside Router, but context is inside AppLayout
// However, Router context is usually outside.
// Wait, Router -> AppLayout -> AuthProvider?
// Or: AppLayout (contains AuthProvider) -> Router?
// Usually: Router -> Layout.
// If AuthProvider needs navigation, it needs to be inside Router.
// So: Router -> AppLayout (AuthProvider) -> Outlet.

interface User {
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse user from local storage", e)
                localStorage.removeItem('user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (username: string, password: string): Promise<boolean> => {
        // Mock login logic
        if (username === 'testuser' && password === '123456') {
            const userObj = { name: 'Test User', email: 'test@example.com' }
            setUser(userObj)
            localStorage.setItem('user', JSON.stringify(userObj))
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        // Navigation should handle redirection based on auth state
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
