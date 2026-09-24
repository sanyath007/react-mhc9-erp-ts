import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getSupplier, resetIsSuccess } from '../../features/slices/supplier/supplierSlice'
import SupplierForm from './Form'
import Loading from '../../components/ui/Loading'

const EditSupplier = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { supplier, isLoading, isSuccess } = useSelector((state: any) => state.supplier);

    useEffect(() => {
        if (id) {
            dispatch(getSupplier(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกการแก้ไขข้อมูลผู้จัดจำหน่ายเรียบร้อยแล้ว!!");

            dispatch(resetIsSuccess());

            navigate('/supplier');
        }
    }, [isSuccess, dispatch, navigate]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้นฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/supplier' }}>ผู้จัดจำหน่าย</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขผู้จัดจำหน่าย</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">แก้ไขข้อมูลผู้จัดจำหน่าย ID : {id}</h2>
                    <Link to="/supplier" className="btn btn-sm btn-outline-secondary">
                        ย้อนกลับ
                    </Link>
                </div>

                <div className="my-2 border p-4 rounded-md bg-white">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loading />
                        </div>
                    ) : (
                        supplier && <SupplierForm supplier={supplier} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditSupplier;
