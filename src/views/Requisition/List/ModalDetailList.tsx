import React from 'react'
import { Modal } from 'react-bootstrap'
import { currency } from '../../../utils'

const ModalDetailList = ({ isShow, onHide, items }: any) => {
    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>รายการพัสดุ</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-1">
                <div>
                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>รายการพัสดุ</th>
                                <th className="text-center w-[8%]">จำนวน</th>
                                <th className="text-center w-[10%]">ราคา</th>
                                <th className="text-center w-[15%]">รวมเป็นเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items && items.map((item, index) => (
                                <tr key={item.id} className="font-thin">
                                    <td className="text-center">{index+1}</td>
                                    <td>
                                        <p className="text-xs">{item.item?.category?.name}</p>
                                        <p className="text-sm">{item.item?.name}</p>
                                        {item.description && <span className="text-red-500">({item.description})</span>}
                                    </td>
                                    <td className="text-center">{currency.format(item.amount)}</td>
                                    <td className="text-right">{currency.format(item.price)}</td>
                                    <td className="text-right">{currency.format(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className="p-1">
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={onHide}>
                    ปิด
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDetailList
