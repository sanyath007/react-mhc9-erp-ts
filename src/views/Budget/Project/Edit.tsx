import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getBudgetProject, resetSuccess } from '../../../features/slices/budget-project/budgetProjectSlice'
import BudgetProjectForm from './Form'
import Loading from '../../../components/ui/Loading'

const EditBudgetProject = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { project, isLoading, isSuccess } = useSelector((state: any) => state.budgetProject);

    useEffect(() => {
        if (id) dispatch(getBudgetProject(id));
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกการแก้ไขสำเร็จ!!');
            dispatch(resetSuccess());
        }
    })

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/budget-project${project ? '/' + project.year + '/' + project.plan_id : ''}` }}>โครงการ/ผลผลิต</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขโครงการ/ผลผลิต</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">แก้ไขโครงการ/ผลผลิต (#{id})</h2>
                </div>

                <div className="border rounded-md py-5">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && project) && <BudgetProjectForm project={project} />}
                </div>
            </div>
        </div>
    )
}

export default EditBudgetProject