import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb, Row } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { Home, Mail, MapPin, Phone } from 'lucide-react'
import { generateQueryString } from '../../utils'
import { getSuppliers } from '../../features/slices/supplier/supplierSlice'
import Pagination from '../../components/ui/Pagination'
import Loading from '../../components/ui/Loading'
import FilteringInputs from '../../components/Modals/Supplier/FilteringInputs'

const initialFilters = {
    name: '',
    status: '0',
};

const SupplierList = () => {
    const dispatch = useDispatch<any>();
    const { suppliers, pager, isLoading } = useSelector((state: any) => state.supplier);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getSuppliers({ url: `/api/suppliers/search?page=${params}` }));
        } else {
            dispatch(getSuppliers({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handleDelete = (id) => {

    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>ผู้จัดจำหน่าย</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">ผู้จัดจำหน่าย</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มผู้จัดจำหน่าย</Link>
                </div>

                <div className="border pt-2 px-2 mb-2 rounded-md">
                    <FilteringInputs
                        initialFilters={initialFilters}
                        onFilter={(queryStr) => setParams(queryStr)}
                    />
                </div>

                <div>
                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="w-[25%]">ชื่อผู้จัดจำหน่าย</th>
                                <th>ที่อยู่</th>
                                <th className="text-center w-[15%]">เลขที่ผู้เสียภาษี</th>
                                <th className="text-center w-[6%]">สถานะ</th>
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

                            {!isLoading && suppliers && suppliers.map((supplier, index) => (
                                <tr className="font-thin" key={supplier.id}>
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td>{supplier.name}</td>
                                    <td>
                                        <p className='flex w-full leading-normal'>
                                            <Home className="w-4 h-4 mr-1" />
                                            {supplier.address ? supplier.address + ' ' : ''}หมู่.{supplier.moo ? supplier.moo : '-'} ถ.{supplier.raod ? supplier.raod : '-'}
                                        </p>
                                        <p className='flex w-full leading-normal'>
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {supplier.tambon?.name} {supplier.amphur?.name} {supplier.changwat?.name} {supplier.zipcode ? supplier.zipcode : '-'}
                                        </p>
                                        <p className='flex w-full leading-normal'>
                                            <Phone className="w-4 h-4 mr-1" />{supplier.tel ? supplier.tel : '-'}
                                            <Mail className="w-4 h-4 mr-1 ml-4" />{supplier.email ? supplier.email : '-'}
                                        </p>
                                    </td>
                                    <td className="text-center">{supplier.tax_no}</td>
                                    <td className="text-center">
                                        {supplier.status === 0 && <i className="fas fa-toggle-off text-danger text-lg"></i>}
                                        {supplier.status === 1 && <i className="fas fa-toggle-on text-primary text-lg"></i>}
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/supplier/${supplier.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/supplier/${supplier.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(supplier.id)}>
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
                    onPageClick={(url) => setApiEndpoint(url)}
                />
            </div>
        </div>
    )
}

export default SupplierList