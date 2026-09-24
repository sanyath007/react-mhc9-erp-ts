import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Modal } from 'react-bootstrap'
import { getLoans } from '../../../features/slices/loan/loanSlice';
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination';
import EmployeeCard from '../../Employee/Card';
import FilteringInputs from './FilteringInputs';

const ModalLoanList = ({ isShow, onHide, onSelect }: any) => {
    const [cookies] = useCookies();
    const initialFilters = {
        year: cookies.budgetYear,
        status: 1,
    }
    const dispatch = useDispatch<any>();
    const { loans, pager, isLoading } = useSelector((state: any) => state.loan);
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getLoans({ url: `/api/loans/search?page=${params}` }));
        } else {
            dispatch(getLoans({ url: `${endpoint}${params}` }));
        }
    }, [endpoint]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>รายการคำขอยืมเงิน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => {
                        console.log(queryStr);
                        setParams(queryStr);
                        setEndpoint(prev => prev === '' ? `/api/loans/search?page=` : '');
                    }}
                />

                <div>
                    <table className="table table-bordered table-striped table-hover text-sm mb-0">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[15%]">เอกสาร</th>
                                <th>รายการคำขอ</th>
                                <th className="text-center w-[25%]">ผู้ขอ</th>
                                <th className="text-center w-[8%]">เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {(loans && loans.length > 0) ? loans.map((loan, index) => (
                                <tr key={loan.id} className="font-thin text-sm">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td>
                                        <p><b>เลขที่เอกสาร</b> {loan.doc_no}</p>
                                        <p><b>วันที่เอกสาร</b> {toShortTHDate(loan.doc_date)}</p>
                                    </td>
                                    <td>
                                        {/* <p className="text-gray-400 text-sm">{loan?.project.plan?.name}</p> */}
                                        {/* <p className="text-blue-500">
                                            {loan?.budget?.name}
                                            <span className="font-thin ml-1">{loan?.budget?.project?.plan?.name} / {loan?.budget?.project?.name}</span>
                                        </p> */}
                                        <p>
                                            <span className="text-blue-600">{loan?.project_name}</span>
                                            <span className="ml-1"><b>ระหว่างวันที่</b> {toShortTHDate(loan?.project_sdate)} - {toShortTHDate(loan?.project_edate)}</span>
                                            <span className="ml-2"><b>ยอดเงินยืม</b><span className="font-bold text-red-600 mx-1">{currency.format(loan?.net_total)}</span>บาท</span>
                                        </p>
                                    </td>
                                    <td className="text-sm">
                                        <EmployeeCard employee={loan?.employee} />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(loan);
                                            }}
                                        >
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            )) : !isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <span className="text-red-500 text-sm font-thin">-- ไม่มีรายการ --</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className="py-1">
                {pager && (
                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setEndpoint(url)}
                    />
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default ModalLoanList
