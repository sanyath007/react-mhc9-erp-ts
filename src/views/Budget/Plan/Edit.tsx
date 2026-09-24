import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getBudgetPlan, resetSuccess } from '../../../features/slices/budget-plan/budgetPlanSlice'
import BudgetPlanForm from './Form'
import Loading from '../../../components/ui/Loading'

const EditBudgetPlan = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { plan, isLoading, isSuccess } = useSelector((state: any) => state.budgetPlan);

    useEffect(() => {
        if (id) dispatch(getBudgetPlan(id));
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกการแก้ไขแผนงานสำเร็จ!!");
            dispatch(resetSuccess());
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขแผนงาน</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">แก้ไขแผนงาน</h2>
                </div>

                <div className="border rounded-md py-5">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && plan) && <BudgetPlanForm plan={plan} />}
                </div>
            </div>
        </div>
    )
}

export default EditBudgetPlan