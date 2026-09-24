import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/inspection/inspectionSlice'
import InspectionForm from './Form'

const AddInspection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.inspection);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลการตรวจรับเรียบร้อยแล้ว!!");

            dispatch(resetSuccess());

            navigate('/inspection');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/inspection' }}>รายการตรวจรับพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>บันทึกตรวจรับพัสดุ</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">บันทึกตรวจรับพัสดุ</h2>

                <div className="my-2 border p-4 rounded-md">
                    <InspectionForm />
                </div>
            </div>
        </div>
    )
}

export default AddInspection
