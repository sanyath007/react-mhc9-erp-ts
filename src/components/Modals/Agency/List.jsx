import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap'
import { getAgencies } from '../../../features/slices/agency/agencySlice';
import FilteringInputs from './FilteringInputs';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination'

const initialFilters = {
    name: '',
    status: '',
    limit: 10,
};

const ModalAgencyList = ({ isShow, onHide, onSelect }) => {
    const dispatch = useDispatch();
    const { agencies, pager, isLoading } = useSelector(state => state.agency);
    const [params, setParams] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getAgencies({ url: `/api/agencies/search?page=${params}` }));
        } else {
            dispatch(getAgencies({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton className="py-1 px-2">
                <Modal.Title>รายการหน่วยงาน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(params) => {
                        setParams(params);
                        setApiEndpoint(prev => prev === '' ? '/api/agencies/search?page=' : '');
                    }}
                />

                <div className="mt-2">
                    <table className="table table-bordered text-sm mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>หน่วยงาน</th>
                                {/* <th className="text-center w-[35%]">ที่อยู่</th> */}
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
                            {agencies && agencies.map((agency, index) => (
                                <tr key={agency?.id} className="font-thin">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td><p className="font-bold">{agency?.name}</p></td>
                                    {/* <td>อ.{agency?.amphur?.name} จ.{agency?.changwat?.name}</td> */}
                                    <td className="text-center py-1">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(agency);
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

export default ModalAgencyList