import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { ConfirmToast } from 'react-confirm-toast'
import { toast } from 'react-toastify'
import { getContracts, destroy, resetDeleted } from '../../../features/slices/loan-contract/loanContractSlice'
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import LoanListDetail from './ListDetail'
import FilteringInputs from './FilteringInputs'
import Loading from '../../../components/ui/Loading'
import Pagination from '../../../components/ui/Pagination'
import EmployeeCard from '../../../components/Employee/Card'

const LoanContractList = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        year: cookies.budgetYear,
        employee: '',
        status: '',
    };
    const dispatch = useDispatch();
    const { contracts, pager, isLoading, isDeleted } = useSelector(state => state.loanContract);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState('');

    useEffect(() => {
        if (isDeleted) {
            toast.success('ลบข้อมูลสัญญายืมเงินเรียบร้อยแล้ว!!');
            dispatch(resetDeleted());

            /** Reset ค่าของ apiEndpoint เพื่่อ re-render page */
            setApiEndpoint(prev => prev === '' ? '/api/loan-contracts/search?page=' : '');
        }
    }, [isDeleted]);

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getContracts({ url: `/api/loan-contracts/search?page=${params}` }));
        } else {
            dispatch(getContracts({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint])

    const handleDelete = (id) => {
        dispatch(destroy(deletingId));
        setDeletingId('');
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการสัญญา</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการสัญญา</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มสัญญา</Link>
                </div>

                <div>
                    <ConfirmToast
                        customFunction={handleDelete}
                        setShowConfirmToast={setShowConfirm}
                        showConfirmToast={showConfirm}
                        toastText={`คุณต้องการลบสัญญายืมเงิน รหัส ${deletingId} ใช่หรือไม่?`}
                        buttonNoText='ไม่'
                        buttonYesText='ใช่'
                    />

                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={(queryStr) => {
                            setParams(queryStr);
                            setApiEndpoint(prev => prev === '' ? `/api/loan-contracts/search?page=${params}` : '');
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
                            {(!isLoading && contracts) && contracts.map((contract, index) => (
                                <tr key={contract.id}>
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td className="text-sm">
                                        <p>เลขที่สัญญา <span className="badge rounded-pill text-bg-primary">{contract.contract_no}</span></p>
                                        <p>วันสัญญา <span className="badge rounded-pill text-bg-primary">{toShortTHDate(contract.approved_date)}</span></p>
                                        <div className="text-lg text-center mt-1">
                                            {contract.status === 1 && <span className="badge rounded-pill text-bg-success">อนุมัติแล้ว</span>}
                                            {contract.status === 2 && <span className="badge rounded-pill text-bg-secondary">เงินเข้าแล้ว</span>}
                                            {contract.status === 3 && <span className="badge rounded-pill text-bg-warning">รอเคลียร์</span>}
                                            {contract.status === 4 && <span className="badge rounded-pill text-bg-dark">เคลียร์แล้ว</span>}
                                            {contract.status === 9 && <span className="badge rounded-pill text-bg-danger">ยกเลิก</span>}
                                        </div>
                                    </td>
                                    <td className="text-sm">
                                        <div className="text-blue-600">
                                            {contract.loan?.project_name}
                                            <span className="ml-1">เป็นเงินทั้งสิ้น {currency.format(contract.net_total)} บาท</span>
                                        </div>

                                        <LoanListDetail items={contract.details} />
                                    </td>
                                    <td className="text-sm">
                                        <EmployeeCard employee={contract.loan?.employee} />
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/loan-contract/${contract.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        {![2, 3, 4].includes(contract.status) && (
                                            <>
                                                <Link to={`/loan-contract/${contract.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                                    <FaPencilAlt />
                                                </Link>
                                                <button className="btn btn-sm btn-danger px-1" onClick={() => {
                                                    setDeletingId(contract.id);
                                                    setShowConfirm(true);
                                                }}>
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

export default LoanContractList
