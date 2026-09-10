import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb, Row } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { generateQueryString } from '../../../utils'
import { getSuppliers } from '../../../features/slices/supplier/supplierSlice'
import Pagination from '../../../components/ui/Pagination'
import Loading from '../../../components/ui/Loading'
import FilteringInputs from '../../../components/Modals/Supplier/FilteringInputs'

const initialFilters = {
    name: '',
    status: '0',
};

const SupplierList = () => {
    const dispatch = useDispatch();
    const { suppliers, pager, isLoading } = useSelector(state => state.supplier);
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
                <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
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
                                <th className="w-[20%]">เจ้าของ</th>
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
                                    <td className="text-xs">
                                        {supplier.address ? supplier.address + ' ' : ''}หมู่.{supplier.moo ? supplier.moo : '-'} ถ.{supplier.raod ? supplier.raod : '-'}
                                        {supplier.tambon?.name} {supplier.amphur?.name} {supplier.changwat?.name} {supplier.zipcode ? supplier.zipcode : '-'}
                                        <span className="ml-1">โทร.{supplier.tel ? supplier.tel : '-'} Fax.{supplier.fax ? supplier.fax : '-'}</span>
                                    </td>
                                    <td>{supplier.owner_name}</td>
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