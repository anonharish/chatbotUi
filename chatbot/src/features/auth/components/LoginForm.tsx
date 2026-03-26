// import { useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
// import { toast } from 'sonner'

// export function LoginForm() {
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')
//     const [isLoading, setIsLoading] = useState(false)
//     const { login } = useAuth()

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setIsLoading(true)
//         try {
//             const success = await login(username, password)
//             if (success) {
//                 toast.success("Login successful")
//             } else {
//                 toast.error("Invalid credentials. Please try again.")
//             }
//         } catch (error) {
//             toast.error("An error occurred during login")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <Card className="w-full max-w-sm mx-auto shadow-lg">
//             <CardHeader className="space-y-1">
//                 <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
//                 <CardDescription className="text-center">
//                     Enter your credentials to access the account
//                 </CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//                 <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="username">Username</Label>
//                         <Input
//                             id="username"
//                             placeholder="Enter username (testuser)"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="password">Password</Label>
//                         <Input
//                             id="password"
//                             type="password"
//                             placeholder="Enter password (123456)"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                 </CardContent>
//                 <CardFooter>
//                     <Button type="submit" className="w-full" disabled={isLoading}>
//                         {isLoading ? "Signing in..." : "Sign In"}
//                     </Button>
//                 </CardFooter>
//             </form>
//         </Card>
//     )
// }
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card, CardHeader, CardContent, CardFooter,
    CardTitle, CardDescription
} from '@/components/ui/card'
import { toast } from 'sonner'

type UserRole = 'role_manager' | 'super_admin'

// Hardcoded credentials — not visible to user
const CREDENTIALS: Record<string, { password: string; role: UserRole }> = {
    'manager@glc.com': { password: 'manager123', role: 'role_manager' },
    'admin@glc.com':   { password: 'admin123',   role: 'super_admin' },
}

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const match = CREDENTIALS[email.toLowerCase().trim()]

            if (!match || match.password !== password) {
                toast.error("Invalid credentials. Please try again.")
                return
            }

            // Role is auto-detected from the email — never shown to user
            const success = await login(email, password, match.role)

            if (success) {
                toast.success("Login successful")
            } else {
                toast.error("Login failed. Please try again.")
            }
        } catch {
            toast.error("An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-sm mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access the account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}