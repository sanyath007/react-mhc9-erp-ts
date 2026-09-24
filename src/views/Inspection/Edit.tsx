import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getInspection, resetSuccess } from '../../features/slices/inspection/inspectionSlice'
import InspectionForm from './Form'
import Loading from '../../components/ui/Loading'

const EditInspection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { inspection, isLoading, isSuccess } = useSelector((state: any) => state.inspection);

    useEffect(() => {
        if (id) {
            dispatch(getInspection(id));
        }
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลแก้ไขการตรวจรับเรียบร้อยแล้ว!!");

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
                <Breadcrumb.Item active>แก้ไขตรวจรับพัสดุ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขตรวจรับพัสดุ</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && inspection) && <InspectionForm id={id} inspection={inspection} />}
                </div>
            </div>
        </div>
    )
}

export default EditInspection
