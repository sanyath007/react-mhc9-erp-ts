import React, { useState } from 'react'
import ModalPreviewImage from '../Modals/PreviewImage'

const Item = ({ item }: any) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex flex-row">
            <ModalPreviewImage
                isShow={showModal}
                onHide={() => setShowModal(false)}
                title="ภาพสินค้า"
                url={`${process.env.REACT_APP_API_URL}/uploads/${item?.img_url}`}
            />

            {![3,4].includes(item?.category?.asset_type_id) && (
                <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${item?.img_url}`}
                    alt="item-img"
                    className="w-[80px] h-auto border rounded-sm mr-2 hover:cursor-pointer hover:opacity-50 transition-opacity delay-100"
                    onClick={() => setShowModal(true)}
                />
            )}
            <div>
                <p className="text-sm text-gray-400">{item?.category?.name}</p>
                <p className="text-sm">
                    {item?.name} |
                    หน่วยนับ : <span className="font-thin">{item.unit?.name}</span>
                </p>
                <p className="text-xs text-gray-400 font-thin">{item?.description}</p>
            </div>
        </div>
    )
}

export default Item
