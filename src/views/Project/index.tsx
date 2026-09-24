import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaPencilAlt, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { getProjects, destroy } from '../../features/slices/project/projectSlice';
import FilteringInputs from './FilteringInputs';
import Loading from '../../components/ui/Loading';
import Pagination from '../../components/ui/Pagination';
import { getUrlParam, toShortTHDate } from '../../utils';
import { toast } from 'react-toastify';
import BudgetTypeBadge from '../../components/Badges/BudgetTypeBadge';

const ProjectList = () => {
    const dispatch = useDispatch<any>();
    const { projects, pager, isLoading } = useSelector((state: any) => state.project);
    const [cookies] = useCookies();
    const [year, setYear] = useState(cookies.budgetYear || moment().year());
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState(`year=${year}`);

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getProjects({ url: `/api/projects/search?${params}` }));
        } else {
            dispatch(getProjects({ url: `${endpoint}&${params}` }));
        }
    }, [dispatch, endpoint, params]);

    const handleDelete = async (id: number | string) => {
        if (window.confirm('คุณต้องการลบโครงการนี้ใช่หรือไม่?')) {
            try {
                await dispatch(destroy({ id })).unwrap();
                toast.success('ลบข้อมูลสำเร็จ');
                setEndpoint(''); // Refresh list
            } catch (error) {
                toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>โครงการ/กิจกรรม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">รายการโครงการ/กิจกรรม</h2>
                    <Link to="/project/add" className="btn btn-primary text-sm flex items-center">
                        <FaPlus className="mr-1" /> เพิ่มโครงการ
                    </Link>
                </div>

                <FilteringInputs
                    initialFilters={{ year: year, name: '' }}
                    onFilter={(queryStr: string) => {
                        setParams(queryStr);
                        setEndpoint(''); // Reset to base search url
                        const yearParam = getUrlParam(queryStr, 'year');
                        if (yearParam) setYear(yearParam);
                    }}
                />

                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover text-sm mb-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-center w-[5%]">#</th>
                                <th className="w-[35%]">โครงการ</th>
                                <th className="text-center w-[15%]">วันที่ดำเนินการ</th>
                                <th className="text-center w-[20%]">เจ้าของโครงการ/หน่วยงาน</th>
                                <th className="text-center w-[10%]">สถานะ</th>
                                <th className="text-center w-[15%]">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4"><Loading /></td>
                                </tr>
                            ) : projects && projects.length > 0 ? (
                                projects.map((project: any, index: number) => (
                                    <tr key={project.id}>
                                        <td className="text-center">{pager ? pager.from + index : index + 1}</td>
                                        <td className="whitespace-normal break-words text-wrap">
                                            <Link to={`/project/${project.id}/detail`} className="font-bold text-primary hover:underline">
                                                {project.name}
                                            </Link>
                                            <div className="text-xs">
                                                <p className="mb-1">
                                                    <span className="font-semibold text-gray-700 mr-1">แผนงาน:</span>
                                                    {project?.budget?.activity?.project?.plan?.plan_no} {project?.budget?.activity?.project?.plan?.name}
                                                </p>
                                                <p className="mb-1">
                                                    <span className="font-semibold text-gray-700 mr-1">โครงการ/ผลผลิต:</span>
                                                    {project?.budget?.activity?.project?.name}
                                                </p>
                                                <p className="mb-1">
                                                    <span className="font-semibold text-gray-700 mr-1">กิจกรรม:</span>
                                                    {project?.budget?.activity?.name}
                                                    <BudgetTypeBadge type={project?.budget?.type} />
                                                </p>
                                            </div>
                                            {project.year && (
                                                <div className="text-gray-500 text-xs">
                                                    ปีงบประมาณ: {project.year + 543}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {project.from_date ? toShortTHDate(project.from_date) : '-'} <br />
                                            ถึง <br />
                                            {project.to_date ? toShortTHDate(project.to_date) : '-'}
                                        </td>
                                        <td className="text-center">
                                            <div>{project.owner?.employee ? `${project.owner.employee.firstname} ${project.owner.employee.lastname}` : '-'}</div>
                                            <div className="text-gray-500 text-xs">{project.division?.name || '-'}</div>
                                        </td>
                                        <td className="text-center">
                                            {project.status === 1 ? (
                                                <span className="badge bg-success">ใช้งาน</span>
                                            ) : (
                                                <span className="badge bg-danger">ยกเลิก</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                                <Link to={`/project/${project.id}/detail`} className="btn btn-sm btn-info px-2" title="รายละเอียด">
                                                    <FaSearch />
                                                </Link>
                                                <Link to={`/project/${project.id}/edit`} className="btn btn-sm btn-warning px-2" title="แก้ไข">
                                                    <FaPencilAlt />
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-danger px-2"
                                                    onClick={() => handleDelete(project.id)}
                                                    title="ลบ"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center text-gray-500 py-4">
                                        -- ไม่พบข้อมูลโครงการ --
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pager && (
                    <Pagination
                        pager={pager}
                        onPageClick={(url: string) => setEndpoint(url)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectList;
