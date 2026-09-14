import React, { useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'

const ItemDesc = ({ item }: any) => {
    const [isShowDesc, setIsShowDesc] = useState(false);

    return (
        <>
            <a
                href="#"
                className="text-xs font-bold underline flex flex-row items-center hover:text-blue-600"
                onClick={() => setIsShowDesc(!isShowDesc)}
            >
                รายละเอียด
                {!isShowDesc ? <FaCaretDown /> : <FaCaretUp />}
            </a>
            <div className={`border rounded-md mb-1 p-2 text-xs min-h-[80px] ${isShowDesc ? '' : 'hidden'}`}>
                <p className="text-gray-400 font-thin">{item.description}</p>
            </div>
        </>
    )
}

export default ItemDesc
