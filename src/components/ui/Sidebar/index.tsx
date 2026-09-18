import React from 'react'
import { Link } from 'react-router-dom'
import { FaTimes, FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { useGetUserDetailsQuery } from '../../../features/services/auth/authApi'
import './Sidebar.css'

interface SidebarProps {
    isShow: boolean;
    toggleShow: (show: boolean) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isShow, toggleShow, onLogout }) => {
    const { data: user, isFetching } = useGetUserDetailsQuery(undefined, { pollingInterval: 900000 });

    return (
        <div className={`sidebar border absolute top-0 w-[220px] h-full overflow-scroll ${isShow ? 'left-0' : 'left-[-220px]'} bg-white lg:hidden transition-all ease-in-out delay-300 z-[999]`}>
            <div className={`relative p-2 h-full ${isShow ? 'menu-link justify-between' : 'hidden'} overflow-hidden`}>
                <div>
                    <div className="w-full text-black py-2 flex flex-row justify-end items-center mb-3">
                        <FaTimes className="hover:text-blue-600 cursor-pointer" onClick={() => toggleShow(!isShow)} />
                    </div>
                    <div>
                        {[1].includes(user?.permissions[0]?.role_id) && (
                            <>
                                <div className="menu-link">
                                    <button type="button">
                                        บริการ
                                        <FaAngleDown />
                                    </button>
                                    <ul className="sub-menus">
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/task"><p className="w-full">รายการแจ้งปัญหา</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/task/add"><p className="w-full">แจ้งปัญหา</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/repairation"><p className="w-full">รายการส่งซ่อม</p></Link>
                                        </li>
                                    </ul>
                                </div>

                                <hr className="border-b-1 border-gray-400 m-0" />
                            </>
                        )}

                        <>
                            <div className="menu-link">
                                <button type="button" className="text-black text-left p-2 hover:bg-blue-500 rounded-md flex flex-row items-center justify-between">
                                    จัดซื้อจัดจ้าง
                                    <FaAngleDown />
                                </button>
                                <ul className="sub-menus">
                                    <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                        <Link to="/requisition"><p className="w-full">คำขอซื้อ/จ้าง</p></Link>
                                    </li>
                                    {[1, 3, 5].includes(user?.permissions[0]?.role_id) && (
                                        <>
                                            <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                                <Link to="/order"><p className="w-full">ใบสั่งซื้อ/จ้าง</p></Link>
                                            </li>
                                            <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                                <Link to="/inspection"><p className="w-full">ตรวจรับพัสดุ</p></Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            <hr className="border-1 border-gray-400 m-0" />
                        </>

                        <>
                            <div className="menu-link">
                                <button type="button" className="text-black text-left p-2 hover:bg-blue-500 rounded-md flex flex-row items-center justify-between">
                                    ยืมเงินราชการ
                                    <FaAngleDown />
                                </button>
                                <ul className="sub-menus">
                                    <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                        <Link to="/loan"><p className="w-full">คำขอยืมเงิน</p></Link>
                                    </li>
                                    {[1, 4, 5].includes(user?.permissions[0]?.role_id) && (
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/loan-contract"><p className="w-full">สัญญายืมเงิน</p></Link>
                                        </li>
                                    )}
                                    <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                        <Link to="/loan-refund"><p className="w-full">หักล้างเงินยืม</p></Link>
                                    </li>
                                    {[1, 4, 5].includes(user?.permissions[0]?.role_id) && (
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/loan-report"><p className="w-full">ทะเบียนคุม</p></Link>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <hr className="border-1 border-gray-400 m-0" />
                        </>

                        {[1, 4, 5].includes(user?.permissions[0]?.role_id) && (
                            <>
                                <div className="menu-link">
                                    <button type="button" className="text-black text-left p-2 hover:bg-blue-500 rounded-md flex flex-row items-center justify-between">
                                        งบประมาณและการเงิน
                                        <FaAngleDown />
                                    </button>
                                    <ul className="sub-menus">
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/project"><p className="w-full">โครงการ</p></Link>
                                        </li>
                                    </ul>
                                </div>
                                <hr className="border-1 border-gray-400 m-0" />
                            </>
                        )}

                        {[1, 3, 4, 5].includes(user?.permissions[0]?.role_id) && (
                            <>
                                <div className="menu-link">
                                    <button type="button" className="text-black text-left p-2 hover:bg-blue-500 rounded-md flex flex-row items-center justify-between">
                                        ข้อมูลพื้นฐาน
                                        <FaAngleDown />
                                    </button>
                                    <ul className="sub-menus">
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/asset"><p className="w-full">ครุภัณฑ์</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/comset"><p className="w-full">ชุดคอมพิวเตอร์</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/material"><p className="w-full">วัสดุ</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/asset-type"><p className="w-full">ประเภทพัสดุ</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/asset-category"><p className="w-full">ชนิดพัสดุ</p></Link>
                                        </li>
                                        {/* <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/equipment"><p className="w-full">อุปกรณ์</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/equipment-type"><p className="w-full">ประเภทอุปกรณ์</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/equipment-group"><p className="w-full">กลุ่มอุปกรณ์</p></Link>
                                        </li> */}
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/employee"><p className="w-full">บุคลากร</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/department"><p className="w-full">กลุ่มงาน</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/division"><p className="w-full">งาน</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/room"><p className="w-full">ห้อง</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/item"><p className="w-full">สินค้า/บริการ</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/supplier"><p className="w-full">ผู้จัดจำหน่าย</p></Link>
                                        </li>
                                        <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                            <Link to="/unit"><p className="w-full">หน่วย</p></Link>
                                        </li>
                                        {[1, 4, 5].includes(user?.permissions[0]?.role_id) && (
                                            <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                                <Link to="/budget-plan"><p className="w-full">งบประมาณ</p></Link>
                                            </li>
                                        )}
                                        {[1].includes(user?.permissions[0]?.role_id) && (
                                            <li className="hover:bg-gray-300 font-thin py-2 pl-4 rounded-md" onClick={() => toggleShow(false)}>
                                                <Link to="/place"><p className="w-full">สถานที่</p></Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 text-black p-2 w-full">
                    <button
                        type="button"
                        className="hover:bg-blue-500 hover:text-white p-2 rounded-md w-full flex flex-row items-center justify-center gap-1"
                        onClick={onLogout}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
