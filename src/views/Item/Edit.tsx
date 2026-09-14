import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getItem, resetSuccess, resetUploaded } from '../../features/slices/item/itemSlice'
import ItemForm from './Form'
import Loading from '../../components/ui/Loading'

const EditItem = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { item, isSuccess, isUploaded, isLoading } = useSelector((state: any) => state.item);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกการแก้ไขข้อมูลสินค้าเรียบร้อยแล้ว!!")
            dispatch(resetSuccess());
            navigate('/item');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isUploaded) {
            toast.success('อัพโหลดไฟล์เรียบร้อยแล้ว!!');
            dispatch(resetUploaded());
        }
    }, [isUploaded]);

    useEffect(() => {
        dispatch(getItem(id));
    }, [dispatch, id])

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/item' }}>รายการสินค้า/บริการ</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขสินค้า/บริการใหม่</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขสินค้า/บริการใหม่ ID : {id}</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading
                        ? <div className="flex justify-center"><Loading /></div>
                        : <ItemForm item={item} />
                    }
                </div>
            </div>
        </div>
    )
}

export default EditItem
