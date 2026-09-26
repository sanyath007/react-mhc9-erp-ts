import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaInfoCircle, FaUniversity, FaUserAlt, FaMap } from 'react-icons/fa'
import { MapPin, Landmark, Building2, User } from 'lucide-react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Col, Row } from 'react-bootstrap'
import { store, update } from '../../features/slices/supplier/supplierSlice'
import { useGetInitialFormDataQuery } from '../../features/services/supplier/supplierApi'
import SearchableSelect from '../../components/ui/Forms/SearchableSelect'
import ButtonGroupSelection, { ButtonGroupOption } from '../../components/ui/Forms/ButtonGroupSelection'
import Loading from '../../components/ui/Loading';
import ErrorMessage from '../../components/ui/Forms/ErrorMessage'
import { amber } from '@material-ui/core/colors'

const supplierSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาระบุชื่อผู้ขาย'),
    tax_no: Yup.string().required('กรุณาระบุเลขที่ผู้เสียภาษี'),
    tax_type_id: Yup.string().required('กรุณาระบุประเภทภาษี'),
    address: Yup.string().required('กรุณาระบุที่อยู่'),
    amphur_id: Yup.string().required('กรุณาระบุอำเภอ'),
    changwat_id: Yup.string().required('กรุณาระบุจังหวัด'),
    tel: Yup.string().required('กรุณาระบุเบอร์โทรศัพท์')
});

const initialFormData = {
    changwats: [],
    amphurs: [],
    tambons: [],
    banks: []
};

const taxTypeOptions: ButtonGroupOption[] = [
    { value: '1', label: 'บุคคลธรรมดา', icon: <User className="w-3.5 h-3.5" />, color: 'rose' },
    { value: '2', label: 'นิติบุคคล', icon: <Building2 className="w-3.5 h-3.5" />, color: 'blue' },
];

