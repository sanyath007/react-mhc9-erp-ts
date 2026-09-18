import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { getBudgetExpense, destroy } from '../../../features/slices/budget-expense/budgetExpenseSlice';
import { currency, toShortTHDate } from '../../../utils';
import DetailModal from './DetailModal';
import MasterModal from './MasterModal';
import BudgetTypeBadge from '../../../components/Badges/BudgetTypeBadge';
import { MONTH_TH_SHNAMES } from '../../../constants/date-time';

const BudgetExpenseDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { expense, isLoading } = useSelector((state: any) => state.budgetExpense);

    const [showMasterModal, setShowMasterModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getBudgetExpense(id));
        }
    }, [dispatch, id]);

    const handleDelete = async () => {
        if (window.confirm('คุณต้องการลบข้อมูลค่าใช้จ่ายนี้ใช่หรือไม่?')) {
            dispatch(destroy(id as string)).then(() => {
                window.location.href = '/budget-expense';
            });
        }
    };

    if (isLoading) return <div className="p-4">กำลังโหลดข้อมูล...</div>;
    if (!expense) return <div className="p-4">ไม่พบข้อมูล</div>;

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-expense' }}>ค่าใช้จ่ายงบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดค่าใช้จ่าย</Breadcrumb.Item>
            </Breadcrumb>
            <div className="content">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl">รายละเอียดค่าใช้จ่าย</h2>
                    <div>
                        <button className="btn btn-warning mr-2" onClick={() => setShowMasterModal(true)}>
                            <FaPencilAlt className="inline mr-1" /> แก้ไขข้อมูลหลัก
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            <FaTrash className="inline mr-1" /> ลบข้อมูล
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-4">
                    <h4 className="text-primary font-bold border-b pb-2 mb-3">1. ข้อมูลค่าใช้จ่ายหลัก</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500 font-semibold">ปีงบประมาณ:</span> {expense.year + 543}
                        </div>
                        <div>
                            <span className="text-gray-500 font-semibold">ประเภทค่าใช้จ่าย:</span> {expense.expense_type?.name || expense.expense_name || '-'}
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500 font-semibold">แผนงาน:</span>
                            <div className='bg-blue-50 rounded-md p-3 border border-blue-200 text-sm'>
                                <p>{expense.budget?.activity?.project?.plan?.name} ({expense.budget?.activity?.project?.name})</p>
                                <p>{expense.budget?.activity?.name} <BudgetTypeBadge type={expense.budget?.type} /></p>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500 font-semibold">โครงการ/กิจกรรม:</span> {expense.project?.name}
                        </div>
                        <div>
                            <span className="text-gray-500 font-semibold">หน่วยนับ:</span> {expense.unit_text || expense.unit || '-'}
                        </div>
                        <div>
                            <span className="text-gray-500 font-semibold">เป้าหมาย:</span> {expense.target || '-'}
                        </div>
                        <div>
                            <span className="text-gray-500 font-semibold">จำนวนเงิน:</span> <span className="text-blue-600 font-bold">{currency.format(expense.amount || expense.budget || 0)}</span> บาท
                        </div>
                        <div>
                            <span className="text-gray-500 font-semibold">คำอธิบาย:</span> {expense.description || '-'}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-primary font-bold">2. รายละเอียดการเบิกจ่าย</h4>
                        <button className="btn btn-success btn-sm" onClick={() => setShowDetailModal(true)}>
                            <FaPlus className="inline mr-1" /> เพิ่มรายละเอียด
                        </button>
                    </div>

                    <table className="table table-bordered table-striped text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[10%]">เดือน/ปี</th>
                                <th className="text-center w-[15%]">เลขที่ขอเบิก | วันที่ขอเบิก</th>
                                <th className="text-center w-[15%]">เลขที่ขอจ่าย | วันที่ขอจ่าย</th>
                                <th className="text-center">ผู้รับเงิน</th>
                                <th className="text-center w-[15%]">จำนวนเงินสุทธิ</th>
                                <th className="text-center w-[10%]">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!expense.details || expense.details.length === 0) ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-gray-500 py-4">
                                        -- ยังไม่มีข้อมูลรายละเอียดค่าใช้จ่าย --
                                    </td>
                                </tr>
                            ) : (
                                expense.details.map((detail: any, index: number) => (
                                    <tr key={detail.id || index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{MONTH_TH_SHNAMES[detail.month - 1]}/{detail.year + 543}</td>
                                        <td className="text-center">
                                            {detail.withdrawal_no || '-'}{' | '}
                                            {toShortTHDate(detail.withdrawal_at || '')}
                                        </td>
                                        <td className="text-center">
                                            {detail.payment_no || '-'}{' | '}
                                            {toShortTHDate(detail.payment_at || '')}
                                        </td>
                                        <td>{detail.supplier?.name || '-'}</td>
                                        <td className="text-right">{currency.format(detail.net_total || detail.amount || 0)}</td>
                                        <td className="text-center">
                                            <button className="btn btn-warning btn-sm mx-1"><FaPencilAlt /></button>
                                            <button className="btn btn-danger btn-sm mx-1"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <MasterModal
                isShow={showMasterModal}
                onHide={() => setShowMasterModal(false)}
                expenseData={expense}
                onSaveSuccess={() => {
                    setShowMasterModal(false);
                    dispatch(getBudgetExpense(id as string));
                }}
            />

            <DetailModal
                isShow={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                initialYear={expense.year}
                expenseId={expense.id}
                onSave={() => {
                    setShowDetailModal(false);
                    dispatch(getBudgetExpense(id as string));
                }}
            />
        </div>
    )
}

export default BudgetExpenseDetail;
