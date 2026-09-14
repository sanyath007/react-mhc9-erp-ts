import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAsset, resetSuccess } from '../../features/slices/asset/assetSlice'
import AssetForm from './Form'
import Loading from '../../components/ui/Loading';

const EditAsset = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { asset, isLoading, isSuccess } = useSelector((state: any) => state.asset);

    useEffect(() => {
        dispatch(getAsset({ id }));
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกการแก้ไขข้อมูลพัสดุเรียบร้อยแล้ว!!');

            dispatch(resetSuccess());

            navigate('/asset');
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/asset' }}>รายการพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl font-bold flex flex-row items-center">
                    <FaEdit className='text-warning' />
                    <span>แก้ไขพัสดุ : {id}</span>
                </h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {!isLoading && asset && <AssetForm id={id} asset={asset} />}
                </div>
            </div>
        </div>
    )
}

export default EditAsset
