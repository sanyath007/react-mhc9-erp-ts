import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetIsSuccess } from '../../features/slices/supplier/supplierSlice'
import SupplierForm from './Form'

const AddSupplier = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.supplier);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลผู้จัดจำหน่ายเรียบร้อยแล้ว!!");

            dispatch(resetIsSuccess());

            navigate('/supplier');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/supplier' }}>ผู้จัดจำหน่าย</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มผู้จัดจำหน่าย</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">เพิ่มผู้จัดจำหน่าย</h2>

                <div className="my-2 border p-4 rounded-md">
                    <SupplierForm />
                </div>
            </div>
        </div>
    )
}

export default AddSupplier