import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/asset/assetSlice'
import MaterialForm from './Form'

const AddMaterial = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { isSuccess } = useSelector((state: any) => state.asset);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลพัสดุเรียบร้อยแล้ว!!');

            dispatch(resetSuccess());

            navigate('/asset');
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item href="/asset">รายการพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มพัสดุใหม่</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">เพิ่มพัสดุใหม่</h2>

                <div className="my-2 border p-4 rounded-md">
                    <MaterialForm />
                </div>
            </div>
        </div>
    )
}

    export default AddMaterial
