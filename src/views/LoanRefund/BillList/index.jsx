import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getRefunds, destroy, resetDeleted } from '../../../features/slices/loan-refund/loanRefundSlice'
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import FilteringInputs from '../List/FilteringInputs'
import Loading from '../../../components/ui/Loading'
import Pagination from '../../../components/ui/Pagination'
import EmployeeCard from '../../../components/Employee/Card'

const LoanRefundBillList = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        type: '',
        year: cookies.budgetYear,
    };
    const dispatch = useDispatch();
    const { refunds, pager, isLoading, isDeleted } = useSelector(state => state.loanRefund);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (isDeleted) {
            dispatch(resetDeleted());
            toast.success('ลบรายการหักล้างเงินยืมสำเร็จ!!');

            /** Reset ค่าของ apiEndpoint เพื่่อ re-render page */
            setApiEndpoint(prev => prev === '' ? `/api/loan-refunds/search?page=&sort=bill_no:desc` : '')
        }
    }, [isDeleted]);

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getRefunds({ url: `/api/loan-refunds/search?page=&sort=bill_no:desc${params}` }));
        } else {
            dispatch(getRefunds({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params])

    const handleFilter = (queryStr) => {
        setParams(queryStr);

        setApiEndpoint(`/api/loan-refunds/search?page=&sort=bill_no:desc`);
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>เลขที่ใบรับใบสำคัญ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">เลขที่ใบรับใบสำคัญ</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มรายการ</Link>
                </div>

                <div>
                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={handleFilter}
                    />

                    <table className="table table-bordered mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[20%]">เอกสารหักล้าง</th>
                                <th>รายการ</th>
                                <th className="text-center w-[20%]">เลขที่ใบรับใบสำคัญ</th>
                                {/* <th className="text-center w-[10%]">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="text-center" colSpan={6}><Loading /></td>
                                </tr>
                            )}
                            {(!isLoading && refunds) &&
                                refunds.filter(r => !!r.bill_no).sort((a, b) => b.bill_no.substring(0, 2) - a.bill_no.substring(0, 2)).map((refund, index) => (
                                    <tr key={refund.id}>
                                        <td className="text-center">{pager && pager.from + index}</td>
                                        <td className="text-md space-y-1">
                                            <p>เลขที่ <span className="badge rounded-pill text-bg-primary">{refund.doc_no}</span></p>
                                            <p>วันที่ <span className="badge rounded-pill text-bg-primary">{toShortTHDate(refund.doc_date)}</span></p>
                                        </td>
                                        <td className="text-sm">
                                            <p className={`font-bold ${refund.contract?.loan?.loan_type_id === 1 ? 'text-blue-600' : 'text-red-500'}`}>
                                                <span className="mr-2">เลขที่สัญญา {refund.contract?.contract_no}</span>
                                                <span>: {refund.contract?.loan?.loan_type_id === 1 ? 'ยืมเงินโครงการ' : 'ยืมเงินเดินทางไปราชการ'}</span>
                                            </p>
                                            <div>
                                                {refund.contract?.loan?.project_name}
                                                <span className="ml-1">
                                                    เป็นเงินทั้งสิ้น
                                                    <span className="ml-1 text-blue-600">{currency.format(refund.contract?.net_total)}</span> บาท
                                                </span>
                                                <span className="ml-1">
                                                    และ{refund.refund_type_id === 1 ? 'คืนเงิน' : 'เบิกเงินเพิ่ม'} จำนวน
                                                    <span className={`ml-1 ${refund.refund_type_id === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {currency.format(Math.abs(refund.balance))}
                                                    </span> บาท
                                                </span>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <span>ผู้ยืม :</span>
                                                <EmployeeCard
                                                    employee={refund.contract?.loan?.employee}
                                                    showAvatar={false}
                                                    showPosition={false}
                                                />
                                            </div>
                                        </td>
                                        <td className="text-center p-1">
                                            <span className="font-bold text-xl">
                                                {refund.bill_no}
                                            </span>
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

export default LoanRefundBillList
