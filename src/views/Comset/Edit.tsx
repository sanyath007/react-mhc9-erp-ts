import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getComset, resetSuccess } from '../../features/slices/comset/comsetSlice'
import ComsetForm from './Form'
import Loading from '../../components/ui/Loading'

const EditComset = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { comset, isLoading, isSuccess } = useSelector((state: any) => state.comset);

    useEffect(() => {
        if (id) {
            dispatch(getComset(id));
        }
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetSuccess());
            dispatch(getComset(id));

            toast.success('แก้ไขชุดคอมพิวเตอร์สำเร็จ!!');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/comset' }}>ชุดคอมพิวเตอร์</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขชุดคอมพิวเตอร์</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขชุดคอมพิวเตอร์ (#{id})</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && comset) && <ComsetForm comset={comset} />}
                </div>
            </div>
        </div>
    )
}

export default EditComset
