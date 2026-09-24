import React, { Fragment } from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { currency, replaceExpensePatternFromDesc } from '../../../utils'

const OrderList = ({ orders, showButtons=true, edittingItem, onEdit, onRemove }: any) => {
    return (
        <table className="table table-bordered table-striped table-hover text-sm mb-2">
            <thead>
                <tr>
                    <th className="w-[5%] text-center">#</th>
                    <th>รายการ</th>
                    <th className="w-[15%] text-center">รวมเป็นเงิน</th>
                    {showButtons && <th className="w-[10%] text-center">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {orders && orders.map((order, index) => (
                    <tr className="font-thin" key={order.id}>
                        <td className="text-center">{index+1}</td>
                        <td>
                            <p className="text-gray-500 font-thin">
                                {order.expense?.name}
                                {order.description && (
                                    <span className="text-xs text-red-500 font-thin">
                                        {order.description && <span>({order.description})</span>}
                                    </span>
                                )}
                            </p>
                        </td>
                        <td className="text-right">{currency.format(order.total)}</td>
                        {showButtons && (
                            <td className="text-center">
                                {/* {(!edittingItem || edittingItem?.id !== order.id) && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning mr-1 p-1"
                                        onClick={() => onEdit(order)}
                                    >
                                        <FaPencilAlt />
                                    </button>
                                )} */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger p-1"
                                    onClick={() => onRemove(order.id, order.loan_id === '')}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default OrderList
