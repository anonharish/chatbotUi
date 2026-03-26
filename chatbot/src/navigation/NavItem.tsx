import { Button } from '@/components/ui/button'

interface INavItem {
    icon: any
    label: string
    path: string
}

interface NavItemProps {
    item: INavItem
    isActive: boolean
    onClick: () => void
}

export function NavItem({ item, isActive, onClick }: NavItemProps) {
    const Icon = item.icon
    const isLucideIcon = typeof Icon === 'function'

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`rounded-full h-12 w-12 border transition-all duration-300 shadow-lg flex items-center justify-center ${isActive
                    ? 'bg-white/10 text-brand-lime border-brand-lime scale-110 shadow-[0_0_15px_rgba(228,255,125,0.3)]'
                    : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white hover:scale-110'
                }`}
            onClick={onClick}
            title={item.label}
        >
            {isLucideIcon ? (
                <Icon
                    className={`h-6 w-6 transition-colors duration-300 ${isActive ? 'text-brand-lime' : 'text-white'}`}
                />
            ) : (
                <img
                    src={Icon}
                    alt={item.label}
                    className={`h-6 w-6 transition-colors duration-300 ${isActive ? 'brightness-100 sepia-0 hue-rotate-[50deg] saturate-[500%]' : ''}`}
                    style={isActive ? { filter: 'drop-shadow(0 0 2px rgba(228,255,125,0.5))' } : {}}
                />
            )}
        </Button>
    )
}