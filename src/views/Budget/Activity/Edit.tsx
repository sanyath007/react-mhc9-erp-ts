import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { getActivity, resetSuccess } from '../../../features/slices/budget-activity/budgetActivitySlice'
import BudgetActivityForm from './Form'
import Loading from '../../../components/ui/Loading'
import { toast } from 'react-toastify'

const EditBudgetActivity = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { activity, isLoading, isSuccess } = useSelector((state: any) => state.budgetActivity);

    useEffect(() => {
        if (id) dispatch(getActivity(id));
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกการแก้ไขงบประมาณสำเร็จ!!")
            dispatch(resetSuccess());
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/budget-project${activity ? '/' + activity.year + '/' + activity.project?.plan_id : ''}` }}>โครงการ/ผลผลิต</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/budget-activity${activity ? '/' + activity.year + '/' + activity.project_id : ''}` }}>กิจกรรม</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขกิจกรรม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">แก้ไขกิจกรรม (#{id})</h2>
                </div>

                <div className="border rounded-md py-5">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && activity) && <BudgetActivityForm activity={activity} />}
                </div>
            </div>
        </div>
    )
}

export default EditBudgetActivity