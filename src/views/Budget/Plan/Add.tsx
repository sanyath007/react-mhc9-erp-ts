import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../../features/slices/budget-plan/budgetPlanSlice'
import BudgetPlanForm from './Form'

const AddBudgetPlan = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.budgetPlan);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลแผนงานสำเร็จ!!");
            dispatch(resetSuccess());
            navigate('/budget-plan');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มแผนงาน</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">เพิ่มแผนงาน</h2>
                </div>

                <BudgetPlanForm />
            </div>
        </div>
    )
}

export default AddBudgetPlan