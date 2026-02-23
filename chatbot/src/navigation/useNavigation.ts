import { useNavigate, useLocation } from 'react-router'
// import { INavItem } from './nav.config'

export function useNavigation() {
    const navigate = useNavigate()
    const location = useLocation()

    const handleNavigate = (path: string) => {
        navigate(path)
    }

    const checkIsActive = (path: string) => {
        return location.pathname === path
    }

    return {
        handleNavigate,
        checkIsActive,
    }
}
