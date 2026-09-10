import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { ConfirmToast } from 'react-confirm-toast'
import { getRequisitions, destroy, resetDeleted } from '../../../features/slices/requisition/requisitionSlice'
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import DetailList from './DetailList'
import StatusBadge from '../StatusBadge'
import FilteringInputs from './FilteringInputs'
import Pagination from '../../../components/ui/Pagination'
import Loading from '../../../components/ui/Loading'
import EmployeeCard from '../../../components/Employee/Card'


const RequisitionList = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        pr_no: '',
        pr_date: '',
        division: '',
        status: '',
        year: cookies.budgetYear,
    };
    const dispatch = useDispatch();
    const { requisitions, pager, isLoading, isDeleted } = useSelector(state => state.requisition);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState('');

    useEffect(() => {
        if (isDeleted) {
            dispatch(resetDeleted());

            toast.success('ลบข้อมูลคำขอสำเร็จ!!');

            setApiEndpoint(prev => prev === '' ? `/api/requisitions/search?page=` : '');
        }
    }, [isDeleted]);

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getRequisitions({ url: `/api/requisitions/search?page=${params}` }));
        } else {
            dispatch(getRequisitions({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint]);

    const handleDelete = () => {
        dispatch(destroy(deletingId));
        setDeletingId('');
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการคำขอซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการคำขอซื้อ/จ้าง</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มคำขอ</Link>
                </div>

                <div>
                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={(queryStr) => {
                            setParams(queryStr);
                            setApiEndpoint(prev => prev === '' ? `/api/requisitions/search?page=` : '');
                        }}
                    />

                    <ConfirmToast
                        customFunction={handleDelete}
                        setShowConfirmToast={setShowConfirm}
                        showConfirmToast={showConfirm}
                        toastText={`คุณต้องการลบคำขอซื้อ/จ้าง รหัส ${deletingId} ใช่หรือไม่?`}
                        buttonNoText='ไม่'
                        buttonYesText='ใช่'
                    />

                    <table className="table table-bordered mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[15%]">เอกสาร</th>
                                <th>รายการ</th>
                                <th className="text-center w-[25%]">ผู้ขอ</th>
                                <th className="text-center w-[8%]">สถานะ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="text-center" colSpan={6}><Loading /></td>
                                </tr>
                            )}
                            {(!isLoading && requisitions) && requisitions.map((requisition, index) => (
                                <tr key={requisition.id}>
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td className="text-sm">
                                        <p>เลขที่ <span className="badge rounded-pill text-bg-primary">{requisition.pr_no}</span></p>
                                        <p>วันที่ <span className="badge rounded-pill text-bg-primary">{toShortTHDate(requisition.pr_date)}</span></p>
                                    </td>
                                    <td className="text-sm">
                                        <p>
                                            <span className="mr-2">{requisition.category.name} จำนวน {requisition.item_count} รายการ</span>
                                            <span>เป็นเงินทั้งสิ้น {currency.format(requisition.net_total)} บาท</span>
                                        </p>
                                        {requisition.project && (
                                            <div className="text-xs font-thin text-blue-600">
                                                *{requisition.project.name}
                                            </div>
                                        )}

                                        <DetailList items={requisition.details} />
                                    </td>
                                    <td className="text-sm"><EmployeeCard employee={requisition.requester} /></td>
                                    <td className="text-center"><StatusBadge status={requisition.status} /></td>
                                    <td className="text-center p-1">
                                        <Link to={`/requisition/${requisition.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        {requisition.status === 1 && (
                                            <>
                                                <Link to={`/requisition/${requisition.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                                    <FaPencilAlt />
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-danger px-1"
                                                    onClick={() => {
                                                        setShowConfirm(true);
                                                        setDeletingId(requisition.id);
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setApiEndpoint(url)}
                    />
                </div>
            </div>
        </div>
    )
}

export default RequisitionList
