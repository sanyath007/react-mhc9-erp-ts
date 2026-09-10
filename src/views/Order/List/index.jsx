import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { ConfirmToast } from 'react-confirm-toast'
import { toast } from 'react-toastify'
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import { getOrders, destroy, resetDeleted } from '../../../features/slices/order/orderSlice'
import Loading from '../../../components/ui/Loading'
import Pagination from '../../../components/ui/Pagination'
import OrderFilteringInputs from '../../../components/Order/FilteringInputs'

const OrderList = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        year: cookies.budgetYear,
        po_no: '',
        po_date: '',
        supplier: '',
        status: '1',
    };
    const dispatch = useDispatch();
    const { orders, pager, isLoading, isDeleted } = useSelector(state => state.order);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState('');

    useEffect(() => {
        if (isDeleted) {
            dispatch(resetDeleted());
            toast.success('ลบคำสั่งซื้อ/จ้างสำเร็จ!!');

            /** Reset ค่าของ apiEndpoint เพื่่อ re-render page */
            setApiEndpoint(prev => prev === '' ? `/api/orders/search?page=` : '');
        }
    }, [isDeleted]);

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getOrders({ url: `/api/orders/search?page=${params}` }));
        } else {
            dispatch(getOrders({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handleFilter = (queryString) => {
        setParams(queryString);

        setApiEndpoint('/api/orders/search?page=')
    };

    const handleDelete = (id) => {
        dispatch(destroy(deletingId));
        setDeletingId('');
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการใบสั่งซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการใบสั่งซื้อ/จ้าง</h2>
                    <Link to="add" className="btn btn-primary">สร้างคำสั่งซื้อ/จ้าง</Link>
                </div>

                <div>
                    <ConfirmToast
                        customFunction={handleDelete}
                        setShowConfirmToast={setShowConfirm}
                        showConfirmToast={showConfirm}
                        toastText={`คุณต้องการลบใบสั่งซื้อ/จ้าง รหัส ${deletingId} ใช่หรือไม่?`}
                        buttonNoText='ไม่'
                        buttonYesText='ใช่'
                    />

                    <OrderFilteringInputs
                        initialFilters={initialFilters}
                        onFilter={handleFilter}
                    />

                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[15%]">ใบสั่งซื้อ/จ้าง</th>
                                <th>รายการ</th>
                                <th className="text-center w-[12%]">ยอดซื้อ/จ้าง</th>
                                <th className="text-center w-[20%]">ผู้ขอ</th>
                                <th className="text-center w-[8%]">สถานะ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="text-center" colSpan={7}><Loading /></td>
                                </tr>
                            )}
                            {!isLoading && orders && orders.map((order, index) => (
                                <tr key={order.id} className="font-thin">
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td>
                                        <p>เลขที่: <span className="badge rounded-pill text-bg-primary">{order.po_no}</span></p>
                                        <p>วันที่: <span className="badge rounded-pill text-bg-primary">{toShortTHDate(order.po_date)}</span></p>
                                    </td>
                                    <td>
                                        <p>รายการ{order.requisition?.topic} จำนวน {currency.format(order.item_count)} รายการ</p>
                                        <p>จาก {order.supplier?.name}</p>
                                    </td>
                                    <td className="text-right">
                                        <b>{currency.format(order.net_total)}</b> บาท
                                    </td>
                                    <td>
                                        <p className="font-bold">{order.requisition?.requester?.prefix?.name}{order.requisition?.requester?.firstname} {order.requisition?.requester?.lastname}</p>
                                        <p className="text-xs">{order.requisition?.requester?.position?.name}{order.requisition?.requester?.level && order.requisition?.requester?.level?.name}</p>
                                    </td>
                                    <td className="text-center">
                                        {order.status === 1 && <span className="badge rounded-pill text-bg-secondary">รอดำเนินการ</span>}
                                        {order.status === 2 && <span className="badge rounded-pill text-bg-success">ตรวจรับแล้ว</span>}
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/order/${order.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/order/${order.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger px-1"
                                            onClick={() => {
                                                setDeletingId(order.id);
                                                setShowConfirm(true);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pager={pager}
                    onPageClick={(url) => setApiEndpoint(url)}
                />
            </div>
        </div>
    )
}

export default OrderList
