import { navItems } from './nav.config'
import { NavItem } from './NavItem'
import { useNavigation } from './useNavigation'

export function Sidebar() {
    const { handleNavigate, checkIsActive } = useNavigation()

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
            {navItems.map((item) => (
                <NavItem
                    key={item.label}
                    item={item}
                    isActive={checkIsActive(item.path)}
                    onClick={() => handleNavigate(item.path)}
                />
            ))}
        </div>
    )
}
