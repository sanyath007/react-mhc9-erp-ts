import React, { useEffect } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../../features/slices/budget-project/budgetProjectSlice'
import BudgetProjectForm from './Form'

const AddBudgetProject = () => {
    const { year, plan } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.budgetProject);

    useEffect(() => {
        if (isSuccess) {
            toast.success("บันทึกข้อมูลโครงการ/ผลผลิตสำเร็จ!!");
            dispatch(resetSuccess());
            navigate(-1);
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/budget-project${year !== '' ? '/' + year + '/' + plan : ''}` }}>โครงการ/ผลผลิต</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มโครงการ/ผลผลิต</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl">เพิ่มโครงการ/ผลผลิต</h2>
                    </div>

                    <div className="border rounded-md py-5">
                        <BudgetProjectForm
                            defaultYear={year}
                            defaultPlan={plan}
                        />
                    </div>
            </div>
        </div>
    )
}

export default AddBudgetProject