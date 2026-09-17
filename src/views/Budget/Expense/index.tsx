import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { currency } from '../../../utils'
import { getBudgetExpenses } from '../../../features/slices/budget-expense/budgetExpenseSlice'
import FilteringInputs from './FilteringInputs'

const getMonthTotal = (item: any, month: number) => {
    if (!item.details) return item.expenses ? item.expenses[['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][month - 1]] || 0 : 0;
    return item.details
        .filter((d: any) => Number(d.mounth) === month)
        .reduce((acc: number, curr: any) => acc + Number(curr.net_total || curr.amount || 0), 0);
};

const BudgetExpenseList = () => {
    const dispatch = useDispatch<any>();
    const { expenses, isLoading } = useSelector((state: any) => state.budgetExpense);
    const [cookies] = useCookies()
    const [year, setYear] = useState(cookies.budgetYear);
    const [apiEndpoint, setApiEndpoint] = useState('/api/budget-expenses/search');
    const [params, setParams] = useState(`year=${cookies.budgetYear || ''}`);

    useEffect(() => {
        dispatch(getBudgetExpenses({ url: `${apiEndpoint}?${params}` }));
    }, [dispatch, apiEndpoint, params]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item active>ค่าใช้จ่ายงบประมาณ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการค่าใช้จ่ายงบประมาณ</h2>
                    <div className="flex flex-row gap-1">
                        <Link to="add" className="btn btn-primary">
                            เพิ่มรายการ
                        </Link>
                    </div>
                </div>

                {/* Using FilteringInputs from Activity for mock filters for now */}
                <FilteringInputs
                    initialFilters={{
                        year: year,
                        name: '',
                        plan: '',
                        project: '',
                    }}
                    onFilter={(queryStr: string) => {
                        setParams(queryStr);
                    }}
                />

                <div className="table-responsive">
                    <table className="table table-bordered table-striped text-xs mb-2 whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-center align-middle" rowSpan={2} style={{ width: '3%' }}>#</th>
                                <th className="align-middle" rowSpan={2} style={{ width: '25%' }}>โครงการ/กิจกรรม</th>
                                <th className="text-center align-middle" rowSpan={2} style={{ width: '10%' }}>หน่วยนับ/เป้า/งบ</th>
                                <th className="text-center" colSpan={12}>เดือนที่ใช้จ่าย</th>
                                <th className="text-center align-middle" rowSpan={2} style={{ width: '8%' }}>รวมทั้งสิ้น</th>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="text-center">ต.ค.</th>
                                <th className="text-center">พ.ย.</th>
                                <th className="text-center">ธ.ค.</th>
                                <th className="text-center">ม.ค.</th>
                                <th className="text-center">ก.พ.</th>
                                <th className="text-center">มี.ค.</th>
                                <th className="text-center">เม.ย.</th>
                                <th className="text-center">พ.ค.</th>
                                <th className="text-center">มิ.ย.</th>
                                <th className="text-center">ก.ค.</th>
                                <th className="text-center">ส.ค.</th>
                                <th className="text-center">ก.ย.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={16} className="text-center py-4">กำลังโหลดข้อมูล...</td>
                                </tr>
                            )}
                            {!isLoading && expenses && expenses.map((item: any, index: number) => (
                                <tr key={item.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>
                                        <Link to={`/budget-expense/${item.id}/detail`} className="block hover:bg-gray-50 rounded p-1 transition-colors">
                                            <p className="font-normal text-gray-500">
                                                {item.project?.plan?.plan_no || item.plan_no || ''} {item.project?.plan?.name || item.plan_name || ''}
                                            </p>
                                            <p className="font-normal">{item.project?.name || '-'}</p>
                                            <p className="font-bold text-primary">
                                                {item.budget?.activity?.name || '-'} ({item.budget?.type?.name || ''})
                                            </p>
                                            <p className="text-green-600 font-semibold mt-1">
                                                - {item.expense_type?.name || '-'}
                                            </p>
                                        </Link>
                                    </td>
                                    <td>
                                        <p><b>หน่วย:</b> {item.unit_text || '-'}</p>
                                        <p><b>เป้า:</b> {item.target || '-'}</p>
                                        <p className="text-blue-600 font-bold"><b>งบ:</b> {currency.format(item.amount || 0)}</p>
                                    </td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 10))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 11))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 12))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 1))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 2))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 3))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 4))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 5))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 6))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 7))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 8))}</td>
                                    <td className="text-right">{currency.format(getMonthTotal(item, 9))}</td>
                                    <td className="text-right font-bold text-green-700 bg-green-50">
                                        {currency.format(item.details?.reduce((acc: number, d: any) => acc + Number(d.net_total || d.amount || 0), 0) || item.total || 0)}
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && (!expenses || expenses.length === 0) && (
                                <tr>
                                    <td colSpan={16} className="text-center py-4">ไม่พบข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BudgetExpenseList
