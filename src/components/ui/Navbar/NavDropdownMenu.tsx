import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const matchPath = (path: string, link: string) => {
    return path === link || path.startsWith(link + '/');
};

export interface SubmenuItem {
    type?: 'menu' | 'group' | 'divided';
    text?: string;
    link?: string;
    allowed_users?: number[];
    submenus?: SubmenuItem[];
}

interface NavDropdownMenuProps {
    isShow: boolean;
    hide: () => void;
    submenus: SubmenuItem[];
    userRole?: number;
    currentPath: string;
}

const NavDropdownMenu: React.FC<NavDropdownMenuProps> = ({ isShow, hide, submenus, userRole, currentPath }) => {
    return (
        <ul className={`dropdown-menu ${isShow ? 'active' : ''}`}>
            {submenus.map((menu, index) => {
                if (menu.type === 'divided') {
                    return <li key={`div-${index}`}><hr className="dropdown-divider m-0" /></li>;
                }

                if (menu.type === 'group' && menu.submenus) {
                    const hasAllowedChildren = menu.submenus.some(child => 
                        typeof userRole !== 'undefined' && 
                        (!child.allowed_users || child.allowed_users.length === 0 || child.allowed_users.includes(userRole))
                    );

                    if (!hasAllowedChildren) return null;

                    const isGroupActive = menu.submenus.some(child => currentPath && child.link && matchPath(currentPath, child.link));

                    return (
                        <li key={`grp-${index}`} className={`relative group/nested hover:bg-gray-100 ${isGroupActive ? 'bg-blue-50' : ''}`}>
                            <div className="flex justify-between items-center cursor-pointer p-2 w-full text-gray-700">
                                <p className={`w-full m-0 ${isGroupActive ? 'text-blue-600 font-semibold' : ''}`}>{menu.text}</p>
                                <i className={`fas fa-chevron-right text-xs pr-2 ${isGroupActive ? 'text-blue-500' : 'text-gray-400'}`}></i>
                            </div>
                            <ul className="absolute left-[98%] top-0 hidden group-hover/nested:block w-52 bg-white border border-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] rounded-lg z-[60] py-1">
                                {menu.submenus.map((child, cIndex) => {
                                    const isChildAllowed = typeof userRole !== 'undefined' && (!child.allowed_users || child.allowed_users.length === 0 || child.allowed_users.includes(userRole));
                                    if (!isChildAllowed) return null;
                                    const isActive = currentPath && child.link && matchPath(currentPath, child.link);
                                    return (
                                        <li key={`child-${cIndex}`} className={`hover:bg-gray-100 p-2 ${isActive ? 'bg-blue-50' : ''}`}>
                                            <Link to={child.link!} className="block w-full" onClick={hide}>
                                                <p className={`w-full m-0 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>{child.text}</p>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                }

                // Regular menu item
                const isAllowed = typeof userRole !== 'undefined' && (!menu.allowed_users || menu.allowed_users.length === 0 || menu.allowed_users.includes(userRole));
                
                if (isAllowed && menu.link) {
                    const isActive = currentPath && matchPath(currentPath, menu.link);
                    return (
                        <li key={`menu-${index}`} className={`hover:bg-gray-100 p-2 ${isActive ? 'bg-blue-50' : ''}`}>
                            <Link to={menu.link} className="block w-full" onClick={hide}>
                                <p className={`w-full m-0 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>{menu.text}</p>
                            </Link>
                        </li>
                    )
                }

                return null;
            })}
        </ul>
    )
}

export default NavDropdownMenu