interface SupplierFormProps {
    supplier?: any;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier }) => {
    const dispatch = useDispatch<any>();
    const [filteredAmphurs, setFilteredAmphurs] = useState<any[]>([]);
    const [filteredTambons, setFilteredTambons] = useState<any[]>([]);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (supplier && formData.amphurs?.length > 0) {
            if (supplier.changwat_id) {
                setFilteredAmphurs(formData.amphurs.filter((amp: any) => String(amp.chw_id) === String(supplier.changwat_id)));
            }
            if (supplier.amphur_id) {
                setFilteredTambons(formData.tambons.filter((tam: any) => String(tam.amp_id) === String(supplier.amphur_id)));
            }
        }
    }, [supplier, formData]);

    const handleSubmit = (values: any, formik: any) => {
        if (supplier) {
            dispatch(update({ id: supplier.id, data: values }));
        } else {
            dispatch(store(values));
            formik.resetForm();
        }
    };

    const handleChangwatSelect = (id: any) => {
        setFilteredAmphurs(formData.amphurs.filter((amp: any) => String(amp.chw_id) === String(id)));
    };

    const handleAmphurSelect = (id: any) => {
        setFilteredTambons(formData.tambons.filter((tam: any) => String(tam.amp_id) === String(id)));
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                tax_no: supplier ? supplier.tax_no || '' : '',
                name: supplier ? supplier.name || '' : '',
                address: supplier ? supplier.address || '' : '',
                moo: supplier ? supplier.moo || '' : '',
                road: supplier ? supplier.road || '' : '',
                tambon_id: supplier ? (supplier.tambon_id ? String(supplier.tambon_id) : '') : '',
                amphur_id: supplier ? (supplier.amphur_id ? String(supplier.amphur_id) : '') : '',
                changwat_id: supplier ? (supplier.changwat_id ? String(supplier.changwat_id) : '') : '',
                zipcode: supplier ? supplier.zipcode || '' : '',
                tel: supplier ? supplier.tel || '' : '',
                fax: supplier ? supplier.fax || '' : '',
                email: supplier ? supplier.email || '' : '',
                seller_name: supplier ? supplier.seller_name || '' : '',
                seller_tel: supplier ? supplier.seller_tel || '' : '',
                seller_email: supplier ? supplier.seller_email || '' : '',
                manager_name: supplier ? supplier.manager_name || '' : '',
                owner_name: supplier ? supplier.owner_name || '' : '',
                bank_id: supplier ? (supplier.bank_id ? String(supplier.bank_id) : '') : '',
                bank_acc_no: supplier ? supplier.bank_acc_no || '' : '',
                bank_acc_name: supplier ? supplier.bank_acc_name || '' : '',
                bank_acc_branch: supplier ? supplier.bank_acc_branch || '' : '',
                tax_type_id: supplier ? (supplier.tax_type_id ? String(supplier.tax_type_id) : '') : '',
                remark: supplier ? supplier.remark || '' : '',
            }}
            validationSchema={supplierSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <div className="mb-4">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaUserAlt />
                                </div>
                                ข้อมูลทั่วไป
                            </h4>
                            <Row className="mb-2">
                                <Col md={9}>
                                    <label>ชื่อผู้จัดจำหน่าย</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className={`form-control text-sm ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
                                    />
                                    {formik.errors.name && formik.touched.name && (
                                        <ErrorMessage className='mt-1' message={formik.errors.name as string} />
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label>เลขที่ผู้เสียภาษี</label>
                                    <input
                                        type="text"
                                        name="tax_no"
                                        value={formik.values.tax_no}
                                        onChange={formik.handleChange}
                                        className={`form-control text-sm ${formik.errors.tax_no && formik.touched.tax_no ? 'is-invalid' : ''}`}
                                    />
                                    {formik.errors.tax_no && formik.touched.tax_no && (
                                        <ErrorMessage className='mt-1' message={formik.errors.tax_no as string} />
                                    )}
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={4}>
                                    <label>ประเภทภาษี</label>
                                    <ButtonGroupSelection
                                        options={taxTypeOptions}
                                        value={formik.values.tax_type_id}
                                        onChange={(val) => formik.setFieldValue('tax_type_id', String(val))}
                                        error={!!(formik.errors.tax_type_id && formik.touched.tax_type_id)}
                                        errorMessage={formik.errors.tax_type_id as string}
                                    />
                                </Col>
                                <Col md={4}>
                                    <label>ชื่อเจ้าของ</label>
                                    <input
                                        type="text"
                                        name="owner_name"
                                        value={formik.values.owner_name}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                                <Col md={4}>
                                    <label>ชื่อผู้จัดการ</label>
                                    <input
                                        type="text"
                                        name="manager_name"
                                        value={formik.values.manager_name}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                            </Row>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaMap />
                                </div>
                                ข้อมูลการติดต่อและที่อยู่
                            </h4>
                            <Row className="mb-2">
                                <Col md={3}>
                                    <label>โทรศัพท์</label>
                                    <input
                                        type="text"
                                        name="tel"
                                        value={formik.values.tel}
                                        onChange={formik.handleChange}
                                        className={`form-control text-sm ${formik.errors.tel && formik.touched.tel ? 'is-invalid' : ''}`}
                                    />
                                    {formik.errors.tel && formik.touched.tel && (
                                        <ErrorMessage className='mt-1' message={formik.errors.tel as string} />
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label>โทรสาร</label>
                                    <input
                                        type="text"
                                        name="fax"
                                        value={formik.values.fax}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                                <Col md={6}>
                                    <label>อีเมล</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={6}>
                                    <label>ที่อยู่เลขที่</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        className={`form-control text-sm ${formik.errors.address && formik.touched.address ? 'is-invalid' : ''}`}
                                    />
                                    {formik.errors.address && formik.touched.address && (
                                        <ErrorMessage className='mt-1' message={formik.errors.address as string} />
                                    )}
                                </Col>
                                <Col md={2}>
                                    <label>หมู่</label>
                                    <input
                                        type="number"
                                        name="moo"
                                        value={formik.values.moo}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                                <Col md={4}>
                                    <label>ถนน</label>
                                    <input
                                        type="text"
                                        name="road"
                                        value={formik.values.road}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={3}>
                                    <label>จังหวัด</label>
                                    {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                        <SearchableSelect
                                            size="sm"
                                            prefixIcon={<MapPin />}
                                            options={formData.changwats?.map((c: any) => ({ value: String(c.id), label: c.name })) || []}
                                            value={String(formik.values.changwat_id)}
                                            onChange={(val) => {
                                                formik.setFieldValue('changwat_id', val);
                                                formik.setFieldValue('amphur_id', '');
                                                formik.setFieldValue('tambon_id', '');
                                                setFilteredTambons([]);
                                                handleChangwatSelect(val);
                                            }}
                                            placeholder="-- เลือก --"
                                            inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                            error={formik.errors.changwat_id && formik.touched.changwat_id && (formik.errors.changwat_id as string)}
                                        />
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label>อำเภอ</label>
                                    {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                        <SearchableSelect
                                            size="sm"
                                            prefixIcon={<MapPin />}
                                            options={filteredAmphurs.map((a: any) => ({ value: String(a.id), label: a.name })) || []}
                                            value={String(formik.values.amphur_id)}
                                            onChange={(val) => {
                                                formik.setFieldValue('amphur_id', val);
                                                formik.setFieldValue('tambon_id', '');
                                                handleAmphurSelect(val);
                                            }}
                                            placeholder="-- เลือก --"
                                            inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                            error={formik.errors.amphur_id && formik.touched.amphur_id && (formik.errors.amphur_id as string)}
                                        />
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label>ตำบล</label>
                                    {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                        <SearchableSelect
                                            size="sm"
                                            prefixIcon={<MapPin />}
                                            options={filteredTambons.map((t: any) => ({ value: String(t.id), label: t.name })) || []}
                                            value={String(formik.values.tambon_id)}
                                            onChange={(val) => {
                                                formik.setFieldValue('tambon_id', val);
                                            }}
                                            placeholder="-- เลือก --"
                                            inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                        />
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label>รหัสไปรษณีย์</label>
                                    <input
                                        type="text"
                                        name="zipcode"
                                        value={formik.values.zipcode}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                            </Row>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaUniversity />
                                </div>
                                ข้อมูลบัญชีธนาคาร
                            </h4>
                            <Row className="mb-2">
                                <Col md={3}>
                                    <label>ธนาคาร</label>
                                    {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                        <SearchableSelect
                                            size="sm"
                                            prefixIcon={<Landmark />}
                                            options={formData.banks?.map((bank: any) => ({ value: String(bank.id), label: bank.name })) || []}
                                            value={String(formik.values.bank_id)}
                                            onChange={(val) => {
                                                formik.setFieldValue('bank_id', val);
                                            }}
                                            placeholder="-- เลือก --"
                                            inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                        />
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label>สาขา (ธนาคาร)</label>
                                    <input
                                        type="text"
                                        name="bank_acc_branch"
                                        value={formik.values.bank_acc_branch}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                                <Col md={3}>
                                    <label>เลขที่บัญชีธนาคาร</label>
                                    <input
                                        type="text"
                                        name="bank_acc_no"
                                        value={formik.values.bank_acc_no}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                                <Col md={3}>
                                    <label>ชื่อบัญชีธนาคาร</label>
                                    <input
                                        type="text"
                                        name="bank_acc_name"
                                        value={formik.values.bank_acc_name}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    />
                                </Col>
                            </Row>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-base font-bold mb-3 pb-2 border-b flex items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mr-2 shadow-sm">
                                    <FaInfoCircle />
                                </div>
                                หมายเหตุ
                            </h4>
                            <Row className="mb-2">
                                <Col>
                                    <textarea
                                        rows={3}
                                        name="remark"
                                        value={formik.values.remark}
                                        onChange={formik.handleChange}
                                        className="form-control font-thin text-sm"
                                    ></textarea>
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col>
                                <button type="submit" className="btn btn-primary text-sm float-right px-4">
                                    {supplier ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default SupplierForm