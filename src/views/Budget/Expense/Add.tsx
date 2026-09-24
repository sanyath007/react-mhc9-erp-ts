import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../../features/slices/budget-activity/budgetActivitySlice'
import BudgetExpenseForm from './Form'

const AddBudgetExpense = () => {
    const { year, project } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.budgetActivity);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลกิจกรรมสำเร็จ!!");
            dispatch(resetSuccess());
            navigate(-1);
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-expense' }}>ค่าใช้จ่ายงบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มค่าใช้จ่าย</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">เพิ่มค่าใช้จ่าย</h2>
                </div>

                <div className="border rounded-md py-2">
                    <BudgetExpenseForm />
                </div>
            </div>
        </div>
    )
}

export default AddBudgetExpense