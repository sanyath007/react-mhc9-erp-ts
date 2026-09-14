import React from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { currency } from '../../../utils'

const BudgetTypeList = ({ data, onEditItem, onRemoveItem }: any) => {
    return (
        <div className="wrapper">
            <table className="table table-bordered table-hover table-striped text-sm">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th className="text-left">ประเภทงบประมาณ</th>
                        <th className="w-[20%] text-center">ยอดจัดสรร</th>
                        <th className="w-[10%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) => (
                        <tr key={item.id}>
                            <td className="text-center">{++index}</td>
                            <td className="text-left">{item.type?.name}</td>
                            <td className="text-right">{currency.format(item.total)}</td>
                            <td className="text-center">
                                {item.activity_id && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-warning btn-sm px-1 mr-1"
                                        onClick={() => onEditItem(item)}
                                    >
                                        <FaPencilAlt />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm px-1"
                                    onClick={() => onRemoveItem(item.id, !item.activity_id)}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default BudgetTypeList