import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../../features/slices/budget-activity/budgetActivitySlice'
import BudgetActivityForm from './Form'

const AddBudgetActivity = () => {
    const { year, project } = useParams();
    const navigate =useNavigate();
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
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-project' }}>โครงการ/ผลผลิต</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/budget-activity${year !== '' ? '/' + year + '/' + project : ''}` }}>กิจกรรม</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มกิจกรรม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">เพิ่มกิจกรรม</h2>
                </div>

                <div className="border rounded-md py-5">
                    <BudgetActivityForm
                        defaultYear={year}
                        defaultProject={project}
                    />
                </div>
            </div>
        </div>
    )
}

export default AddBudgetActivity