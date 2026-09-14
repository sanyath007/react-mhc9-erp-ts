import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/employee/employeeSlice'
import EmployeeForm from './Form'

const AddEmployee = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.employee);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลบุคลากรสำเร็จ!!");
            dispatch(resetSuccess());
            navigate('/employee');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/employee" }}>บุคลากร</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มบุคลากรใหม่</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">เพิ่มบุคลากรใหม่</h2>

                <div className="my-2 border p-4 rounded-md">
                    <EmployeeForm />
                </div>
            </div>
        </div>
    )
}

    export default AddEmployee
