import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/task/taskSlice'
import TaskForm from './Form'

const AddTask = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.task);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลแจ้งปัญหา/แจ้งซ่อมเรียบร้อยแล้ว!!");

            dispatch(resetSuccess());

            navigate('/task');
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/task' }}>รายการแจ้งปัญหา</Breadcrumb.Item>
                <Breadcrumb.Item active>แจ้งปัญหา</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แจ้งปัญหา</h2>

                <div className="my-2 border p-4 rounded-md">
                    <TaskForm />
                </div>
            </div>
        </div>
    )
}

export default AddTask