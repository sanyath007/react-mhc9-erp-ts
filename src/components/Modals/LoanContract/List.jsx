import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Modal } from 'react-bootstrap'
import { getContracts } from '../../../features/slices/loan-contract/loanContractSlice';
import { currency, generateQueryString, toShortTHDate } from '../../../utils'
import FilteringInputs from './FilteringInputs';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination';
import EmployeeCard from '../../Employee/Card';

const ModalLoanContractList = ({ isShow, onHide, onSelect }) => {
    const [cookies] = useCookies();
    const initialFilters = {
        year: cookies.budgetYear,
        status: 2,
    }
    const dispatch = useDispatch();
    const { contracts, pager, isLoading } = useSelector(state => state.loanContract);
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getContracts({ url: `/api/loan-contracts/search?page=${params}` }));
        } else {
            dispatch(getContracts({ url: `${endpoint}${params}` }));
        }
    }, [endpoint]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>รายการสัญญายืมเงิน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => {
                        setParams(queryStr);
                        setEndpoint(prev => prev === '' ? `/api/loan-contracts/search?page=` : '');
                    }}
                />

                <div>
                    <table className="table table-bordered table-striped table-hover text-sm mb-0">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[20%]">เอกสาร</th>
                                <th>รายการ</th>
                                <th className="text-center w-[25%]">ผู้ขอ</th>
                                <th className="text-center w-[8%]">Actions</th>
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
                            {(contracts && contracts.length > 0) ? contracts.map((contract, index) => (
                                <tr key={contract.id} className="font-thin text-sm">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td>
                                        <p><b>เลขที่สัญญา</b> {contract.contract_no}</p>
                                        <p><b>วันที่สัญญา</b> {toShortTHDate(contract.approved_date)}</p>
                                    </td>
                                    <td>
                                        {/* <p className="text-gray-400 text-sm">{contract?.project.plan?.name}</p> */}
                                        {/* <p className="text-blue-500">
                                            {loan?.budget?.name}
                                            <span className="font-thin ml-1">{loan?.budget?.project?.plan?.name} / {contract?.budget?.project?.name}</span>
                                        </p> */}
                                        <p>
                                            <span className="text-blue-600">{contract.loan?.project_name}</span>
                                            <span className="ml-1"><b>ระหว่างวันที่</b> {toShortTHDate(contract.loan?.project_sdate)} - {toShortTHDate(contract.loan?.project_edate)}</span>
                                            <span className="ml-2"><b>ยอดเงินยืม</b><span className="font-bold text-red-600 mx-1">{currency.format(contract.loan?.net_total)}</span>บาท</span>
                                        </p>
                                    </td>
                                    <td className="text-sm">
                                        <EmployeeCard employee={contract?.loan?.employee} />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(contract);
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

export default ModalLoanContractList