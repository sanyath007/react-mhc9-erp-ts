import React from 'react'
import { currency } from '../../../utils';

const OrderItems = ({ items = [], showButtons = false }: any) => {
    return (
        <div>
            <table className="table table-bordered text-sm mb-2">
                <thead>
                    <tr>
                        <th className="text-center w-[5%]">#</th>
                        <th>รายการ</th>
                        <th className="text-center w-[12%]">ราคาต่อหน่วย</th>
                        <th className="text-center w-[8%]">จำนวน</th>
                        <th className="text-center w-[12%]">รวมเป็นเงิน</th>
                        {showButtons && <th className="text-center w-[11%]">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {items && items.length === 0 && (
                        <tr className="font-thin text-center">
                            <td colSpan={6}><span className="text-red-400">-- ยังไม่มีรายการ --</span></td>
                        </tr>
                    )}
                    {items && items.length > 0 && items.map((item, index) => (
                        <tr className="font-thin" key={item.id}>
                            <td className="text-center">{index+1}</td>
                            <td>
                                {item.item.name}
                                {item.description && <p className="text-xs text-red-500">{item.description}</p>}
                            </td>
                            <td className="text-right">{currency.format(item.price)}</td>
                            <td className="text-center">{currency.format(item.amount)} {item.unit?.name}</td>
                            <td className="text-right">{currency.format(item.total)}</td>
                            {showButtons && (
                                <td className="text-center">

                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrderItems