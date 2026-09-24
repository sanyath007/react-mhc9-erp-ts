import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { getAllocationsByBudget, destroy, resetDeleted } from '../../../features/slices/budget-allocation/budgetAllocationSlice'
import { getBudget } from '../../../features/slices/budget/budgetSlice'
import { currency, toShortTHDate } from '../../../utils'
import Loading from '../../../components/ui/Loading'
import BudgetTypeBadge from '../../../components/Badges/BudgetTypeBadge'

const AllocationList = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { allocations, pager, isLoading, isDeleted } = useSelector((state: any) => state.budgetAllocation);
    const { budget } = useSelector((state: any) => state.budget);
    const [endpoint, setEndpoint] = useState('');

    useEffect(() => {
        if (id) dispatch(getBudget(id));
    }, [id]);

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getAllocationsByBudget(id));
        } else {
            // dispatch(getAllocationsByBudget({ url: `${endpoint}` }));
        }
    }, [endpoint]);

    useEffect(() => {
        if (isDeleted) {
            toast.success("ลบข้อมูลจัดสรรเงินสำเร็จ!!");
            dispatch(resetDeleted());

            // re-fetch data
            dispatch(getBudget(id))
            dispatch(getAllocationsByBudget(id));
        }
    }, [isDeleted]);

    const handleDelete = (allocationId) => {
        if (window.confirm(`คุณต้องการลบรายการจัดสรรเงิน ID: ${allocationId} ใช่หรือไม่?`)) {
            dispatch(destroy(allocationId));
        }
    };

    const renderAllocationType = (type) => {
        if (type === 1) {
            return <span className="badge rounded-pill text-bg-success">รับโอน</span>
        } else {
            return <span className="badge rounded-pill text-bg-danger">โอนออก</span>
        }
    };

    const renderAllocationTotal = (type, total) => {
        if (type === 1) {
            return <span className="text-green-600">{currency.format(total)}</span>
        } else {
            return <span className="text-red-600">-{currency.format(total)}</span>
        }
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget/allocation' }}>สรุปยอดจัดสรรงบ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการจัดสรรงบ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการจัดสรรงบ</h2>
                    <div className="flex flex-row gap-1">
                        <Link to={`/budget/allocation/budget/${id}/add`} className="btn btn-primary">
                            เพิ่มรายการ
                        </Link>
                    </div>
                </div>

                <div>
                    {/* ======================== Budget Detail ======================== */}
                    {isLoading && <div className="text-center mb-3"><Loading /></div>}

                    {(!isLoading && budget) && (
                        <div className="border rounded-md py-3 px-4 mb-2 leading-6">
                            <p className="text-gray-500">{budget.activity?.project?.plan?.name}</p>
                            <p className="font-semibold">{budget.activity?.project?.name}</p>
                            <p className="font-bold text-blue-600 mr-1">{budget.activity?.name}</p>
                            <p>
                                <span className="mr-4"><b>ปีงบประมาณ</b> {budget?.activity && budget?.activity?.year + 543}</span>
                                <span><b>ประเภท</b> {budget?.type && <BudgetTypeBadge type={budget?.type} />}</span>
                            </p>
                            <p><b>ยอดจัดสรรแล้ว</b> {currency.format(budget.total)} <b>บาท</b></p>
                        </div>
                    )}
                    {/* ======================== Budget Detail ======================== */}

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[20%]">อ้างอิง</th>
                                <th>รายละเอียด</th>
                                <th className="text-center w-[20%]">หน่วยรับ/คืน</th>
                                <th className="text-center w-[8%]">ประเภท</th>
                                <th className="text-center w-[15%]">ยอดโอน</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan={7} className="text-center"><span><Loading /></span></td></tr>}
                            {(!isLoading && allocations && allocations.length > 0) && allocations.map((allocation, index) => (
                                <tr key={allocation.id}>
                                    <td className="text-center">{++index}</td>
                                    <td className="text-left">
                                        <p className="font-thin text-sm"><b>เลขที่</b> {allocation.doc_no}</p>
                                        <p className="font-thin text-sm"><b>วันที่</b> {toShortTHDate(allocation.doc_date)}</p>
                                    </td>
                                    <td className="text-xs">{allocation.description}</td>
                                    <td className="text-center">{allocation.agency?.name}</td>
                                    <td className="text-center">
                                        {renderAllocationType(allocation.allocate_type_id)}
                                    </td>
                                    <td className="text-center">
                                        {renderAllocationTotal(allocation.allocate_type_id, allocation.total)}
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/budget/allocation/budget/${id}/${allocation.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(allocation.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!isLoading && allocations.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <span className="text-sm text-red-600 font-thin">-- ไม่มีรายการ --</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AllocationList