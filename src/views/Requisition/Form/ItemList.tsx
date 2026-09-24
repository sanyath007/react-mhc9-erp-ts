import React, { useState } from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { currency } from '../../../utils'
import ModalAddItemDesc from '../../../components/Modals/AddItemDesc'

const ItemList = ({ items, showButtons=true, onEditItem, onRemoveItem, onUpdateDesc }: any) => {
    const [item, setItem] = useState<any>(null);
    const [showModalAddItemDesc, setShowModalAddItemDesc] = useState(false);

    return (
        <>
            <table className="table table-bordered table-striped text-sm mb-2">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th>รายการ</th>
                        <th className="w-[12%] text-center">ราคาต่อหน่วย</th>
                        <th className="w-[8%] text-center">จำนวน</th>
                        <th className="w-[10%] text-center">หน่วยนับ</th>
                        <th className="w-[15%] text-center">รวมเป็นเงิน</th>
                        {showButtons && <th className="w-[10%] text-center">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {items && items.map((data, index) => (
                        <tr className="font-thin" key={data.id}>
                            <td className="text-center">{index+1}</td>
                            <td>
                                <p className="text-sm font-semibold">
                                    {data.item?.name}
                                    <span className="text-gray-600 font-thin ml-1">({data.item?.category?.name})</span>
                                </p>
                                {data.description ? (
                                    <p className="text-xs text-indigo-500 font-thin">
                                        {data.description}

                                        <button type="button" className="btn btn-link btn-sm p-0 text-xs ml-2 text-gray-500 no-underline" onClick={() => {
                                            setItem(data);
                                            setShowModalAddItemDesc(true);
                                        }}>
                                            <i className="far fa-edit mr-0.5"></i>แก้ไข
                                        </button>
                                    </p>
                                ) : (
                                    <button type="button" className="btn btn-link btn-sm p-0 text-xs no-underline" onClick={() => {
                                        setItem(data);
                                        setShowModalAddItemDesc(true);
                                    }}>
                                        <i className="far fa-plus-square mr-0.5"></i>เพิ่มรายละเอียด
                                    </button>
                                )}
                            </td>
                            <td className="text-center">{currency.format(data.price)}</td>
                            <td className="text-center">{currency.format(data.amount)}</td>
                            <td className="text-center">{data.unit?.name}</td>
                            <td className="text-right">{currency.format(data.total)}</td>
                            {showButtons && (
                                <td className="text-center">
                                    <button type="button" className="btn btn-outline-warning btn-sm px-1 mr-1" onClick={() => onEditItem(data)}>
                                        <FaPencilAlt />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm px-1"
                                        onClick={() => onRemoveItem(data.id, !data.requisition_id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalAddItemDesc
                isShow={showModalAddItemDesc}
                onHide={() => setShowModalAddItemDesc(false)}
                value={item?.description}
                onSetValue={(desc) => {
                    setItem({ ...item, description: desc });
                    onUpdateDesc(item.id, desc);

                }}
            />
        </>
    )
}

export default ItemList
