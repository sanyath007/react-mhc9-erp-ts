import React from 'react'
import { currency } from '../../../utils';
import ReceiveButton from './ReceiveButton';

const OrderItems = ({ items = [], onReceiveItem }: any) => {
    return (
        <div>
            <table className="table table-bordered table-striped text-sm mb-2">
                <thead>
                    <tr>
                        <th className="text-center w-[5%]">#</th>
                        <th>รายการ</th>
                        <th className="text-center w-[12%]">ราคาต่อหน่วย</th>
                        <th className="text-center w-[8%]">จำนวน</th>
                        <th className="text-center w-[12%]">รวมเป็นเงิน</th>
                        <th className="text-center w-[8%]">Actions</th>
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
                            <td className="text-center">{currency.format(item.amount)}</td>
                            <td className="text-right">{currency.format(item.total)}</td>
                            <td className="text-center">
                                <ReceiveButton
                                    id={item.id}
                                    isReceived={item.is_received === 1}
                                    onReceive={(id, received) => onReceiveItem(id, received)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrderItems