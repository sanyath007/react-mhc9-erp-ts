import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavDropdownMenu, { SubmenuItem } from './NavDropdownMenu'

const matchPath = (path: string, link: string) => {
    return path === link || path.startsWith(link + '/');
};

interface NavMenuItemProps {
    text: string;
    submenus: SubmenuItem[];
    userRole?: number;
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({ text, submenus, userRole }) => {
    const [showDropdown, setShowDropsown] = useState(false);
    const location = useLocation();

    const isActive = submenus.some(menu => {
        if (menu.type === 'menu' && menu.link && matchPath(location.pathname, menu.link)) return true;
        if (menu.type === 'group' && menu.submenus) {
            return menu.submenus.some(child => child.link && matchPath(location.pathname, child.link));
        }
        return false;
    });

    return (
        <li className="menu-item flex relative h-full" onMouseOver={() => setShowDropsown(true)} onMouseLeave={() => setShowDropsown(false)}>
            <button className={`flex items-center gap-1 transition-colors ${isActive ? 'text-blue-400 font-semibold' : 'hover:text-gray-400'}`}>
                {text}
                <i className="fas fa-caret-down"></i>
            </button>
            <NavDropdownMenu
                isShow={showDropdown}
                hide={() => setShowDropsown(false)}
                submenus={submenus}
                userRole={userRole}
                currentPath={location.pathname}
            />
        </li>
    )
}

export default NavMenuItem