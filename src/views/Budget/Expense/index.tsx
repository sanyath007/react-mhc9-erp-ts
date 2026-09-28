import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Breadcrumb } from "react-bootstrap"
import { Link } from "react-router-dom"
import moment from 'moment';
import { generateQueryString, getUrlParam } from '../../../utils';
import { getBudgets } from '../../../features/slices/budget/budgetSlice';
import { useGetInitialFormDataQuery } from '../../../features/services/budget/budgetApi';
import FilteringInputs from './FilteringInputs';
import Loading from '../../../components/ui/Loading';
import Pagination from '../../../components/ui/Pagination';
import BudgetTypeBadge from '../../../components/Badges/BudgetTypeBadge';

const BudgetExpenseSummary = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        name: '',
        type: '',
        plan: '',
        year: cookies.budgetYear,
    };
    const dispatch = useDispatch<any>();
    const { budgets, pager, isLoading } = useSelector((state: any) => state.budget);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const [year, setYear] = useState(moment(`${cookies.budgetYear}-01-01`).year())
    const { data: formData } = useGetInitialFormDataQuery({ year });

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getBudgets({ url: `/api/budgets/search?page=&limit=5${params}` }));
        } else {
            dispatch(getBudgets({ url: `${apiEndpoint}&limit=5${params}` }));
        }
    }, [apiEndpoint]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-expense' }}>ค่าใช้จ่ายงบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item active>สรุปค่าใช้จ่ายงบประมาณ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">สรุปค่าใช้จ่ายงบประมาณ</h2>
                </div>

                <div>
                    <table className="table table-bordered table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>รายการงบประมาณ</th>
                                <th className="text-center w-[20%]">ยอดจัดสรร</th>
                                <th className="text-center w-[10%]">ร้อยละการใช้จ่าย</th>
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
                            {(!isLoading && budgets) &&
                                [...budgets].sort((a: any, b: any) => a.activity.project.plan_id - b.activity.project.plan_id).map((budget, index) => (
                                    <tr key={budget.id}>
                                        <td className="text-center">{index + pager?.from}</td>
                                        <td>
                                            <p className="text-gray-400 text-xs">{budget.activity?.project?.plan?.plan_no} {budget.activity?.project?.plan?.name}</p>
                                            <p className="text-xs font-semibold">{budget.activity?.project?.name}</p>
                                            <p className="text-blue-500 text-sm">
                                                {budget.activity?.name}
                                                <BudgetTypeBadge type={budget.type} />
                                            </p>
                                        </td>
                                        <td className="px-2 text-sm">
                                            <p className="grid grid-cols-3 items-center">
                                                ยอดจัดสรร: <span className="font-semibold">100</span> บาท
                                            </p>
                                            <p className="grid grid-cols-3 items-center">
                                                ยอดใช้ไป: <Link to={`/budget-expense/list?budget_id=${budget.id}`}>
                                                    <span className="font-semibold">50</span>
                                                </Link> บาท
                                            </p>
                                            <p className="grid grid-cols-3 items-center">
                                                ยอดคงเหลือ: <span className="font-semibold">50</span> บาท
                                            </p>
                                        </td>
                                        <td className="text-center">

                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {pager && (
                        <Pagination
                            pager={pager}
                            onPageClick={(url) => setApiEndpoint(url)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BudgetExpenseSummary