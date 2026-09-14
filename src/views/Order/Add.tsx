import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/order/orderSlice'
import OrderForm from './Form'

const AddOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.order);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลการสั่งซื้อ/จ้างเรียบร้อยแล้ว!!");

            dispatch(resetSuccess());

            navigate('/order');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/order' }}>รายการใบสั่งซื้อ/จ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>สร้างคำสั่งซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">สร้างคำสั่งซื้อ/จ้าง</h2>

                <div className="my-2 border p-4 rounded-md">
                    <OrderForm />
                </div>
            </div>
        </div>
    )
}

export default AddOrder
