import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaEnvelope, FaEnvelopeOpenText, FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { activate, destroy, getUsers, resetSuccess } from '../../features/slices/user/userSlice'
import { useGetInitialFormDataQuery } from '../../features/services/user/userApi'
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

const UserList = () => {
    const dispatch = useDispatch<any>();
    const { users, pager, isLoading, isDeleted, isSuccess } = useSelector((state: any) => state.user);
    const { data: formData = initialFormData } = useGetInitialFormDataQuery();
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getUsers({ url: `/api/users/search?page=${params}` }));
        } else {
            dispatch(getUsers({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('เปิดใช้งานผู้ใช้งานสำเร็จ ระบบได้ส่งอีเมลไปยังผู้ใช่งานแล้ว!!');
            dispatch(resetSuccess());
            setApiEndpoint(prev => prev === '' ? `/api/users/search?page=` : '');
        }
    }, [isSuccess]);

    const handleFilter = (queryStr) => {
        setParams(queryStr);
        setApiEndpoint(`/api/users/search?page=`);
    };

    const handleDelete = (id) => {
        if (window.confirm(`คุณต้องการลบผู้ใช้งาน รหัส ${id} ใช่หรือไม่?`)) {
            dispatch(destroy(id));
        }
    };

    const handleActivate = (id) => {
        if (window.confirm(`คุณต้องการเปิดใช้งานผู้ใช้งาน รหัส ${id} ใช่หรือไม่?`)) {
            dispatch(activate({ id, data: {} }));
        }
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>ผู้ใช้งาน (Users)</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">ผู้ใช้งาน (Users)</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มผู้ใช้งาน</Link>
                </div>

                <div>
                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={handleFilter}
                        formData={formData}
                    />

                    <table className="table table-bordered table-striped table-hover text-sm">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center">ชื่อ-สกุล</th>
                                <th className="text-center w-[25%]">อีเมล</th>
                                <th className="text-center w-[15%]">ประเภท</th>
                                <th className="text-center w-[8%]">สถานะ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {(!isLoading && users) && users.map((user, index) => (
                                <tr key={user.id} className="font-thin">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td>
                                        <div className="flex flex-row items-center gap-2">
                                            <div className={`border rounded-full w-[45px] h-[45px] overflow-hidden object-cover object-center`}>
                                                {user.employee?.avatar_url
                                                    ? <img src={`${process.env.REACT_APP_API_URL}/uploads/${user.employee?.avatar_url}`} alt="employee-pic" />
                                                    : <img src="/img/avatar-heroes.png" alt="employee-pic" className="avatar-img" />}
                                            </div>
                                            <div>
                                                <p className="font-bold">{user.employee?.prefix.name}{user.employee?.firstname} {user.employee?.lastname}</p>
                                                <p className="text-xs">{user.employee?.position.name}{user.employee?.level?.name}</p>
                                                {user.employee?.member_of.length > 0 && (
                                                    <p className="text-xs">
                                                        {user.employee?.member_of[0]?.department?.name}
                                                        <span className="ml-1">({user.employee?.member_of[0]?.duty?.name})</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">{user.email}</td>
                                    <td className="text-center">{user.permissions[0].role?.name}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center">
                                            {user.is_activated === 1
                                                ? <FaEnvelopeOpenText size={'20px'} className="hover:text-gray-500" />
                                                : <FaEnvelope size={'20px'} className="cursor-pointer hover:text-gray-500" onClick={() => handleActivate(user.id)} />}
                                        </div>
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/user/${user.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/user/${user.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(user.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && users.length <= 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center">
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

export default UserList
