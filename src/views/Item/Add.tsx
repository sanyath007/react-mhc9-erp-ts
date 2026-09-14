import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/item/itemSlice'
import ItemForm from './Form'

const AddItem = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.item);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลสินค้า/บริการเรียบร้อยแล้ว!!')
            dispatch(resetSuccess());

            navigate('/item');
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/item' }}>รายการสินค้า/บริการ</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มสินค้า/บริการใหม่</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">เพิ่มสินค้า/บริการใหม่</h2>

                <div className="my-2 border p-4 rounded-md">
                    <ItemForm />
                </div>
            </div>
        </div>
    )
}

    export default AddItem
