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
        path: '/dashboardpage',
    },
    {
        icon: UserIcon,
        label: 'Agents',
        path: '/directory', 
    },
    {
  icon: MapIcon,
  label: 'Region Selection',
  path: '/create-regions-areas',
},
    {
        icon: SettingsIcon,
        label: 'Settings',
        path: '/settings', 
    },
]
