import React, { useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { currency } from '../../../utils'
import FilteringInputs from './FilteringInputs'

const mockData = [
    {
        id: 1,
        plan_no: 'แผนงานที่ 1',
        plan_name: 'บริหารจัดการ',
        project_name: 'โครงการบริหารจัดการทั่วไป',
        activity_name: 'กิจกรรมบริหารงานทั่วไป',
        expense_name: 'ค่าวัสดุสำนักงาน',
        unit: 'บาท',
        target: 1,
        budget: 120000,
        expenses: {
            oct: 10000,
            nov: 10000,
            dec: 10000,
            jan: 10000,
            feb: 10000,
            mar: 10000,
            apr: 10000,
            may: 10000,
            jun: 10000,
            jul: 10000,
            aug: 10000,
            sep: 10000,
        },
        total: 120000
    },
    {
        id: 2,
        plan_no: 'แผนงานที่ 2',
        plan_name: 'แผนงานยุทธศาสตร์',
        project_name: 'โครงการพัฒนาระบบข้อมูล',
        activity_name: 'กิจกรรมพัฒนาระบบ ERP',
        expense_name: 'ค่าจ้างเหมาบริการ',
        unit: 'เดือน',
        target: 12,
        budget: 360000,
        expenses: {
            oct: 30000,
            nov: 30000,
            dec: 30000,
            jan: 30000,
            feb: 30000,
            mar: 30000,
            apr: 30000,
            may: 30000,
            jun: 30000,
            jul: 30000,
            aug: 30000,
            sep: 30000,
        },
        total: 360000
    }
];

const BudgetExpenseList = () => {
    const [cookies] = useCookies()
    const [year, setYear] = useState(cookies.budgetYear);

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
                        console.log('Filter:', queryStr);
                    }}
                />

                <div className="table-responsive">
                    <table className="table table-bordered table-striped text-xs mb-2 whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-center align-middle" rowSpan={2} style={{ width: '3%' }}>#</th>
                                <th className="align-middle" rowSpan={2} style={{ width: '25%' }}>โครงการ/กิจกรรม (ชื่อรายการค่าใช้จ่าย)</th>
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
                            {mockData.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>
                                        <p className="font-normal text-gray-500">
                                            {item.plan_no} {item.plan_name}
                                        </p>
                                        <p className="font-normal">{item.project_name}</p>
                                        <p className="font-bold text-primary">{item.activity_name}</p>
                                        <p className="text-green-600 font-semibold mt-1">
                                            - {item.expense_name}
                                        </p>
                                    </td>
                                    <td>
                                        <p><b>หน่วย:</b> {item.unit}</p>
                                        <p><b>เป้า:</b> {item.target}</p>
                                        <p className="text-blue-600 font-bold"><b>งบ:</b> {currency.format(item.budget)}</p>
                                    </td>
                                    <td className="text-right">{currency.format(item.expenses.oct)}</td>
                                    <td className="text-right">{currency.format(item.expenses.nov)}</td>
                                    <td className="text-right">{currency.format(item.expenses.dec)}</td>
                                    <td className="text-right">{currency.format(item.expenses.jan)}</td>
                                    <td className="text-right">{currency.format(item.expenses.feb)}</td>
                                    <td className="text-right">{currency.format(item.expenses.mar)}</td>
                                    <td className="text-right">{currency.format(item.expenses.apr)}</td>
                                    <td className="text-right">{currency.format(item.expenses.may)}</td>
                                    <td className="text-right">{currency.format(item.expenses.jun)}</td>
                                    <td className="text-right">{currency.format(item.expenses.jul)}</td>
                                    <td className="text-right">{currency.format(item.expenses.aug)}</td>
                                    <td className="text-right">{currency.format(item.expenses.sep)}</td>
                                    <td className="text-right font-bold text-green-700 bg-green-50">
                                        {currency.format(item.total)}
                                    </td>
                                </tr>
                            ))}
                            {mockData.length === 0 && (
                                <tr>
                                    <td colSpan={16} className="text-center">ไม่พบข้อมูล</td>
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
