import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import {
    FaPencilAlt,
    FaLandmark,
    FaRandom,
    FaRegEye,
    FaRegEyeSlash,
    FaRegUser,
    FaSearch,
    FaTrash,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import moment from 'moment'
import { currency, generateQueryString } from '../../../utils'
import { getActivities, destroy, toggle, resetDeleted } from '../../../features/slices/budget-activity/budgetActivitySlice'
import FilteringInputs from './FilteringInputs'
import Pagination from '../../../components/ui/Pagination'
import Loading from '../../../components/ui/Loading'

const BudgetActivityList = () => {
    const { year: _year, project } = useParams();
    const dispatch = useDispatch();
    const { activities, pager, isLoading, isDeleted } = useSelector(state => state.budgetActivity);
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState(
        generateQueryString({
            year: (_year !== '' && _year !== undefined) ? _year : moment().year(),
            name: '',
            plan: '',
            project: project ? project : '',
        })
    );

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getActivities({ url: `/api/budget-activities/search?page=${params}` }));
        } else {
            dispatch(getActivities({ url: `${endpoint}${params}` }));
        }
    }, [endpoint]);

    useEffect(() => {
        if (isDeleted) {
            toast.success('ลบรายการงบประมาณสำเร็จ!!');
            dispatch(resetDeleted());
            setEndpoint(prev => prev === '' ? '/api/budget-activities/search?page=' : '');
        }
    }, [isDeleted]);

    const handleDelete = (id) => {
        if (window.confirm(`คุณต้องการลบรายการงบประมาณ รหัส ${id} ใช่หรือไม่?`)) {
            dispatch(destroy(id));
        }
    };

    const handleToggleActive = (id, status) => {
        if (window.confirm(`คุณต้องการแก้ไขสถานะงบประมาณ รหัส ${id} ใช่หรือไม่?`)) {
            dispatch(toggle({ id, data: { status: status === 1 ? 0 : 1 } }));
        }
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-project' }}>โครงการ/ผลผลิต</Breadcrumb.Item>
                <Breadcrumb.Item active>กิจกรรม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการกิจกรรม</h2>
                    <div className="flex flex-row gap-1">
                        <Link to={`/budget-activity/add${_year !== '' ? '/' + _year + '/' + project : ''}`} className="btn btn-primary">
                            เพิ่มรายการ
                        </Link>
                    </div>
                </div>

                <FilteringInputs
                    initialFilters={{
                        year: (_year !== '' && _year !== undefined) ? _year : moment().year(),
                        name: '',
                        plan: '',
                        project: project ? project : '',
                    }}
                    onFilter={(queryStr) => {
                        setParams(queryStr);
                        setEndpoint(prev => prev === '' ? `/api/budget-activities/search?page=` : '');
                    }}
                />

                <div>
                    <table className="table table-bordered text-sm mb-2">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>รายการกิจกรรม</th>
                                <th className="text-center w-[18%]">รหัส New GFMIS</th>
                                <th className="text-center w-[6%]">ปีงบประมาณ</th>
                                <th className="text-center w-[6%]">สถานะ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td className="text-center" colSpan={6}><Loading /></td></tr>}
                            {!isLoading && activities?.map((activity, index) => (
                                <tr className="font-thin" key={activity.id}>
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td>
                                        <p className="font-normal">
                                            {activity.project?.plan?.plan_no} {activity.project?.plan?.name}
                                        </p>
                                        <p>{activity.project?.name} {activity.project?.gfmis_id && <span className="text-xs">({activity.project?.gfmis_id})</span>}</p>
                                        <p className="font-bold text-primary">{activity.name}</p>
                                        <BudgetTypes data={activity.budgets} />
                                    </td>
                                    <td className="text-center font-bold text-primary">{activity.gfmis_id}</td>
                                    <td className="text-center">{activity.year && activity.year + 543}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center cursor-pointer" onClick={() => handleToggleActive(activity.id, activity.status)}>
                                            {activity.status === 0
                                                ? <FaRegEyeSlash size={20} color='gray' />
                                                : <FaRegEye size={20} color='green' />
                                            }
                                        </div>
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/budget-activity/${activity.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/budget-activity/${activity.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(activity.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pager={pager}
                    onPageClick={(url) => setEndpoint(url)}
                />
            </div>
        </div>
    )
}

export default BudgetActivityList

const BudgetTypes = ({ data }) => {
    return (
        <ul className="flex flex-row items-center text-xs">
            {data && data.map(item => (
                <li className="flex flex-row items-center gap-1 mr-2" key={item.id}>
                    {item.budget_type_id === 1 && <FaRegUser />}
                    {item.budget_type_id === 2 && <FaRandom />}
                    {item.budget_type_id === 6 && <FaLandmark />}
                    <b>{item.type?.name}</b> ({currency.format(item.total)} บาท)
                </li>
            ))}
        </ul>
    );
}