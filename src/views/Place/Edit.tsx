import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getPlace, resetSuccess } from '../../features/slices/place/placeSlice'
import PlaceForm from './Form'
import Loading from '../../components/ui/Loading'

const EditPlace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { place, isLoading, isSuccess } = useSelector((state: any) => state.place);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลสถานที่เรียบร้อยแล้ว!!')
            dispatch(resetSuccess());

            navigate('/place');
        }
    }, [dispatch, isSuccess]);

    useEffect(() => {
        if (id) {
            dispatch(getPlace(id));
        }
    }, [id]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/place' }}>รายการสถานที่</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขสถานที่</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">แก้ไขสถานที่</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}

                    {!isLoading && place && <PlaceForm id={id} place={place} />}
                </div>
            </div>
        </div>
    )
}

export default EditPlace