import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useCookies } from 'react-cookie'
import { currency, toShortTHDate, generateQueryString } from '../../../utils';
import { getOrders } from '../../../features/slices/order/orderSlice';
import { useGetInitialFormDataQuery } from '../../../features/services/order/orderApi';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination';
import FilteringInputs from '../../Order/FilteringInputs';

const initialFormData = {
    units: [],
    categories: [],
};

const ModalOrderList = ({ isShow, onHide, onSelect }) => {
    const [cookies] = useCookies();
    const initialFilters = {
        year: cookies.budgetYear,
        pr_no: '',
        pr_date: '',
        division: '',
        status: 1,
        limit: 5,
    };
    const dispatch = useDispatch();
    const { orders, pager, isLoading } = useSelector(state => state.order);
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const [apiEndpoint, setApiEndpoint] = useState('');
    const { data: formData = initialFormData } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getOrders({ url: `/api/orders/search?page=${params}` }));
        } else {
            dispatch(getOrders({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handlePageClick = (url) => {
        setApiEndpoint(`${url}&status=0`);
    };

    const handleFilter = (queryStr) => {
        setParams(queryStr);
        setApiEndpoint(`/api/orders/search?page=`);
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header className="border py-1 px-2">
                <Modal.Title>รายการสั่งซื้อ/จ้าง</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-0">
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={handleFilter}
                    formData={formData}
                />

                {isLoading && (
                    <div className="text-center">
                        <Loading />
                    </div>
                )}

                {!isLoading && orders && (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>รายการสั่งซื้อ/จ้าง</th>
                                <th className="text-center w-[15%]">งบประมาณ</th>
                                <th className="text-center w-[10%]">เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order, index) => (
                                <tr key={order.id}>
                                    <td className="text-center">{index + pager.from}</td>
                                    <td className="text-sm font-thin">
                                        <p>
                                            เลขที่ <span className="badge text-bg-success mr-1">{order.po_no}</span>
                                            วันที่ <span className="badge text-bg-success">{toShortTHDate(order.po_date)}</span></p>
                                        <p>
                                            {order.requisition.requester?.prefix?.name}{order.requisition.requester?.firstname} {order.requisition.requester?.lastname}
                                            {' ' + order.requisition.requester?.position?.name}{order.requisition.requester?.level && order.requisition.requester?.level?.name}
                                        </p>
                                        <p>{' ' + order.requisition.topic} จำนวน {currency.format(order.item_count)} รายการ รวมเป็นเงิน {currency.format(order.net_total)} บาท</p>
                                        <p className="text-xs font-thin text-blue-600">
                                            ตาม
                                            {order.requisition.budgets.map(data => (
                                                <span key={data.id}>
                                                    {data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}
                                                </span>
                                            ))}
                                        </p>
                                    </td>
                                    <td className="text-center">
                                        <span className="text-red-500">{currency.format(order.net_total)}</span> บาท
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(order);
                                            }}
                                        >
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Modal.Body>
            <Modal.Footer className="py-1 px-2">
                <Pagination
                    pager={pager}
                    onPageClick={(url) => handlePageClick(url)}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default ModalOrderList
