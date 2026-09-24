import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { getBudget } from '../../../features/slices/budget/budgetSlice'
import { getAllocation, resetSuccess } from '../../../features/slices/budget-allocation/budgetAllocationSlice'
import AllocationForm from './Form'
import Loading from '../../../components/ui/Loading'
import { toast } from 'react-toastify'

const EditAllocation = () => {
    const { id, allocationId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { budget, isLoading } = useSelector((state: any) => state.budget);
    const { allocation, isSuccess } = useSelector((state: any) => state.budgetAllocation);

    useEffect(() => {
        if (id) {
            dispatch(getBudget(id));
            dispatch(getAllocation(allocationId));
        }
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('แก้ไขการจัดสรรงบสำเร็จ!!');
            dispatch(resetSuccess());
            navigate(-1);
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget/allocation' }}>สรุปยอดจัดสรรงบ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/budget/allocation/budget/${id}` }}>รายการจัดสรรงบ</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขการจัดสรรงบ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">แก้ไขการจัดสรรงบ</h2>
                </div>
            </div>

            <div className="border rounded-md py-3 px-3">
                {isLoading && <div className="text-center"><Loading /></div>}
                {(!isLoading && budget) && <AllocationForm budget={budget} allocation={allocation} />}
            </div>
        </div>
    )
}

export default EditAllocation