import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { toShortTHDate } from '../../../../utils'

const ConsiderationDetail = ({ approval }: any) => {
    return (
        <Row>
            <Col md={4}>
                <label htmlFor="">เลขที่รายงาน</label>
                <div className="text-sm font-semibold">
                    {approval.consider_no}
                </div>
            </Col>
            <Col md={4}>
                <label htmlFor="">วันที่รายงาน</label>
                <div className="text-sm font-semibold">
                    {toShortTHDate(approval.consider_date)}
                </div>
            </Col>
            <Col md={4}>
                <label htmlFor="">วันที่ประกาศผู้ชนะ</label>
                <div className="text-sm font-semibold">
                    {toShortTHDate(approval.notice_date)}
                </div>
            </Col>
            <Col md={12} className="mt-2">
                <label htmlFor="">ผู้ขาย/ผู้จัดจำหน่าย</label>
                <div className="text-sm">
                    <span className='font-semibold'>{approval.supplier?.name}</span>
                    <span className="ml-2"><b>เลขประจำตัวผู้เสียภาษี</b> <span className="font-semibold">{approval.supplier?.tax_no}</span></span>
                </div>
            </Col>
        </Row>
    )
}

export default ConsiderationDetail