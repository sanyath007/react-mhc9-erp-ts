import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { generateQueryString, getUrlParam } from '../../../utils';
import { getBudgets } from '../../../features/slices/budget/budgetSlice';
import { useGetInitialFormDataQuery } from '../../../features/services/budget/budgetApi';
import FilteringInputs from './FilteringInputs';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination';
import BudgetTypeBadge from '../../Badges/BudgetTypeBadge';


const ModalBudgetList = ({ isShow, onHide, onSelect }: any) => {
    const [cookies] = useCookies();
    const initialFilters = {
        name: '',
        type: '',
        plan: '',
        year: cookies.budgetYear,
    };
    const dispatch = useDispatch<any>();
    const { budgets, pager, isLoading } = useSelector((state: any) => state.budget);
    const [year, setYear] = useState(moment(`${cookies.budgetYear}-01-01`).year())
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const { data: formData } = useGetInitialFormDataQuery({ year });

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getBudgets({ url: `/api/budgets/search?page=&limit=5${params}` }));
        } else {
            dispatch(getBudgets({ url: `${apiEndpoint}&limit=5${params}` }));
        }
    }, [apiEndpoint]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>รายการงบประมาณ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => {
                        setParams(queryStr);
                        setApiEndpoint(prev => prev === '' ? `/api/budgets/search?page=` : '');
                        setYear(parseInt(getUrlParam(queryStr, 'year') as string, 10));
                    }}
                    formData={formData}
                />

                <div>
                    <table className="table table-bordered table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                {/* <th className="text-center w-[15%]">เลขที่พัสดุ</th> */}
                                <th>รายการงบประมาณ</th>
                                <th className="text-center w-[10%]">ปีงบประมาณ</th>
                                <th className="text-center w-[8%]">เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {(!isLoading && budgets.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <span className="text-sm text-red-500">-- ไม่มีรายการ --</span>
                                    </td>
                                </tr>
                            )}
                            {(!isLoading && budgets) && budgets.map((budget, index) => (
                                <tr key={budget.id}>
                                    <td className="text-center">{index + pager?.from}</td>
                                    {/* <td className="text-center">{budget.budget_no}</td> */}
                                    <td>
                                        <p className="text-gray-400 text-xs">{budget.activity?.project?.plan?.plan_no} {budget.activity?.project?.plan?.name}</p>
                                        <p className="text-xs font-semibold">{budget.activity?.project?.name}</p>
                                        <p className="text-blue-500 text-sm">
                                            {budget.activity?.name}
                                            <BudgetTypeBadge type={budget.type} />
                                        </p>
                                    </td>
                                    <td className="text-center">{budget.activity?.year && budget.activity?.year + 543}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                setApiEndpoint('');
                                                onSelect(budget);
                                                onHide();
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
            </Modal.Body>
            {pager && (
                <Modal.Footer className="py-1">
                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setApiEndpoint(url)}
                    />
                </Modal.Footer>
            )}
        </Modal>
    )
}

export default ModalBudgetList;
