import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Breadcrumb } from 'react-bootstrap'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { useStyles } from '../../hooks/useStyles'
import { getReport } from '../../features/slices/loan-contract/loanContractSlice'
import { currency, generateQueryString, toShortTHDate } from '../../utils'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'
import EmployeeCard from '../../components/Employee/Card'

const initialFilters = {
    contract_no: '',
    status: ''
};

const LoanContractReport = () => {
    const classes = useStyles();
    const [cookies] = useCookies()
    const dispatch = useDispatch<any>();
    const { contracts, pager, isLoading } = useSelector((state: any) => state.loanContract);
    const [selectedYear, setSelectedYear] = useState(moment(`${cookies.budgetYear}-01-01`));
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getReport({ url: `/api/loan-contracts/report/${selectedYear.year()}?page=` }));
        } else {
            dispatch(getReport({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint])

    const renderRefundTotal = (type, balance) => {
        return (
            <div className={`${(type === 1 || type === 3) ? 'text-green-600' : 'text-red-600'} font-bold`}>
                {type === 1 ? '+' : ''}{currency.format(balance)}
            </div>
        )
    };

    const isOverRefund = (refundDate, clearDate) => {
        return moment(clearDate).diff(moment(refundDate), 'days') > 1;
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item active>ทะเบียนคุม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-xl font-bold">ทะเบียนคุม</h1>

                    <a href={`${process.env.REACT_APP_API_URL}/loan-contracts/export/${selectedYear.year()}`} target="_blank" className="btn btn-success btn-sm">
                        <i className="far fa-file-excel mr-1"></i>
                        Export
                    </a>
                </div>

                <div>
                    {/* ======================== Filtering ======================== */}
                    <div className="border rounded-md py-2 px-3 mb-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="">ปีงบ :</label>
                            <div>
                                <DatePicker
                                    format="YYYY"
                                    views={['year']}
                                    value={selectedYear}
                                    onChange={(date) => {
                                        setSelectedYear(date);
                                        // setParams(queryStr);
                                        setApiEndpoint(prev => prev === '' ? `/api/loan-contracts/report/${date.year()}?page=` : '');
                                    }}
                                    className={classes.muiTextFieldInput}
                                />
                            </div>
                        </div>
                    </div>
                    {/* ======================== Filtering ======================== */}

                    <table className="table table-bordered table-striped table-hover text-xs mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[3%]">#</th>
                                <th className="text-center w-[8%]">เอกสาร</th>
                                <th className="text-center w-[20%]">ผู้ยืม</th>
                                <th className="text-center">โครงการ</th>
                                <th className="text-center w-[8%]">จำนวนเงินยืม</th>
                                <th className="text-center w-[8%]">
                                    จำนวนเงิน<br />
                                    <span className="text-green-600">คืน</span>/
                                    <span className="text-red-600">เบิกเพิ่ม</span>
                                </th>
                                <th className="text-center w-[8%]">วันที่เงินเข้า</th>
                                <th className="text-center w-[8%]">วันที่ครบกำหนด</th>
                                <th className="text-center w-[8%]">วันที่เคลียร์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="text-center" colSpan={9}><Loading /></td>
                                </tr>
                            )}
                            {(!isLoading && contracts) && contracts.map((contract, index) => (
                                <tr key={contract.id}>
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td>
                                        <p className="p-0 m-0">เลขที่สัญญา :</p>
                                        <span className="badge rounded-pill text-bg-primary mb-1">{contract.contract_no}</span>
                                        <p className="p-0 m-0">วันสัญญา :</p>
                                        <span className="badge rounded-pill text-bg-primary">{toShortTHDate(contract.approved_date)}</span>
                                    </td>
                                    <td><EmployeeCard employee={contract.loan?.employee} /></td>
                                    <td>{contract.loan?.project_name}</td>
                                    <td className="text-center">
                                        {currency.format(contract.net_total)}
                                    </td>
                                    <td className="text-center">
                                        {contract.refund && renderRefundTotal(contract.refund?.refund_type_id, contract.refund?.balance)}
                                    </td>
                                    <td className="text-center">
                                        {toShortTHDate(contract.deposited_date)}
                                    </td>
                                    <td className="text-center">
                                        {toShortTHDate(contract.refund_date)}
                                    </td>
                                    <td className="text-center font-bold">
                                        {(contract.refund_date && contract.refund) && isOverRefund(contract.refund_date, contract.refund?.approved_date)
                                            ? <span className="text-red-600">{toShortTHDate(contract.refund?.approved_date)}</span>
                                            : <span className="text-green-600">{toShortTHDate(contract.refund?.approved_date)}</span>
                                        }
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

export default LoanContractReport
