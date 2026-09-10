import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import moment from 'moment'
import { generateQueryString, getUrlParam } from '../../../utils'
import { getBudgetProjects, resetDeleted, destroy } from '../../../features/slices/budget-project/budgetProjectSlice'
import FilteringInputs from './FilteringInputs'
import Loading from '../../../components/ui/Loading'
import Pagination from '../../../components/ui/Pagination'

const BudgetProjectList = () => {
    const { year: _year, plan } = useParams();
    const dispatch = useDispatch();
    const { projects, pager, isLoading, isDeleted } = useSelector(state => state.budgetProject);
    const [year, setYear] = useState(_year || moment().year());
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString({ year: year ? year : moment().year(), plan: plan ? plan : '' }));

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getBudgetProjects({ url: `/api/budget-projects/search?page=${params}` }));
        } else {
            dispatch(getBudgetProjects({ url: `${endpoint}${params}` }));
        }
    }, [endpoint]);

    useEffect(() => {
        if (isDeleted) {
            toast.success('ลบรายการโครงการ/ผลผลิตสำเร็จ!!');
            dispatch(resetDeleted());
            setEndpoint(prev => prev === '' ? '`/api/budget-projects/search?page=' : '');
        }
    }, [isDeleted]);

    const handleDelete = (id) => {
        if (window.confirm(`คุณต้องการลบรายการโครงการ/ผลผลิต รหัส ${id} ใช่หรือไม่?`)) {
            dispatch(destroy(id));
        }
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>งบประมาณ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/budget-plan' }}>แผนงาน</Breadcrumb.Item>
                <Breadcrumb.Item active>โครงการ/ผลผลิต</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">โครงการ/ผลผลิต</h2>
                    <Link to={`/budget-project/add${_year !== '' ? '/' + _year + '/' + plan : ''}`} className="btn btn-primary">
                        เพิ่มรายการ
                    </Link>
                </div>

                <FilteringInputs
                    initialFilters={{ year: year !== '' ? year : moment().year(), plan: plan ? plan : '' }}
                    onFilter={(queryStr) => {
                        setParams(queryStr);
                        setEndpoint(prev => prev === '' ? `/api/budget-projects/search?page=` : '');
                        setYear(getUrlParam(queryStr, 'year'));
                    }}
                />
                <div>
                    <table className="table table-bordered table-striped table-hover text-sm">
                        <thead>
                            <tr>
                                <th className="w-[5%] text-center">#</th>
                                <th>โครงการ/ผลผลิต</th>
                                <th className="w-[18%] text-center">รหัส New GFMIS</th>
                                <th className="w-[10%] text-center">ปีงบประมาณ</th>
                                <th className="w-[10%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center"><Loading /></td>
                                </tr>
                            )}
                            {!isLoading && projects.map((project, index) => (
                                <tr key={project.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>
                                        <p className="font-thin">{project.plan?.plan_no} {project.plan?.name}</p>
                                        <p className="font-bold hover:text-purple-500">
                                            <Link to={`/budget-activity${year !== '' ? '/' + year : ''}/${project.id}`}>
                                                {project.name}
                                            </Link>
                                        </p>
                                    </td>
                                    <td className="text-center font-bold">{project.gfmis_id}</td>
                                    <td className="text-center">{project.year && project.year + 543}</td>
                                    <td className="text-center p-1">
                                        <Link to={`/budget-project/${project.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(project.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pager && (
                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setEndpoint(url)}
                    />
                )}
            </div>
        </div>
    )
}

export default BudgetProjectList