import {
    DashboardIcon,
    UserIcon,
    MapIcon,
    SettingsIcon
} from '@/assets/icons'

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
        path: '/mapbox-region-selection',
    },
    {
        icon: SettingsIcon,
        label: 'Settings',
        path: '/settings',
    },
]
