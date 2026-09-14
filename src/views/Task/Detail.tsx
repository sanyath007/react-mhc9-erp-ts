import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { FaEdit, FaRegCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { getTask, resetSuccess } from '../../features/slices/task/taskSlice'
import { toShortTHDate } from '../../utils'
import TaskHandlingForm from './Handling/Form'
import TaskHandlingDetail from './Handling/Detail'
import Loading from '../../components/ui/Loading'

const TaskDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { task, isSuccess, isLoading } = useSelector((state: any) => state.task);
    const [isHandle, setIsHandle] = useState(false);

    useEffect(() => {
        dispatch(getTask({ id }));
    }, [dispatch, id]);

    /** On handling is success */
    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกการดำเนินการเรียบร้อยแล้ว!!');

            dispatch(resetSuccess());
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/task' }}>รายการแจ้งปัญหา/แจ้งซ่อม</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดแจ้งปัญหา/แจ้งซ่อม : {id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl font-bold flex flex-row items-center">
                    <FaEdit className='text-warning' />
                    <span className="ml-1">รายละเอียดแจ้งปัญหา/แจ้งซ่อม : {id}</span>
                </h2>

                <div className="my-2 border py-3 px-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {!isLoading && task && (
                        <div>
                            <Row className="mb-2">
                                <Col md={2}>
                                    <label>วันที่แจ้ง</label>
                                    <div className="form-control text-center text-sm font-thin min-h-[34px]">
                                        {toShortTHDate(task.task_date)}
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <label>เวลาที่แจ้ง</label>
                                    <div className="form-control text-center text-sm font-thin min-h-[34px]">
                                        {task.task_time}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label>ประเภทปัญหา</label>
                                    <div className="form-control text-sm font-thin">
                                        {task.group?.type?.name}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label>กลุ่มอาการ</label>
                                    <div className="form-control text-sm font-thin">
                                        {task.group?.name}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={2}>
                                    <label>วันที่จะใช้งาน</label>
                                    <div className="form-control text-center text-sm font-thin min-h-[34px]">
                                        {toShortTHDate(task.use_date)}
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <label>เวลาที่จะใช้งาน</label>
                                    <div className="form-control text-center text-sm font-thin min-h-[34px]">
                                        {task.use_time}
                                    </div>
                                </Col>
                                <Col>
                                    <label>ผู้แจ้ง</label>
                                    <div className="form-control text-sm font-thin min-h-[34px]">
                                        {task.reporter && `${task.reporter?.prefix?.name}${task.reporter?.firstname} ${task.reporter?.lastname}`}
                                    </div>
                                </Col>
                                <Col>
                                    <label>ความเร่งด่วน</label>
                                    <div className="form-control text-sm font-thin">
                                        {task.priority_id === 1 && <span className="badge rounded-pill text-bg-success">ปกติ</span>}
                                        {task.priority_id === 2 && <span className="badge rounded-pill text-bg-info">ด่วน</span>}
                                        {task.priority_id === 3 && <span className="badge rounded-pill text-bg-warning">ด่วนมาก</span>}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col>
                                    <label>รายละเอียดปัญหา</label>
                                    <div className="form-control text-sm font-thin min-h-[60px]">
                                        {task.problem}
                                    </div>
                                </Col>
                                <Col>
                                    <label>หมายเหตุ</label>
                                    <div className="form-control text-sm font-thin min-h-[60px]">
                                        {task.remark}
                                    </div>
                                </Col>
                            </Row>

                            <div className="border pt-2 px-2 rounded-md">
                                <h3 className="mb-1">รายการพัสดุ (ถ้ามี)</h3>
                                <table className="table table-bordered text-sm">
                                    <thead>
                                        <tr>
                                            <th className="w-[5%] text-center">#</th>
                                            <th className="w-[20%] text-center">หมายเลขพัสดุ</th>
                                            <th>รายการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {task.assets.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center font-thin">
                                                    <span className="text-red-500">-- ยังไม่มีข้อมูล --</span>
                                                </td>
                                            </tr>
                                        )}
                                        {task.assets && task.assets.map((asset, index) => (
                                            <tr key={asset.id} className="font-thin">
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{asset.asset?.asset_no}</td>
                                                <td>
                                                    <p className="font-semibold">{asset.asset?.category?.name}</p>
                                                    {asset.asset?.name}
                                                    <span className="ml-1"><b>ยี่ห้อ</b> {asset.asset?.brand?.name}</span>
                                                    <span className="ml-1"><b>ปีที่ซื้อ</b> {asset.asset.first_year ? asset.asset.first_year : '-'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {(!isLoading && task?.repairations?.length > 0) && (
                                <div className={`alert ${task?.repairations[0]?.status === 4 ? 'alert-success' : 'alert-warning'} p-2 mt-2 mb-0`}>
                                    <i className="fas fa-info-circle text-lg mr-2"></i>
                                    {task?.repairations[0]?.status === 4
                                        ? 'รายการส่งซ่อมได้รับการส่งมอบแล้ว!!'
                                        : 'รายการส่งซ่อมอยู่ระหว่างรอซ่อม!!'
                                    }
                                </div>
                            )}

                            <div className="my-2 text-right">
                                {(!isHandle && ![2].some(st => st === task?.status)) && (
                                    <button className="btn btn-primary text-sm" onClick={() => setIsHandle(true)}>
                                        ดำเนินการ
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {(isHandle || [2].some(st => st === task?.status)) && (
                    <div className="my-2 border py-3 px-4 rounded-md">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-xl font-bold mb-2">การดำเนินการ (สำหรับฝ่ายไอที)</h2>
                            {[2].some(st => st === task?.status) && <span className="text-success"><FaRegCheckCircle /></span>}
                        </div>

                        {[2].some(st => st === task?.status)
                            ? <TaskHandlingDetail task={task} />
                            : <TaskHandlingForm task={task} onCancel={() => setIsHandle(false)} />
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskDetail