import DashboardIcon from '@/assets/icons/dashboard-icon.svg'
import UserIcon from '@/assets/icons/user-icon.svg'
import MapIcon from '@/assets/icons/map-icon.svg'
import SettingsIcon from '@/assets/icons/settings-icon.svg'

export interface INavItem {
    icon: string
    label: string
    path: string
}

export const navItems: INavItem[] = [
    {
        icon: DashboardIcon,
        label: 'Dashboard',
        path: '/dashboard',
    },
    {
        icon: UserIcon,
        label: 'Agents',
        path: '/agents', 
    },
    {
        icon: MapIcon,
        label: 'Region Selection',
        path: '/region-selection',
    },
    {
        icon: SettingsIcon,
        label: 'Settings',
        path: '/settings', 
    },
]
