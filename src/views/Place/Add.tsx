import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/place/placeSlice'
import PlaceForm from './Form'

const AddPlace = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.place);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลสถานที่เรียบร้อยแล้ว!!')
            dispatch(resetSuccess());

            navigate('/place');
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/place' }}>รายการสถานที่</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มสถานที่ใหม่</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">เพิ่มสถานที่ใหม่</h2>

                <div className="my-2 border p-4 rounded-md">
                    <PlaceForm />
                </div>
            </div>
        </div>
    )
}

export default AddPlace