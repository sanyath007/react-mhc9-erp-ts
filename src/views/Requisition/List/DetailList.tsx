import React, { useState } from 'react'
import ModalDetailList from './ModalDetailList'

const DetailList = ({ items }: any) => {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className="detail__list-container">
            <ul className="overflow-hidden text-xs font-thin">
                {items && items.map((item, index) => {
                    if (index < 2) {
                        return (
                            <li key={item.id} className="break-words">
                                <span className="mr-1">{index+1}.{item.item?.name}</span>
                                {item.description && <span className="text-red-500">({item.description})</span>}
                            </li>
                        )
                    }
                })}
            </ul>
            {items.length > 2 && (
                <span className="cursor-pointer hover:underline p-1 text-xs" onClick={() => setShowAll(true)}>
                    ดูเพิ่มเติม <i className="fas fa-arrow-circle-right"></i>
                </span>
            )}

            <ModalDetailList
                isShow={showAll}
                onHide={() => setShowAll(false)}
                items={items}
            />
        </div>
    )
}

export default DetailList