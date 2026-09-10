import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FaSearch, FaPencilAlt, FaTrash } from 'react-icons/fa'
import { getTasks, destroy, resetDeleted } from '../../features/slices/task/taskSlice'
import { getPriority, toShortTHDate, generateQueryString } from '../../utils'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'
import TaskStatusBadge from '../../components/Task/StatusBadge'
import TaskFilteringInputs from '../../components/Task/FilteringInputs'
import { toast } from 'react-toastify'

const initialFilters = {
    date: '',
    reporter: '',
    type: '',
    status: ''
};

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, pager, isLoading, isDeleted } = useSelector(state => state.task);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (isDeleted) {
            dispatch(resetDeleted());
            toast.success('ลบข้อมูลสำเร็จ!!');

            setApiEndpoint(prev => prev !== '' ? '' : `/api/tasks/search?page=`);
        }
    }, [isDeleted]);

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getTasks({ url: `/api/tasks/search` }));
        } else {
            dispatch(getTasks({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handleFilter = (queryStr) => {
        setParams(queryStr);

        setApiEndpoint(`/api/tasks/search?page=`);
    };

    const handleDelete = (id) => {
        if (window.confirm(`คุณต้องการลบข้อมูลแจ้งปัญหารหัส ${id} ใช่หรือไม่?`)) {
            dispatch(destroy(id));
        }
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการแจ้งปัญหา</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายการแจ้งปัญหา</h2>

                <div>
                    <TaskFilteringInputs initialFilters={initialFilters} onFilter={handleFilter} />

                    <TaskStatusBadge params={params} onClick={handleFilter} />

                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="w-[5%] text-center">#</th>
                                <th className="w-[12%] text-center">วันที่แจ้ง</th>
                                <th>รายละเอียดปัญหา</th>
                                <th className="w-[8%] text-center">ความเร่งด่วน</th>
                                <th className="w-[22%]">ผู้แจ้ง</th>
                                <th className="w-[8%] text-center">สถานะ</th>
                                <th className="w-[10%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="text-center"><Loading /></td>
                                </tr>
                            )}
                            {(!isLoading && tasks) && tasks.map((task, index) => (
                                <tr key={task.id} className="font-thin">
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td className="text-center">
                                        <p className="text-sm">{toShortTHDate(task.task_date)}</p>
                                        <p className="text-sm font-thin"><b className="mr-1">เวลา</b>{task.task_time}</p>
                                    </td>
                                    <td>
                                        <p>
                                            <b className="mr-1">{task.group?.type?.name}</b>
                                            <span className="font-thin">({task.group?.name})</span>
                                        </p>
                                        <p className="text-xs text-red-500 font-thin">{task.problem}</p>
                                        <p className="text-xs text-gray-500 font-thin">
                                            <b className="mr-1">ต้องการใช้วันที่</b>{toShortTHDate(task.use_date)}
                                        </p>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge rounded-pill text-bg-success">
                                            {getPriority(task.priority_id)?.name}
                                        </span>
                                    </td>
                                    <td>
                                        {`${task.reporter?.prefix?.name}${task.reporter?.firstname} ${task.reporter?.lastname}`}
                                        <p><b>{`${task.reporter?.position?.name}${task.reporter?.level ? task.reporter?.level?.name : ''}`}</b></p>
                                    </td>
                                    <td className="text-center">
                                        {task.status === 1 && <span className="badge rounded-pill text-bg-secondary">รอดำเนินการ</span>}
                                        {task.status === 2 && <span className="badge rounded-pill text-bg-success">เสร็จแล้ว</span>}
                                        {task.status === 3 && <span className="badge rounded-pill text-bg-primary">เสร็จ (ชั่วคราว)</span>}
                                        {task.status === 4 && <span className="badge rounded-pill text-bg-warning">ส่งซ่อม</span>}
                                        {task.status === 9 && <span className="badge rounded-pill text-bg-danger">ยกเลิก</span>}
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/task/${task.id}/detail`} className="btn btn-sm btn-info mr-1">
                                            <FaSearch size={'12px'} />
                                        </Link>
                                        <Link to={`/task/${task.id}/edit`} className="btn btn-sm btn-warning mr-1">
                                            <FaPencilAlt size={'12px'} />
                                        </Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>
                                            <FaTrash size={'12px'} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pager={pager}
                    onPageClick={(url) => setApiEndpoint(url)}
                />
            </div>
        </div>
    )
}

export default TaskList