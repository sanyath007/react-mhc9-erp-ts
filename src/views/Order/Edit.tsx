import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getOrder, resetSuccess } from '../../features/slices/order/orderSlice'
import OrderForm from './Form'
import Loading from '../../components/ui/Loading'

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { order, isLoading, isSuccess } = useSelector((state: any) => state.order);

    useEffect(() => {
        if (id) {
            dispatch(getOrder(id));
        }
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลแก้ไขการสั่งซื้อ/จ้างเรียบร้อยแล้ว!!");

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
                <Breadcrumb.Item active>แก้ไขคำสั่งซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขคำสั่งซื้อ/จ้าง</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && order) && <OrderForm id={id} order={order} />}
                </div>
            </div>
        </div>
    )
}

export default EditOrder
