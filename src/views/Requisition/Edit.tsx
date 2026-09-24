import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getRequisition, resetSuccess } from '../../features/slices/requisition/requisitionSlice'
import RequisitionForm from './Form'
import Loading from '../../components/ui/Loading'

const EditRequisition = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { requisition, isLoading, isSuccess } = useSelector((state: any) => state.requisition);

    useEffect(() => {
        if (id) dispatch(getRequisition({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกการแก้ไขข้อมูลสำเร็จ!!');

            dispatch(resetSuccess());
            dispatch(getRequisition({ id }));
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/requisition' }}>รายการคำขอซื้อ/จ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขคำขอซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขคำขอซื้อ/จ้าง (#{id})</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}

                    {!isLoading && <RequisitionForm requisition={requisition} />}
                </div>
            </div>
        </div>
    )
}

export default EditRequisition
