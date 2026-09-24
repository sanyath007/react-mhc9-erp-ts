import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import DropdownMenu from './DropdownMenu';
import './DropdownButton.css'

const DropdownContext = createContext<any>({});

export function useDropdownContext() {
    return useContext(DropdownContext);
}

const DropdownButton = ({ title, btnColor, cssClass, children }: any) => {
    const menuRef = useRef<any>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => document.removeEventListener("mousedown", handler)
    }, []);

    return (
        <div className={`c9-dropdown-wrapper ${cssClass}`} ref={menuRef}>
            <div className={`btn btn-${btnColor} btn-sm p-0`} onClick={() => setOpen(!open)}>
                <div className="flex flex-row items-center">
                    <div className="pl-3 py-1">
                        {title}
                    </div>
                    <div className="h-full px-2">
                        <i className="fas fa-caret-down"></i>
                    </div>
                </div>
            </div>
            <DropdownContext.Provider value={{ open, setOpen }}>
                <DropdownMenu>
                        {children}
                </DropdownMenu>
            </DropdownContext.Provider>
        </div>
    )
}

export default DropdownButton