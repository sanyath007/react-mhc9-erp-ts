import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaCubes } from 'react-icons/fa'
import { useGetUserDetailsQuery } from '../../../features/services/auth/authApi'
import NavMenuItem from './NavMenuItem'
import './Navbar.css'
import UserProfile from './UserProfile'

interface NavbarProps {
    showSidebar: boolean;
    toggleSidebar: (show: boolean) => void;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ showSidebar, toggleSidebar, onLogout }) => {
    const { data: user, isFetching } = useGetUserDetailsQuery(undefined, { pollingInterval: 900000 });
    const location = useLocation();

    return (
        <nav className="navbar h-[72px] bg-slate-700 flex justify-between items-center px-5 text-white">
            <div className="flex justify-between w-full">
                {/* brand section */}
                <div className="flex items-center gap-3 sm:w-3/12 md:w-1/2 lg:w-4/12">
                    <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl shadow-md border border-blue-400/30">
                        <FaCubes className="text-white text-xl" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="max-md:hidden text-xl font-extrabold text-white tracking-wide">
                            MHC9 <span className="text-blue-400">ERP</span>
                        </h1>
                        <h1 className="md:hidden text-xl font-extrabold text-white tracking-wider">
                            MHC9<span className="text-blue-400">ERP</span>
                        </h1>
                        <p className="max-md:hidden text-xs text-gray-300 font-medium tracking-wide mt-[-2px]">
                            ระบบบริหารจัดการทรัพยากร
                        </p>
                    </div>
                </div>

                {/* menu items */}
                <ul className="max-lg:hidden lg:flex flex-row items-center justify-center gap-4 w-full">
                    <li><Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-blue-400 font-semibold' : 'hover:text-gray-400'}`}>หน้าหลัก</Link></li>
                    {[1].includes(user?.permissions[0]?.role_id as number) && (
                        <NavMenuItem
                            text="บริการ"
                            submenus={[
                                { type: 'menu', text: 'รายการแจ้งปัญหา', link: '/task', allowed_users: [1] },
                                { type: 'menu', text: 'แจ้งปัญหา', link: '/task/add', allowed_users: [1] },
                                { type: 'menu', text: 'รายการส่งซ่อม', link: '/repairation', allowed_users: [1] },
                            ]}
                            userRole={user?.permissions[0]?.role_id}
                        />
                    )}

                    <NavMenuItem
                        text="จัดซื้อจัดจ้าง"
                        submenus={[
                            { type: 'menu', text: 'คำขอซื้อ/จ้าง', link: '/requisition', allowed_users: [] },
                            { type: 'menu', text: 'ใบสั่งซื้อ/จ้าง', link: '/order', allowed_users: [1, 3, 5] },
                            { type: 'menu', text: 'ตรวจรับพัสดุ', link: '/inspection', allowed_users: [1, 3, 5] },
                            { type: 'divided' },
                            { type: 'menu', text: 'รายงาน', link: '/procurement/report', allowed_users: [1, 3, 5] },
                        ]}
                        userRole={user?.permissions[0]?.role_id}
                    />
                    <NavMenuItem
                        text="ยืมเงินราชการ"
                        submenus={[
                            { type: 'menu', text: 'คำขอยืมเงิน', link: '/loan', allowed_users: [] },
                            { type: 'menu', text: 'สัญญายืมเงิน', link: '/loan-contract', allowed_users: [1, 4, 5] },
                            { type: 'menu', text: 'หักล้างเงินยืม', link: '/loan-refund', allowed_users: [] },
                            { type: 'menu', text: 'ทะเบียนคุม', link: '/loan-report', allowed_users: [1, 4, 5] },
                        ]}
                        userRole={user?.permissions[0]?.role_id}
                    />

                    {[1, 3, 4, 5].includes(user?.permissions[0]?.role_id as number) && (
                        <NavMenuItem
                            text="ข้อมูลพื้นฐาน"
                            submenus={[
                                {
                                    type: 'group',
                                    text: 'พัสดุและครุภัณฑ์',
                                    submenus: [
                                        { type: 'menu', text: 'ครุภัณฑ์', link: '/asset', allowed_users: [1, 3] },
                                        { type: 'menu', text: 'ชุดคอมพิวเตอร์', link: '/comset', allowed_users: [1] },
                                        { type: 'menu', text: 'วัสดุ', link: '/material', allowed_users: [1] },
                                        { type: 'menu', text: 'ประเภทพัสดุ', link: '/asset-type', allowed_users: [1] },
                                        { type: 'menu', text: 'ชนิดพัสดุ', link: '/asset-category', allowed_users: [1] },
                                    ]
                                },
                                {
                                    type: 'group',
                                    text: 'บุคลากรและหน่วยงาน',
                                    submenus: [
                                        { type: 'menu', text: 'บุคลากร', link: '/employee', allowed_users: [1] },
                                        { type: 'menu', text: 'กลุ่มงาน', link: '/department', allowed_users: [1] },
                                        { type: 'menu', text: 'งาน', link: '/division', allowed_users: [1] },
                                    ]
                                },
                                {
                                    type: 'group',
                                    text: 'สินค้าและผู้จัดจำหน่าย',
                                    submenus: [
                                        { type: 'menu', text: 'สินค้า/บริการ', link: '/item', allowed_users: [1, 3] },
                                        { type: 'menu', text: 'หน่วยนับ', link: '/unit', allowed_users: [1, 3] },
                                        { type: 'menu', text: 'ผู้จัดจำหน่าย', link: '/supplier', allowed_users: [1, 3] },
                                    ]
                                },
                                {
                                    type: 'group',
                                    text: 'งบประมาณและการเงิน',
                                    submenus: [
                                        { type: 'menu', text: 'งบประมาณ', link: '/budget-plan', allowed_users: [1, 4, 5] },
                                        { type: 'menu', text: 'เลขที่ใบรับใบสำคัญ', link: '/loan-refund/bill', allowed_users: [1, 4, 5] },
                                    ]
                                },
                                { type: 'divided' },
                                { type: 'menu', text: 'สถานที่', link: '/place', allowed_users: [1] },
                            ]}
                            userRole={user?.permissions[0]?.role_id}
                        />
                    )}
                </ul>

                {/* user profile */}
                <div className="lg:w-4/12 flex justify-end">
                    <UserProfile
                        user={user}
                        isLoading={isFetching}
                        logout={onLogout}
                    />
                </div>

                {/* menu button on tablet and mobile */}
                <button className="lg:hidden" onClick={() => toggleSidebar(!showSidebar)}>
                    <FaBars size={20} />
                </button>
            </div>
        </nav>
    )
}

export default Navbar
