import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { CheckCircle2, Mail, MapPin, Phone, XCircle } from 'lucide-react'
import { generateQueryString } from '../../utils'
import { getSuppliers } from '../../features/slices/supplier/supplierSlice'
import Pagination from '../../components/ui/Pagination'
import Loading from '../../components/ui/Loading'
import FilteringInputs from '../../components/Modals/Supplier/FilteringInputs'

const initialFilters = {
    name: '',
    status: '1',
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
                                <th className="text-center w-[10%]">สถานะ</th>
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
                                    <td className="text-primary font-semibold">{supplier.name}</td>
                                    <td>
                                        <div className="flex flex-col gap-1.5 py-0.5">
                                            {/* ที่อยู่ */}
                                            <div className="flex items-start gap-1.5 text-gray-700 text-xs leading-relaxed">
                                                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    {[
                                                        supplier.address,
                                                        supplier.moo ? `ม.${supplier.moo}` : null,
                                                        (supplier.road || supplier.raod) ? `ถ.${supplier.road || supplier.raod}` : null,
                                                        supplier.tambon?.name ? `ต.${supplier.tambon.name}` : null,
                                                        supplier.amphur?.name ? `อ.${supplier.amphur.name}` : null,
                                                        supplier.changwat?.name ? `จ.${supplier.changwat.name}` : null,
                                                        supplier.zipcode
                                                    ].filter(Boolean).join(' ') || '-'}
                                                </span>
                                            </div>

                                            {/* ช่องทางติดต่อ */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {supplier.tel ? (
                                                    <a
                                                        href={`tel:${supplier.tel}`}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-normal bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-decoration-none transition-colors"
                                                        title="โทรออก"
                                                    >
                                                        <Phone className="w-3 h-3 text-emerald-600" />
                                                        <span>{supplier.tel}</span>
                                                    </a>
                                                ) : null}

                                                {supplier.email ? (
                                                    <a
                                                        href={`mailto:${supplier.email}`}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-normal bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-decoration-none transition-colors"
                                                        title="ส่งอีเมล"
                                                    >
                                                        <Mail className="w-3 h-3 text-blue-600" />
                                                        <span>{supplier.email}</span>
                                                    </a>
                                                ) : null}

                                                {!supplier.tel && !supplier.email && (
                                                    <span className="text-xs text-gray-400 font-thin italic">ไม่มีข้อมูลติดต่อ</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">{supplier.tax_no}</td>
                                    <td className="text-center">
                                        {supplier.status === 1 || supplier.status === '1' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> ใช้งาน
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                                <XCircle className="w-3.5 h-3.5" /> ระงับ
                                            </span>
                                        )}
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