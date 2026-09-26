import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { getSuppliers } from '../../../features/slices/supplier/supplierSlice';
import { generateQueryString } from '../../../utils';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination'
import FilteringInputs from './FilteringInputs';
import { CheckCircle2, Mail, MapPin, Phone, XCircle } from 'lucide-react';

const initialFilters = {
    name: '',
    status: '1',
};

const ModalSupplierList = ({ isShow, onHide, onSelect }: any) => {
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

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header className="border py-1 px-2">
                <Modal.Title>รายการผู้จัดจำหน่าย</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => setParams(queryStr)}
                />

                {isLoading && (
                    <div className="text-center py-2">
                        <Loading />
                    </div>
                )}

                {!isLoading && suppliers && (
                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="w-[25%]">ชื่อผู้จัดจำหน่าย</th>
                                <th>ที่อยู่</th>
                                <th className="text-center w-[10%]">สถานะ</th>
                                <th className="text-center w-[10%]">เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers && suppliers.map((supplier, index) => (
                                <tr key={supplier.id} className="font-thin">
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td>{supplier.name}</td>
                                    <td className="text-xs">
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
                                    </td>
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
                                        <button
                                            className="btn btn-primary btn-sm text-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(supplier);
                                            }}
                                        >
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <Pagination
                    pager={pager}
                    onPageClick={(url) => setApiEndpoint(`${url}&status=0`)}
                />
            </Modal.Body>
        </Modal>
    )
}

export default ModalSupplierList
