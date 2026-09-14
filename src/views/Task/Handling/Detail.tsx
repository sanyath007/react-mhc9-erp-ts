import React from 'react'
import { Col, Row } from 'react-bootstrap';
import moment from 'moment'
import { toShortTHDate } from '../../../utils';
import Loading from '../../../components/ui/Loading';

const TaskHandlingDetail = ({ task }) => {
    return (
        <>
            <Row className="mb-2">
                <Col md={2}>
                    <label>วันที่ดำเนินการ</label>
                    <div className="form-control text-center text-sm font-thin min-h-[34px]">
                        {toShortTHDate(task.handle_date)}
                    </div>
                </Col>
                <Col md={2}>
                    <label>เวลาที่ดำเนินการ</label>
                    <div className="form-control text-center text-sm font-thin min-h-[34px]">
                        {task.handle_time}
                    </div>
                </Col>
                <Col>
                    <label htmlFor="">ผู้ดำเนินการ</label>
                    <div className="form-control text-sm font-thin min-h-[34px]">
                        {task.handler && task.handler.prefix?.name + task.handler.firstname + ' ' + task.handler.lastname}
                    </div>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col>
                    <label htmlFor="">สาเหตุของปัญหา</label>
                    <div className="form-control text-sm font-thin min-h-[75px]">
                        <b>{task.cause?.name}</b>
                        {task.cause_text && <p className="text-red-500 text-xs">{task.cause_text}</p>}
                    </div>
                </Col>
                <Col>
                    <label>รายละเอียดการดำเนินการ</label>
                    <div className="form-control text-sm font-thin min-h-[75px]">
                        {task.handling}
                    </div>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col>
                    <label htmlFor="">ประเภทงาน</label>
                    <div className="form-control text-sm font-thin min-h-[34px]">
                        {task.handle_type_id === 1 && <span className="badge rounded-pill text-bg-secondary">ซ่อม</span>}
                        {task.handle_type_id === 2 && <span className="badge rounded-pill text-bg-secondary">บำรุงรักษา</span>}
                        {task.handle_type_id === 3 && <span className="badge rounded-pill text-bg-secondary">สร้าง</span>}
                        {task.handle_type_id === 4 && <span className="badge rounded-pill text-bg-secondary">แก้ไข</span>}
                    </div>
                </Col>
                <Col>
                    <label htmlFor="">สถานะ</label>
                    <div className="form-control text-sm font-thin mr-1">
                        {task.status === 1 && <span className="badge rounded-pill text-bg-secondary">รอดำเนินการ</span>}
                        {task.status === 2 && <span className="badge rounded-pill text-bg-success">เสร็จแล้ว</span>}
                        {task.status === 3 && <span className="badge rounded-pill text-bg-info">สั่งซื้ออะไหล่</span>}
                        {task.status === 4 && <span className="badge rounded-pill text-bg-warning">ส่งซ่อมภายนอก</span>}
                        {task.status === 9 && <span className="badge rounded-pill text-bg-danger">ยกเลิก</span>}
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default TaskHandlingDetail
