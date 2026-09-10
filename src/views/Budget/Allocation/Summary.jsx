import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { getBudgets } from '../../../features/slices/budget/budgetSlice'
import { getAllAllocations } from '../../../features/slices/budget-allocation/budgetAllocationSlice'
import { currency, getUrlParam } from '../../../utils'
import FilteringInputs from './FilteringInputs'
import BudgetTypeBadge from '../../../components/Budget/BudgetTypeBadge'
import Pagination from '../../../components/ui/Pagination'
import moment from 'moment'
import { useCookies } from 'react-cookie'

const AllocationSummary = () => {
    const [cookies] = useCookies();
    const dispatch = useDispatch();
    const { budgets, pager } = useSelector(state => state.budget);
    const { allocations } = useSelector(state => state.budgetAllocation);
    const [year, setYear] = useState(cookies.budgetYear);
    const [endpoint, setEndpoint] = useState('');

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getBudgets({ url: `/api/budgets/search?page=&year=${year}` }));
            dispatch(getAllAllocations({ url: `/api/budget-allocations?year=${year}` }));
        } else {
            dispatch(getBudgets({ url: `${endpoint}&year=${year}` }));
            dispatch(getAllAllocations({ url: `/api/budget-allocations?year=${year}` }));
        }
    }, [endpoint]);

    const allocationCount = (budgetId) => {
        return allocations && allocations.filter(al => al.budget_id === budgetId).length;
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item active>สรุปยอดจัดสรรงบ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">สรุปยอดจัดสรรงบ</h2>
                </div>

                <FilteringInputs
                    initialFilters={{ year: year }}
                    onFilter={(queryStr) => {
                        setYear(getUrlParam(queryStr, 'year'));
                        setEndpoint(prev => prev === '' ? `/api/budgets/search?page=` : '');
                    }}
                />

                <div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="w-[5%] text-center">#</th>
                                <th>กิจกรรม</th>
                                <th className="w-[8%] text-center">ปีงบ</th>
                                <th className="w-[10%] text-center">จำนวนการโอน</th>
                                <th className="w-[10%] text-center">ยอดจัดสรร</th>
                                <th className="w-[8%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets && budgets.map((budget, index) => (
                                <tr key={budget.id}>
                                    <td className="text-center">{index + pager?.from}</td>
                                    <td>
                                        <p className="text-sm text-gray-500">{budget.activity?.project?.plan?.name}</p>
                                        <p className="text-sm font-semibold">{budget.activity?.project?.name}</p>
                                        <p>
                                            <span className="font-bold text-blue-600 mr-1">{budget.activity?.name}</span>
                                            <BudgetTypeBadge type={budget.type} />
                                        </p>
                                    </td>
                                    <td className="text-center">{budget.activity && budget.activity?.year + 543}</td>
                                    <td className="text-center">{allocationCount(budget.id)}</td>
                                    <td className="text-right">{currency.format(budget.total)}</td>
                                    <td className="text-center">
                                        <Link to={`/budget/allocation/budget/${budget.id}`} className="btn btn-primary btn-sm">
                                            จัดสรร
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pager && (
                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setEndpoint(url)}
                    />
                )}
            </div>
        </div>
    )
}

export default AllocationSummary