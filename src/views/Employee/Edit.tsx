import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getEmployee, resetSuccess } from '../../features/slices/employee/employeeSlice'
import Loading from '../../components/ui/Loading'
import EmployeeForm from './Form'

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { employee, isLoading, isSuccess } = useSelector((state: any) => state.employee);

    useEffect(() => {
        if (id) dispatch(getEmployee(id));
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกการแก้ไขข้อมูลบุคลากรสำเร็จ!!");
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
                <Breadcrumb.Item active>แก้ไขบุคลากร</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขบุคลากร ID: {id}</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading ? <div className="text-center"><Loading /></div> : <EmployeeForm employee={employee} />}
                </div>
            </div>
        </div>
    )
}

export default EditEmployee
