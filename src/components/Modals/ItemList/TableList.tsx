import React from 'react'
import { currency } from '../../../utils'
import Item from '../../Item/Item';

const TableList = ({ items, pager, onHide, onSelect }: any) => {
    return (
        <div>
            <table className="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th className="text-center w-[5%]">#</th>
                        <th>รายการสินค้า</th>
                        <th className="text-center w-[15%]">ราคา</th>
                        <th className="text-center w-[8%]">เลือก</th>
                    </tr>
                </thead>
                <tbody>
                    {items && items.map((item, index) => (
                        <tr key={item.id}>
                            <td className="text-center">{index+pager.from}</td>
                            <td><Item item={item} /></td>
                            <td className="text-center">
                                <span className="text-red-500">{currency.format(item.price)}</span> บาท
                            </td>
                            <td className="text-center">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => {
                                        onHide();
                                        onSelect(item);
                                    }}
                                >
                                    เลือก
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableList
