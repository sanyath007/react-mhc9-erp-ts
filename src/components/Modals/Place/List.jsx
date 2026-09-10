import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap'
import { getPlaces } from '../../../features/slices/place/placeSlice';
import Loading from '../../ui/Loading';
import FilteringInputs from './FilteringInputs';
import Pagination from '../../ui/Pagination'

const initialFilters = {
    name: '',
    place_type_id: '',
};

const ModalPlaceList = ({ isShow, onHide, onSelect }) => {
    const dispatch = useDispatch();
    const { places, pager, isLoading } = useSelector(state => state.place);
    const [params, setParams] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getPlaces({ url: `/api/places/search?page=${params}` }));
        } else {
            dispatch(getPlaces({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton className="py-1 px-2">
                <Modal.Title>รายการสถานที่</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(params) => {
                        setParams(params)
                        setApiEndpoint(prev => prev === '' ? `/api/places/search?page=` : '');
                    }}
                />

                <div className="mt-2">
                    <table className="table table-bordered text-sm mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                {/* <th className="text-center w-[15%]">เลขที่พัสดุ</th> */}
                                <th>สถานที่</th>
                                <th className="text-center w-[35%]">ที่อยู่</th>
                                <th className="text-center w-[8%]">เลือก</th>
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
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(place);
                                                setApiEndpoint('');
                                                setParams('')
                                            }}
                                        >
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pager && (
                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setApiEndpoint(url)}
                    />
                )}
            </Modal.Body>
        </Modal>
    )
}

export default ModalPlaceList