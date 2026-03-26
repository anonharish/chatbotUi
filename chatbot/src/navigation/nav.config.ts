// import {
//     DashboardIcon,
//     UserIcon,
//     MapIcon,
//     SettingsIcon
// } from '@/assets/icons'

// export interface INavItem {
//     icon: string
//     label: string
//     path: string
// }

// export const navItems: INavItem[] = [
//     {
//         icon: DashboardIcon,
//         label: 'Dashboard',
//         path: '/dashboardpage',
//     },
//     {
//         icon: UserIcon,
//         label: 'Agents',
//         path: '/directory', 
//     },
//     {
//   icon: MapIcon,
//   label: 'Region Selection',
//   path: '/create-regions-areas',
// },
//     {
//         icon: SettingsIcon,
//         label: 'Settings',
//         path: '/settings', 
//     },
// ]


import { DashboardIcon, UserIcon, MapIcon, SettingsIcon } from '@/assets/icons'
import { Shield } from 'lucide-react'  // ← use lucide directly

export interface INavItem {
    icon: any
    label: string
    path: string
}

export const roleManagerNavItems: INavItem[] = [
    { icon: DashboardIcon, label: 'Dashboard',        path: '/dashboardpage' },
    { icon: UserIcon,      label: 'Agents',           path: '/directory' },
    { icon: MapIcon,       label: 'Region Selection', path: '/create-regions-areas' },
    { icon: SettingsIcon,  label: 'Settings',         path: '/settings' },
]

export const superAdminNavItems: INavItem[] = [
    { icon: DashboardIcon, label: 'Dashboard',       path: '/super-admin' },
    { icon: Shield,        label: 'User Roles',      path: '/UserRoles' },
    { icon: MapIcon,       label: 'Regions & Areas', path: '/create-regions-areas' },
    { icon: SettingsIcon,  label: 'Settings',        path: '/settings' },
]