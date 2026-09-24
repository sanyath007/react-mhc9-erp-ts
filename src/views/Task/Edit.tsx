import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'
import { getTask } from '../../features/slices/task/taskSlice'
import TaskForm from './Form'

const EditTask = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { task } = useSelector((state: any) => state.task);

    useEffect(() => {
        dispatch(getTask({ id }));
    }, [id]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/task' }}>รายการแจ้งปัญหา</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขรายการแจ้งปัญหา</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
            <h2 className="text-xl font-bold flex flex-row items-center">
                    <FaEdit className='text-warning' />
                    <span>แก้ไขรายการแจ้งปัญหา : {id}</span>
                </h2>

                <TaskForm task={task} />
            </div>
        </div>
    )
}

export default EditTask