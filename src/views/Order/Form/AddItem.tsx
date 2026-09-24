import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import ModalItemList from '../../../components/Modals/ItemList';

const AddItem = () => {
    const [showItemModal, setShowItemModal] = useState(false);

    return (
        <div className="flex flex-row mb-2">
            <ModalItemList
                isShow={showItemModal}
                onHide={() => setShowItemModal(false)}
            />

            <div className="input-group">
                <input
                    type="text"
                    className="form-control text-sm"
                    placeholder="รายการ"
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowItemModal(true)}>
                    <FaSearch />
                </button>
            </div>
            <input
                type="text"
                className="form-control text-sm w-[18%] ml-1"
                placeholder="ราคาต่อหน่วย"
            />
            <input
                type="text"
                className="form-control text-sm w-[12%] ml-1"
                placeholder="จำนวน"
            />
            <input
                type="text"
                className="form-control text-sm w-[18%] ml-1"
                placeholder="รวมเป็นเงิน"
            />
            <div className="flex flex-row w-[15%]">
                <button className="btn btn-outline-primary btn-sm ml-1">Add</button>
                <button className="btn btn-outline-danger btn-sm ml-1">clear</button>
            </div>
        </div>
    )
}

export default AddItem