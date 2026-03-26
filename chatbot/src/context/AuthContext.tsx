// import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// type UserRole = 'role_manager' | 'super_admin'

// interface User {
//     name: string
//     email: string
//     role: UserRole
// }

// interface AuthContextType {
//     user: User | null
//     login: (username: string, password: string, role: UserRole) => Promise<boolean>
//     logout: () => void
//     isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [user, setUser] = useState<User | null>(null)
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user')
//         if (storedUser) {
//             try {
//                 setUser(JSON.parse(storedUser))
//             } catch (e) {
//                 console.error("Failed to parse user from local storage", e)
//                 localStorage.removeItem('user')
//             }
//         }
//         setIsLoading(false)
//     }, [])

//     const login = async (
//         username: string,
//         password: string,
//         role: UserRole
//     ): Promise<boolean> => {
//         if (username === 'testuser' && password === '123456') {
//             const userObj: User = {
//                 name: 'Test User',
//                 email: 'test@example.com',
//                 role,
//             }
//             setUser(userObj)
//             localStorage.setItem('user', JSON.stringify(userObj))
//             return true
//         }
//         return false
//     }

//     const logout = () => {
//         setUser(null)
//         localStorage.removeItem('user')
//     }

//     return (
//         <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export function useAuth() {
//     const context = useContext(AuthContext)
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider')
//     }
//     return context
// }

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type UserRole = 'role_manager' | 'super_admin'

interface User {
    name: string
    email: string
    role: UserRole
}

interface AuthContextType {
    user: User | null
    login: (username: string, password: string, role: UserRole) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
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

    const login = async (
    email: string,
    password: string,
    role: UserRole
): Promise<boolean> => {
    // Role is already verified in LoginForm before this is called
    const userObj: User = {
        name: role === 'super_admin' ? 'Super Admin' : 'Role Manager',
        email,
        role,
    }
    setUser(userObj)
    localStorage.setItem('user', JSON.stringify(userObj))
    return true
}

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
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