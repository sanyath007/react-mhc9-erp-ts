import React from 'react'
import { useDropdownContext } from './'

const DropdownMenu = ({ children }: any) => {
    const { open } = useDropdownContext();

    return (
        <ul className={`c9-dropdown-menu ${open ? 'active' : 'inactive'}`}>
            {children}
        </ul>
    )
}

export default DropdownMenu