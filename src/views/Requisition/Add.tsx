import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/requisition/requisitionSlice'
import RequisitionForm from './Form'

const AddRequisition = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.requisition);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลคำขอเรียบร้อยแล้ว!!')
            dispatch(resetSuccess());

            navigate('/requisition');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/requisition' }}>รายการคำขอซื้อ/จ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มคำขอซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">เพิ่มคำขอซื้อ/จ้าง</h2>

                <div className="my-2 border p-4 rounded-md">
                    <RequisitionForm />
                </div>
            </div>
        </div>
    )
}

export default AddRequisition
