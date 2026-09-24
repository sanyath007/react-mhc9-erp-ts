import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { resetSuccess } from '../../features/slices/comset/comsetSlice'
import ComsetForm from './Form'
import { toast } from 'react-toastify'

const AddComset = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.comset);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetSuccess());

            toast.success('บันทึกชุดคอมพิวเตอร์สำเร็จ!!');
            navigate('/comset');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/comset' }}>ชุดคอมพิวเตอร์</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มชุดคอมพิวเตอร์</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">เพิ่มชุดคอมพิวเตอร์</h2>

                <div className="my-2 border p-4 rounded-md">
                    <ComsetForm />
                </div>
            </div>
        </div>
    )
}

    export default AddComset
