import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { ConfirmToast } from 'react-confirm-toast'
import { toast } from 'react-toastify'
import { getLoans, destroy, resetDeleted } from '../../../features/slices/loan/loanSlice'
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import LoanListDetail from './ListDetail'
import FilteringInputs from './FilteringInputs'
import Loading from '../../../components/ui/Loading'
import Pagination from '../../../components/ui/Pagination'
import EmployeeCard from '../../../components/Employee/Card'
import LoanStatusBadge from '../../../components/Badges/LoanStatusBadge'

const LoanList = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        doc_no: '',
        doc_date: '',
        status: '',
        year: cookies.budgetYear,
    };
    const dispatch = useDispatch<any>();
    const { loans, pager, isLoading, isDeleted } = useSelector((state: any) => state.loan);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState('');

    useEffect(() => {
        if (isDeleted) {
            toast.success('ลบคำขอยืมเงินสำเร็จ!!');
            dispatch(resetDeleted());
            setApiEndpoint(prev => prev === '' ? `/api/loans/search?page=` : '');
        }
    }, [isDeleted]);

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getLoans({ url: `/api/loans/search?page=${params}` }));
        } else {
            dispatch(getLoans({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint])

    const handleDelete = () => {
        dispatch(destroy(deletingId));
        setDeletingId('');
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการคำขอยืมเงิน</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการคำขอยืมเงิน</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มคำขอ</Link>
                </div>

                <div>
                    <ConfirmToast
                        customFunction={handleDelete}
                        setShowConfirmToast={setShowConfirm}
                        showConfirmToast={showConfirm}
                        toastText={`คุณต้องการลบคำขอยืมเงิน รหัส ${deletingId} ใช่หรือไม่?`}
                        buttonNoText='ไม่'
                        buttonYesText='ใช่'
                    />

                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={(queryStr) => {
                            setParams(queryStr);
                            setApiEndpoint(prev => prev === '' ? `/api/loans/search?page=` : '');
                        }}
                    />

                    <table className="table table-bordered mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[15%]">เอกสาร</th>
                                <th>รายการ</th>
                                <th className="text-center w-[25%]">ผู้ขอ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="text-center" colSpan={6}><Loading /></td>
                                </tr>
                            )}
                            {(!isLoading && loans) && loans.map((loan, index) => (
                                <tr key={loan.id}>
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td className="text-sm">
                                        <p>เลขที่ <span className="badge rounded-pill text-bg-primary">{loan.doc_no}</span></p>
                                        <p>วันที่ <span className="badge rounded-pill text-bg-primary">{toShortTHDate(loan.doc_date)}</span></p>
                                        <LoanStatusBadge status={loan.status} />
                                    </td>
                                    <td className="text-sm">
                                        {loan.contract && (
                                            <div className="flex flex-row items-center gap-2">
                                                <div>สัญญาเลขที่: <span className="text-red-600 font-bold">{loan.contract.contract_no}</span></div>
                                                <div>วันที่: <span className="text-red-600 font-bold">{toShortTHDate(loan.contract.approved_date)}</span></div>
                                            </div>
                                        )}
                                        <div className="text-blue-600">
                                            {loan.project_name}
                                            <span className="ml-1">เป็นเงินทั้งสิ้น {currency.format(loan.net_total)} บาท</span>
                                        </div>

                                        <LoanListDetail items={loan.details} />
                                    </td>
                                    <td className="text-sm">
                                        <EmployeeCard employee={loan?.employee} />
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/loan/${loan.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        {![4, 5, 9].includes(loan.status) && (
                                            <Link to={`/loan/${loan.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                                <FaPencilAlt />
                                            </Link>
                                        )}
                                        {![3, 4, 5, 9].includes(loan.status) && (
                                            <button
                                                className="btn btn-sm btn-danger px-1"
                                                onClick={() => {
                                                    setShowConfirm(true);
                                                    setDeletingId(loan.id);
                                                }}
                                            >
                                                <FaTrash />
                                            </button>
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

export default LoanList
