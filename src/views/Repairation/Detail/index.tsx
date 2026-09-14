import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { toShortTHDate } from '../../../utils'
import { getRepairation } from '../../../features/slices/repairation/repairationSlice'
import RepairationForm from './Form';
import Repairation from './Repairation'
import Loading from '../../../components/ui/Loading';

const RepairationDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { repairation, isLoading } = useSelector((state: any) => state.repairation);

    useEffect(() => {
        dispatch(getRepairation(id));
    }, [dispatch, id]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/repairation' }}>รายการส่งซ่อม</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดการส่งซ่อม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายละเอียดการส่งซ่อม</h2>

                <div className="my-2 border py-3 px-4 rounded-md bg-green-200">
                    {isLoading && <div className="text-center"><Loading /></div>}

                    {!isLoading && repairation && (
                        <>
                            <Row>
                                <Col>
                                    <p className="text-sm font-thin mb-1">
                                        <span className="mr-2">
                                            <b className="mr-1">วันที่ส่งซ่อม</b>
                                            {toShortTHDate(repairation.request_date)}
                                        </span>
                                        <span className="mr-2">
                                            <b className="mr-1">เวลาที่ส่งซ่อม</b>
                                            {repairation.request_time}
                                        </span>
                                    </p>
                                    <p className="text-sm font-thin">
                                        <span className="mr-2">
                                            <b className="mr-1">กำหนดส่งมอบ</b>
                                            {toShortTHDate(repairation.deliver_date)}
                                        </span>
                                        <span className="mr-2">
                                            <b className="mr-1">ผู้ส่งซ่อม</b>
                                            {repairation.requester.prefix?.name}{repairation.requester.firstname} {repairation.requester.lastname}
                                        </span>
                                    </p>
                                    <div>
                                        <b>หมายเหตุ</b>
                                        <div className="form-control text-sm font-thin min-h-[60px]">
                                            {repairation.remark}
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <h4 className="mb-1">รายละเอียดปัญหา</h4>
                                    <div className="form-control text-sm font-thin min-h-[104px]">
                                        <p>
                                            <span className="mr-2">
                                                <b className="mr-1">วันที่แจ้ง</b>
                                                {toShortTHDate(repairation.task.task_date)}
                                            </span>
                                            <span className="mr-2">
                                                <b className="mr-1">เวลาที่แจ้ง</b>
                                                {repairation.task.task_time}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="mr-2">
                                                {repairation.task.reporter.prefix?.name}{repairation.task.reporter.firstname} {repairation.task.reporter.lastname}
                                            </span>
                                            <b className="mr-1">แจ้ง</b>
                                            {repairation.task.problem}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}
                </div>

                <div className="my-2 border py-3 px-4 rounded-md">
                    <h3 className="text-xl font-bold mb-2">บันทึกซ่อม</h3>

                    {[4, 9].some(chk => repairation?.status === chk)
                        ? <Repairation repairation={repairation} />
                        : <RepairationForm repairation={repairation} />
                    }
                </div>
            </div>
        </div>
    )
}

export default RepairationDetail
