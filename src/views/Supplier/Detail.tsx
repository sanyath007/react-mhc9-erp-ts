import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb, Row, Col } from 'react-bootstrap'
import { FaUserAlt, FaMap, FaUniversity, FaInfoCircle, FaPencilAlt } from 'react-icons/fa'
import { MapPin, Phone, Mail, Landmark, Building2, User, CreditCard, ArrowLeft, CheckCircle2, XCircle, Printer } from 'lucide-react'
import { getSupplier } from '../../features/slices/supplier/supplierSlice'
import Loading from '../../components/ui/Loading'

const SupplierDetail = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<any>();
    const { supplier, isLoading } = useSelector((state: any) => state.supplier);

    useEffect(() => {
        if (id) {
            dispatch(getSupplier(id));
        }
    }, [dispatch, id]);

    const getTaxTypeName = (typeId: any) => {
        if (String(typeId) === '1') return 'ภาษีเงินได้บุคคลธรรมดา';
        if (String(typeId) === '2') return 'ภาษีเงินได้นิติบุคคล';
        return '-';
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้นฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/supplier' }}>ผู้จัดจำหน่าย</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดผู้จัดจำหน่าย</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-800 m-0">รายละเอียดผู้จัดจำหน่าย #{id}</h2>
                        {supplier && (
                            supplier.status === 1 || supplier.status === '1' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> ใช้งานปกติ
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                    <XCircle className="w-3.5 h-3.5" /> ระงับการใช้งาน
                                </span>
                            )
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to={`/supplier/${id}/edit`} className="btn btn-sm btn-warning flex items-center gap-1 shadow-sm">
                            <FaPencilAlt className="text-xs" />
                            <span>แก้ไขข้อมูล</span>
                        </Link>
                        <Link to="/supplier" className="btn btn-sm btn-outline-secondary flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            <span>ย้อนกลับ</span>
                        </Link>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-16 bg-white rounded-lg border shadow-sm">
                        <Loading />
                    </div>
                )}

                {!isLoading && supplier && (
                    <div className="space-y-4">
                        {/* Section 1: ข้อมูลทั่วไป */}
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaUserAlt />
                                </div>
                                ข้อมูลทั่วไป
                            </h4>
                            <Row className="gy-3 text-sm">
                                <Col md={6}>
                                    <span className="text-gray-500 block mb-1">ชื่อผู้จัดจำหน่าย</span>
                                    <p className="font-semibold text-gray-900 text-base">{supplier.name || '-'}</p>
                                </Col>
                                <Col md={3}>
                                    <span className="text-gray-500 block mb-1">เลขที่ประจำตัวผู้เสียภาษี</span>
                                    <p className="font-medium text-gray-900">{supplier.tax_no || '-'}</p>
                                </Col>
                                <Col md={3}>
                                    <span className="text-gray-500 block mb-1">ประเภทภาษี</span>
                                    <p className="font-medium text-gray-900">{getTaxTypeName(supplier.tax_type_id)}</p>
                                </Col>
                                <Col md={6}>
                                    <span className="text-gray-500 block mb-1">ชื่อเจ้าของกิจการ</span>
                                    <p className="font-medium text-gray-900">{supplier.owner_name || '-'}</p>
                                </Col>
                                <Col md={6}>
                                    <span className="text-gray-500 block mb-1">ชื่อผู้จัดการ</span>
                                    <p className="font-medium text-gray-900">{supplier.manager_name || '-'}</p>
                                </Col>
                            </Row>
                        </div>

                        {/* Section 2: ข้อมูลการติดต่อและที่อยู่ */}
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaMap />
                                </div>
                                ข้อมูลการติดต่อและที่อยู่
                            </h4>
                            <Row className="gy-3 text-sm mb-3">
                                <Col md={12}>
                                    <span className="text-gray-500 block mb-1">ที่อยู่ตั้งกิจการ</span>
                                    <p className="font-medium text-gray-900 flex items-start gap-1 leading-relaxed">
                                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <span>
                                            {supplier.address ? `${supplier.address} ` : ''}
                                            {supplier.moo ? `หมู่ ${supplier.moo} ` : ''}
                                            {supplier.road ? `ถนน${supplier.road} ` : ''}
                                            {supplier.tambon?.name ? `ตำบล${supplier.tambon?.name} ` : ''}
                                            {supplier.amphur?.name ? `อำเภอ${supplier.amphur?.name} ` : ''}
                                            {supplier.changwat?.name ? `จังหวัด${supplier.changwat?.name} ` : ''}
                                            {supplier.zipcode || ''}
                                        </span>
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <span className="text-gray-500 block mb-1">เบอร์โทรศัพท์</span>
                                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-emerald-600" />
                                        {supplier.tel || '-'}
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <span className="text-gray-500 block mb-1">โทรสาร (Fax)</span>
                                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                                        <Printer className="w-4 h-4 text-emerald-600" />
                                        {supplier.fax || '-'}
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <span className="text-gray-500 block mb-1">อีเมล</span>
                                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-emerald-600" />
                                        {supplier.email || '-'}
                                    </p>
                                </Col>
                            </Row>

                            {/* ตัวแทนขาย/ผู้ประสานงาน (ถ้ามีข้อมูล) */}
                            {(supplier.seller_name || supplier.seller_tel || supplier.seller_email) && (
                                <div className="mt-3 pt-3 border-t bg-slate-50/70 p-3 rounded-md">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                                        ข้อมูลผู้ประสานงาน / ตัวแทนฝ่ายขาย
                                    </span>
                                    <Row className="gy-2 text-sm">
                                        <Col md={4}>
                                            <span className="text-gray-500 block text-xs">ชื่อผู้ประสานงาน</span>
                                            <span className="font-medium text-gray-800">{supplier.seller_name || '-'}</span>
                                        </Col>
                                        <Col md={4}>
                                            <span className="text-gray-500 block text-xs">เบอร์โทร</span>
                                            <span className="font-medium text-gray-800">{supplier.seller_tel || '-'}</span>
                                        </Col>
                                        <Col md={4}>
                                            <span className="text-gray-500 block text-xs">อีเมล</span>
                                            <span className="font-medium text-gray-800">{supplier.seller_email || '-'}</span>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>

                        {/* Section 3: ข้อมูลบัญชีธนาคาร */}
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaUniversity />
                                </div>
                                ข้อมูลบัญชีธนาคาร
                            </h4>
                            <Row className="gy-3 text-sm">
                                <Col md={3}>
                                    <span className="text-gray-500 block mb-1">ธนาคาร</span>
                                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                                        <Landmark className="w-4 h-4 text-purple-600" />
                                        {supplier.bank?.name || '-'}
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <span className="text-gray-500 block mb-1">สาขา</span>
                                    <p className="font-medium text-gray-900">{supplier.bank_acc_branch || '-'}</p>
                                </Col>
                                <Col md={3}>
                                    <span className="text-gray-500 block mb-1">เลขที่บัญชี</span>
                                    <p className="font-semibold text-purple-700 tracking-wider font-mono">{supplier.bank_acc_no || '-'}</p>
                                </Col>
                                <Col md={3}>
                                    <span className="text-gray-500 block mb-1">ชื่อบัญชี</span>
                                    <p className="font-medium text-gray-900">{supplier.bank_acc_name || '-'}</p>
                                </Col>
                            </Row>
                        </div>

                        {/* Section 4: หมายเหตุ */}
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaInfoCircle />
                                </div>
                                หมายเหตุ
                            </h4>
                            <div className="text-sm font-normal text-gray-700 bg-gray-50 p-3 rounded border min-h-[60px]">
                                {supplier.remark || '-'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierDetail;
