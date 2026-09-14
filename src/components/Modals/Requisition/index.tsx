import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { getRequisitions } from '../../../features/slices/requisition/requisitionSlice';
import { useGetInitialFormDataQuery } from '../../../features/services/requisition/requisitionApi';
import { currency, generateQueryString, toShortTHDate } from '../../../utils';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination';
import FilteringInputs from '../../Requisition/FilteringInputs';

const initialFormData = {
    units: [],
    categories: [],
};

const ModalRequisitionList = ({ isShow, onHide, onSelect }: any) => {
    const [cookie] = useCookies();
    const initialFilters = {
        year: cookie.budgetYear,
        pr_no: '',
        pr_date: '',
        division: '',
        status: '3',
        limit: '5'
    };
    const dispatch = useDispatch<any>();
    const { requisitions, pager, loading } = useSelector((state: any) => state.requisition);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getRequisitions({ url: `/api/requisitions/search?page=${params}` }));
        } else {
            dispatch(getRequisitions({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handleFilter = (queryStr) => {
        setParams(queryStr);
        setApiEndpoint(`/api/requisitions/search?page=${params}`);
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header className="border py-1 px-2">
                <Modal.Title>รายการคำขอ</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-0">
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={handleFilter}
                />

                {loading && (
                    <div className="text-center">
                        <Loading />
                    </div>
                )}

                {!loading && requisitions && (
                    <div className="border rounded-md overflow-hidden mb-2 p-2">
                        <table className="table table-striped table-hover mb-0 border-t-0">
                            <thead>
                                <tr>
                                    <th className="text-center w-[5%]">#</th>
                                    <th>รายการคำขอ</th>
                                    <th className="text-center w-[15%]">งบประมาณ</th>
                                    <th className="text-center w-[10%]">เลือก</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisitions && requisitions.map((requisition, index) => (
                                    <tr key={requisition.id}>
                                        <td className="text-center">{index + pager.from}</td>
                                        <td className="text-sm font-thin">
                                            <p className="flex items-center gap-2">
                                                <span className="flex items-center gap-1">เลขที่ <b className="badge rounded-pill bg-success">{requisition.pr_no}</b></span>
                                                <span className="flex items-center gap-1">วันที่ <b className="badge rounded-pill bg-success">{toShortTHDate(requisition.pr_date)}</b></span>
                                                <span>
                                                    <b>{requisition.requester?.prefix?.name}{requisition.requester?.firstname} {requisition.requester?.lastname}</b>
                                                    <span className="ml-1">{requisition.requester?.position?.name}{requisition.requester?.level && requisition.requester?.level?.name}</span>
                                                </span>
                                            </p>
                                            <p>
                                                <span>{requisition.topic} จำนวน {currency.format(requisition.item_count)} รายการ</span>
                                                <span className="ml-1">รวมเป็นเงิน {currency.format(requisition.net_total)} บาท</span>
                                                <span className="text-xs font-thin text-blue-600 ml-1">
                                                    ตาม{requisition.budget?.activity?.project?.plan?.name}
                                                    <span className="ml-1">{requisition.budget?.activity?.project?.name}</span>
                                                    <span className="ml-1">{requisition.budget?.activity?.name}</span>
                                                </span>
                                            </p>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-red-500">{currency.format(requisition.net_total)}</span> บาท
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    onHide();
                                                    onSelect(requisition);
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
                )}
            </Modal.Body>
            <Modal.Footer className="py-1 px-2">
                <Pagination
                    pager={pager}
                    onPageClick={(url) => setApiEndpoint(url)}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default ModalRequisitionList
