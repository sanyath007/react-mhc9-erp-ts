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
                    <th className="w-[10%] text-center">ยอดใช้จริง</th>
                    <th className="w-[10%] text-center">คงเหลือ</th>
                    {showButtons && <th className="w-[10%] text-center">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {orders && orders.map((order, index) => (
                    <tr className="font-thin" key={order.contract_detail_id}>
                        <td className="text-center">{index+1}</td>
                        <td>
                            <p className="text-gray-500 font-thin">
                                {order.contract_detail?.expense?.name}
                                {order.description && (
                                    <span className="text-xs text-red-500 font-thin">
                                        {order.description && <span>({order.description})</span>}
                                    </span>
                                )}
                                <span className="ml-1 font-semibold">งบประมาณที่ยืม {currency.format(order.contract_detail?.total)} บาท</span>
                            </p>
                        </td>
                        <td className="text-right">{currency.format(order.total)}</td>
                        <td className="text-right">
                            {order.contract_detail?.total - order.total < 0 && <span className="text-red-600 font-bold">
                                {currency.format(order.contract_detail?.total - order.total)}
                            </span>}
                            {order.contract_detail?.total - order.total >= 0 && <span className="text-green-600 font-bold">
                                {currency.format(order.contract_detail?.total - order.total)}
                            </span>}
                        </td>
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
                                    onClick={() => onRemove(order.id, !order.refund_id)}
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
