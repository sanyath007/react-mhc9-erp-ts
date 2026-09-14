import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import {
    FaShoppingCart,
    FaTools,
    FaFileInvoiceDollar,
    FaBoxOpen,
    FaCheckCircle,
    FaClock,
    FaRegCalendarAlt,
    FaMoneyBillWave,
    FaCoins,
    FaChartPie
} from 'react-icons/fa'
import { Breadcrumb } from 'react-bootstrap'
import { useGetSystemInfoQuery } from '../../features/services/system/systemApi'
import Loading from '../../components/ui/Loading'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend,
    ArcElement
);

const Home = () => {
    const [cookies, setCookie] = useCookies(['budgetYear']);
    const { data: system, isLoading } = useGetSystemInfoQuery();

    useEffect(() => {
        if (system) {
            setCookie('budgetYear', system.year);
        }
    }, [system, setCookie]);

    // Mock Data for Requisitions by Product Type
    const reqChartData = {
        labels: ['วัสดุสำนักงาน', 'ครุภัณฑ์คอมพิวเตอร์', 'งานบ้านงานครัว', 'จ้างเหมาบริการ'],
        datasets: [
            {
                label: 'มูลค่าคำขอ (บาท)',
                data: [150000, 450000, 85000, 320000],
                backgroundColor: 'rgba(139, 92, 246, 0.8)', // violet-500
                borderRadius: 4,
            }
        ]
    };

    const reqChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    // Mock Data for Loans by Type
    const loanChartData = {
        labels: ['เดินทางไปราชการ', 'จัดโครงการ/อบรม', 'ค่าลงทะเบียน'],
        datasets: [
            {
                data: [150000, 450000, 25000],
                backgroundColor: [
                    'rgba(236, 72, 153, 0.8)', // pink-500
                    'rgba(14, 165, 233, 0.8)', // sky-500
                    'rgba(245, 158, 11, 0.8)', // sky-500
                ],
                borderWidth: 0,
            }
        ]
    };

    // Mock Data for Charts
    const barChartData = {
        labels: ['บริหารทั่วไป', 'เทคโนโลยีสารสนเทศ', 'วิชาการ', 'การเงิน', 'พัสดุ'],
        datasets: [
            {
                label: 'งบประมาณที่ใช้ (บาท)',
                data: [1250000, 850000, 420000, 310000, 960000],
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
                borderRadius: 4,
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    const doughnutData = {
        labels: ['งบบุคลากร', 'งบดำเนินงาน', 'งบลงทุน', 'เงินนอกงบประมาณ'],
        datasets: [
            {
                data: [45, 30, 15, 10],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // blue-500
                    'rgba(16, 185, 129, 0.8)', // emerald-500
                    'rgba(245, 158, 11, 0.8)', // amber-500
                    'rgba(139, 92, 246, 0.8)'  // violet-500
                ],
                borderWidth: 0,
            }
        ]
    };

    const doughnutOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        },
        cutout: '70%'
    };

    // Mock Data for Table
    const recentLoans = [
        { id: 'LN-6610-015', title: 'ยืมเงินเดินทางไปราชการ (ขอนแก่น)', date: '15 ต.ค. 2566', amount: '4,500.00', status: 'pending' },
        { id: 'LN-6610-014', title: 'โครงการอบรมสุขภาพจิตชุมชน', date: '12 ต.ค. 2566', amount: '25,000.00', status: 'approved' },
        { id: 'LN-6610-013', title: 'ยืมเงินเดินทางไปราชการ (กทม.)', date: '08 ต.ค. 2566', amount: '8,200.00', status: 'refunded' },
        { id: 'LN-6610-012', title: 'โครงการประเมินผลประจำปี', date: '01 ต.ค. 2566', amount: '12,000.00', status: 'refunded' },
    ];

    return (
        <div className="content-wrapper p-4 min-h-[calc(100vh-132px)]">
            {/* breadcrumb */}
            <Breadcrumb className="bg-transparent pb-2 m-0 border-0">
                <Breadcrumb.Item href="/" className="text-blue-600 text-sm">หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active className="text-sm">Dashboard</Breadcrumb.Item>
            </Breadcrumb>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-500 rounded-2xl p-8 mb-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="font-extrabold text-3xl mb-2 drop-shadow-md">
                        Welcome to MHC9 ERP System
                    </h1>
                    <p className="text-blue-400 text-lg font-semibold flex items-center">
                        <FaRegCalendarAlt className="mr-2" />
                        ปีงบประมาณ {isLoading ? <span className="ml-2 inline-block"><Loading /></span> : (cookies.budgetYear ? cookies.budgetYear + 543 : '2567')}
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
            </div>

            {/* Top Stat Cards (Overall Totals) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Budget */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 shadow-md text-white flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">ยอดงบประมาณทั้งหมด</p>
                        <h3 className="text-3xl font-bold">45.5 <span className="text-base font-normal text-blue-200">ลบ.</span></h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full">
                        <FaChartPie size={32} />
                    </div>
                </div>
                {/* Total Loan */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl p-6 shadow-md text-white flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div>
                        <p className="text-pink-100 text-sm font-medium mb-1">ยอดสัญญายืมเงินทั้งหมด</p>
                        <h3 className="text-3xl font-bold">2.8 <span className="text-base font-normal text-pink-200">ลบ.</span></h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full">
                        <FaMoneyBillWave size={32} />
                    </div>
                </div>
                {/* Total Procurement */}
                <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl p-6 shadow-md text-white flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div>
                        <p className="text-violet-100 text-sm font-medium mb-1">ยอดการจัดซื้อ/จ้างทั้งหมด</p>
                        <h3 className="text-3xl font-bold">18.2 <span className="text-base font-normal text-violet-200">ลบ.</span></h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full">
                        <FaCoins size={32} />
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                        <FaFileInvoiceDollar size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">สัญญายืมเงินรอดำเนินการ</p>
                        <h3 className="text-2xl font-bold text-gray-800">8 <span className="text-sm font-normal text-gray-400">ฉบับ</span></h3>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                        <FaShoppingCart size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">คำขอซื้อ/จ้าง รออนุมัติ</p>
                        <h3 className="text-2xl font-bold text-gray-800">14 <span className="text-sm font-normal text-gray-400">รายการ</span></h3>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                        <FaBoxOpen size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">มูลค่าครุภัณฑ์ทั้งหมด</p>
                        <h3 className="text-2xl font-bold text-gray-800">12.5 <span className="text-sm font-normal text-gray-400">ลบ.</span></h3>
                    </div>
                </div>
                {/* Card 4 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-amber-100 p-4 rounded-full text-amber-600">
                        <FaTools size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">แจ้งปัญหาไอที (วันนี้)</p>
                        <h3 className="text-2xl font-bold text-gray-800">5 <span className="text-sm font-normal text-gray-400">งาน</span></h3>
                    </div>
                </div>
            </div>

            {/* Charts 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Requisition Bar Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="w-1.5 h-6 bg-violet-500 rounded-full mr-2"></span>
                        มูลค่าคำขอซื้อ/จ้างแยกตามประเภทสินค้า
                    </h3>
                    <div className="h-72">
                        <Bar data={reqChartData} options={reqChartOptions} />
                    </div>
                </div>

                {/* Loan Doughnut Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="w-1.5 h-6 bg-pink-500 rounded-full mr-2"></span>
                        สัดส่วนมูลค่าสัญญายืมเงิน
                    </h3>
                    <div className="h-64 flex justify-center items-center">
                        <Doughnut data={loanChartData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            {/* Charts 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-2"></span>
                        มูลค่าการใช้งบประมาณแยกตามแผนก
                    </h3>
                    <div className="h-72">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-2"></span>
                        สัดส่วนการใช้งบประมาณ
                    </h3>
                    <div className="h-64 flex justify-center items-center">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-2"></span>
                        รายการสัญญายืมเงินล่าสุด
                    </h3>
                    <button className="text-blue-600 text-sm hover:underline font-medium">ดูทั้งหมด</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">เลขที่สัญญา</th>
                                <th className="px-4 py-3">รายละเอียดการยืม</th>
                                <th className="px-4 py-3">วันที่ยืม</th>
                                <th className="px-4 py-3">จำนวนเงิน (บาท)</th>
                                <th className="px-4 py-3 rounded-tr-lg">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLoans.map((loan, index) => (
                                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{loan.id}</td>
                                    <td className="px-4 py-3">{loan.title}</td>
                                    <td className="px-4 py-3 flex items-center text-gray-500">
                                        <FaClock className="mr-1.5 opacity-70" /> {loan.date}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-700">{loan.amount}</td>
                                    <td className="px-4 py-3">
                                        {loan.status === 'pending' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                รอดำเนินการ
                                            </span>
                                        )}
                                        {loan.status === 'approved' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                อนุมัติแล้ว
                                            </span>
                                        )}
                                        {loan.status === 'refunded' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <FaCheckCircle className="mr-1" /> หักล้างแล้ว
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home