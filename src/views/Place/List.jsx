import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa';
import { getPlaces } from '../../features/slices/place/placeSlice'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'
import FilteringInputs from './FilteringInputs'

const initialFilters = {
    name: '',
    place_type_id: '',
};

const PlaceList = () => {
    const dispatch = useDispatch();
    const { places, pager, isLoading } = useSelector(state => state.place);
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState('');

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getPlaces({ url: `/api/places/search?page=${params}` }));
        } else {
            dispatch(getPlaces({ url: `${endpoint}${params}` }));
        }
    }, [endpoint]);

    const handleDelete = (id) => {

    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการสถานที่</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการสถานที่</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มสถานที่</Link>
                </div>

                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(params) => {
                        setParams(params)
                        setEndpoint(prev => prev === '' ? `/api/places/search?page=` : '');
                    }}
                />

                <div>
                    <table className="table table-bordered text-sm mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>สถานที่</th>
                                <th className="text-center w-[40%]">ที่อยู่</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {places && places.map((place, index) => (
                                <tr key={place?.id} className="font-thin">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td><p className="font-bold">{place?.name}</p></td>
                                    <td>อ.{place?.amphur?.name} จ.{place?.changwat?.name}</td>
                                    <td className="text-center py-1">
                                        {/* <Link to={`/place/${place.id}/detail`} className="btn btn-outline-primary btn-sm px-1">
                                            <FaSearch />
                                        </Link> */}
                                        <Link to={`/place/${place.id}/edit`} className="btn btn-outline-warning btn-sm px-1 m-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm px-1"
                                            onClick={() => handleDelete(place.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setEndpoint(url)}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlaceList