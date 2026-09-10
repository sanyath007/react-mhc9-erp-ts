import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { destroy, getEmployees } from '../../features/slices/employee/employeeSlice'
import { useGetInitialFormDataQuery } from '../../features/services/employee/employeeApi'
import { generateQueryString } from '../../utils'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'
import FilteringInputs from '../../components/Employee/FilteringInputs'

const initialFilters = {
    name: '',
    department: '',
    status: 1
};

const initialFormData = {
    divisions: []
};

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { employees, pager, isLoading } = useSelector(state => state.employee);
    const { data: formData = initialFormData } = useGetInitialFormDataQuery();
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getEmployees({ url: `/api/employees/search?page=${params}` }));
        } else {
            dispatch(getEmployees({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handleFilter = (queryStr) => {
        setParams(queryStr);
        setApiEndpoint(`/api/employees/search?page=`);
    };

    const handleDelete = (id) => {
        if (window.confirm(`คุณต้องการลบรายการบุคลากรรหัส ${id} ใช่หรือไม่?`)) {
            dispatch(destroy(id));
        }
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>บุคลากร</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">บุคลากร</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มบุคลากรใหม่</Link>
                </div>

                <div>
                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={handleFilter}
                        formData={formData}
                    />

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[8%]">เลขที่</th>
                                <th className="text-center">ชื่อ-สกุล</th>
                                <th className="text-center w-[40%]">การติดต่อ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {(!isLoading && employees) && employees.map((employee, index) => (
                                <tr key={employee.id} className="font-thin">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td className="text-center">{employee.employee_no}</td>
                                    <td>
                                        <div className="flex flex-row gap-2">
                                            <div className="border rounded-md overflow-hidden w-[100px] max-h-[120px] object-cover object-center">
                                                {employee.avatar_url
                                                    ? <img src={`${process.env.REACT_APP_API_URL}/uploads/${employee?.avatar_url}`} alt="employee-pic" />
                                                    : <img src="/img/avatar-heroes.png" alt="employee-pic" className="avatar-img" />}
                                            </div>
                                            <div>
                                                <p className="font-bold">{employee.prefix.name}{employee.firstname} {employee.lastname}</p>
                                                <p>{employee.position.name}{employee.level?.name}</p>
                                                {employee.member_of.length > 0 && (
                                                    <p className="text-sm">
                                                        {employee.member_of[0]?.department?.name}
                                                        <span className="ml-1">({employee.member_of[0]?.duty?.name})</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p>{`${employee.address_no ? employee.address_no : '-'} หมู่ ${employee.moo ? employee.moo : '-'} ถนน ${employee.road ? employee.road : '-'}`}</p>
                                        <p>{`ต.${employee.tambon ? employee.tambon?.name : '-'} อ.${employee.amphur?.name} จ.${employee.changwat?.name} ${employee.zipcode ? employee.zipcode : '-'}`}</p>
                                        <p>{`โทร ${employee.tel ? employee.tel : '-'}`}</p>
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/employee/${employee.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/employee/${employee.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(employee.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && employees.length <= 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        -- ไม่มีข้อมูล --
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pager={pager}
                    onPageClick={(url) => setApiEndpoint(url)}
                />
            </div>
        </div>
    )
}

export default EmployeeList
