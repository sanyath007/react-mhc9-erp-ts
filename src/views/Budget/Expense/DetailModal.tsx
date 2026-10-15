import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Row, Col } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { getSuppliers } from '../../../features/slices/supplier/supplierSlice'
import SearchableSelect from '../../../components/ui/Forms/SearchableSelect'
import EmployeeSelection from '../../../components/FormControls/EmployeeSelection'
import DatePicker from '../../../components/ui/Forms/DatePicker'
import YearPicker from '../../../components/ui/Forms/YearPicker'
import { MONTH_TH_NAMES } from '../../../constants/date-time'
import { Calendar1, Wallet, Receipt, Users, Paperclip, Store } from 'lucide-react'
import { toast } from 'react-toastify'
import { storeDetail, updateDetail } from '../../../features/slices/budget-expense/budgetExpenseSlice'
import ErrorMessage from '../../../components/ui/Forms/ErrorMessage'

const mockSources = [
    { value: '1', label: '11220 - ค่าตอบแทนใช้สอย' },
    { value: '2', label: '11230 - ค่าวัสดุ' },
    { value: '3', label: '11240 - ค่าสาธารณูปโภค' },
    { value: '4', label: '11150 - ค่าตอบแทนพนักงานราชการ' },
    { value: '5', label: '11150 - เงินค่าครองชีพ' },
    { value: '6', label: '11220 - เงินสมทบกองทุนประกันสังคม' },
    { value: '7', label: '11210 -ค่าล่วงเวลา' },
    { value: '8', label: '10210 - เงินช่วยการศึกษาบุตร' },
    { value: '9', label: '10210 - ค่ารักษาพยาบาล' },
    { value: '10', label: '26000 - เงินนอกงบประมาณ' },
];

const mockMonths = MONTH_TH_NAMES.map((name, index) => ({ value: String(index + 1), label: name }));

type DetailModalProps = {
    isShow: boolean;
    onHide: () => void;
    onSave: (detail: any) => void;
    initialYear: number;
    expenseId?: string | number;
    detail?: any;
}

const DetailModal = ({ isShow, onHide, onSave, initialYear, expenseId, detail }: DetailModalProps) => {
    const dispatch = useDispatch<any>();
    const { suppliers, isLoading } = useSelector((state: any) => state.supplier);
    const { loggedInUser } = useSelector((state: any) => state.auth);
    const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
    const [selectSupplier, setSelectSupplier] = useState<any>(null)

    useEffect(() => {
        if (detail) {
            setSelectSupplier(detail.supplier);
            setSupplierSearchQuery(detail.supplier.name);
        }
    }, [detail, isShow]);

    useEffect(() => {
        if (isShow) {
            const timer = setTimeout(() => {
                dispatch(getSuppliers({ url: `/api/suppliers/search?status=1&name=${supplierSearchQuery}` }));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isShow, dispatch, supplierSearchQuery]);

    const supplierOptions = suppliers ? suppliers.map((s: any) => ({
        value: s.id,
        label: s.name
    })) : [];

    const initialValues = {
        month: detail?.month || moment().month() + 1,
        year: detail?.year || initialYear || moment().year(),
        target: detail?.target || 0,
        target_details: detail?.target_details || { times: 0, persons: 0, days: 0 },
        amount: detail?.amount || 0,
        base_amount: detail?.base_amount || 0,
        vat_rate: detail?.vat_rate || 7,
        vat_amount: detail?.vat_amount || 0,
        tax_amount: detail?.tax_amount || 0,
        tax_rate: detail?.tax_rate || 0,
        net_total: detail?.net_total || 0,
        paid_to: detail?.paid_to || '',
        paid_at: detail?.paid_at || '',
        paid_by: detail?.paid_by || '',
        source_id: detail?.source_id || '',
        withdrawal_no: detail?.withdrawal_no || '',
        withdrawal_at: detail?.withdrawal_at || '',
        payment_no: detail?.payment_no || '',
        payment_at: detail?.payment_at || '',
        voucher_no: detail?.voucher_no || '',
        ref_no: detail?.ref_no || '',
        doc_no: detail?.doc_no || '',
        doc_date: detail?.doc_date || '',
        remark: detail?.remark || '',
        created_by: detail?.created_by || loggedInUser?.id || '',
    };

    const validationSchema = Yup.object().shape({
        month: Yup.number().required('กรุณาระบุเดือน'),
        year: Yup.number().required('กรุณาระบุปี'),
        amount: Yup.number().required('กรุณาระบุจำนวนเงิน').positive('จำนวนเงินต้องมากกว่า 0'),
        net_total: Yup.number().required('กรุณาระบุจำนวนเงินสุทธิ').positive('จำนวนเงินสุทธิมากกว่า 0'),
        tax_amount: Yup.number().min(0, 'ภาษีต้องไม่ติดลบ'),
        tax_rate: Yup.number().min(0, 'ภาษีต้องไม่ติดลบ'),
        paid_to: Yup.string().required('กรุณาระบุผู้รับเงิน'),
        paid_at: Yup.string().required('กรุณาระบุวันที่'),
        paid_by: Yup.string().required('กรุณาระบุผู้ออกเงิน'),
        source_id: Yup.string().required('กรุณาระบุแหล่งเงิน'),
        doc_no: Yup.string().required('กรุณาระบุเลขที่หนังสือขอเบิก'),
        doc_date: Yup.string().required('กรุณาระบุวันที่หนังสือขอเบิก'),
    });

    const handleCalculateVatAmount = (amount: number, vat_rate: number) => {
        return parseFloat(((amount * vat_rate) / (100 + vat_rate)).toFixed(2));
    }

    const handleCalculateBaseAmount = (amount: number, vat_rate: number) => {
        return parseFloat((amount - handleCalculateVatAmount(amount, vat_rate)).toFixed(2));
    }

    const handleCalculateTaxAmount = (amount: number, tax_rate: number) => {

        return parseFloat((amount * (tax_rate / 100)).toFixed(2));
    }

    const handleCalculateTotal = (amount: number, tax: number) => {
        return parseFloat((amount - tax).toFixed(2));
    }

    return (
        <Modal show={isShow} onHide={onHide} size="xl" backdrop="static">
            <Modal.Header closeButton className="py-2">
                <Modal.Title className="text-lg font-bold">{detail ? 'แก้ไขรายละเอียดค่าใช้จ่ายรายเดือน' : 'เพิ่มรายละเอียดค่าใช้จ่ายรายเดือน'}</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    if (!expenseId) {
                        toast.error('ไม่พบรหัสค่าใช้จ่ายหลัก กรุณาบันทึกข้อมูลหลักก่อน');
                        setSubmitting(false);
                        return;
                    }
                    try {
                        let res;
                        if (detail?.id) {
                            res = await dispatch(updateDetail({ id: expenseId, detailId: detail.id, data: values })).unwrap();
                        } else {
                            res = await dispatch(storeDetail({ id: expenseId, data: values })).unwrap();
                        }

                        if (res.status === 1) {
                            onSave({ supplier: selectSupplier, ...values });
                            resetForm();
                            onHide();
                        } else {
                            toast.error(res.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                        }
                    } catch (error) {
                        toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {(formik) => {
                    return (
                        <Form>
                            <Modal.Body>
                                <Row className="mb-3">
                                    <Col md={3}>
                                        <label className="text-sm font-semibold">เดือน <span className="text-red-500">*</span></label>
                                        <SearchableSelect
                                            options={mockMonths}
                                            value={String(formik.values.month)}
                                            onChange={(value) => formik.setFieldValue('month', value ? Number(value) : '')}
                                            error={formik.errors.month && formik.touched.month ? formik.errors.month as string : undefined}
                                            inputCss="!h-[34px] !bg-white !rounded-[0.375rem]"
                                            prefixIcon={<Calendar1 className="w-4 h-4" />}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <label className="text-sm font-semibold">พ.ศ. <span className="text-red-500">*</span></label>
                                        <YearPicker
                                            value={String(formik.values.year)}
                                            onChange={(year: string) => formik.setFieldValue('year', Number(year))}
                                            inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-sm font-semibold">แหล่งเงิน <span className="text-red-500">*</span></label>
                                        <SearchableSelect
                                            options={mockSources}
                                            value={String(formik.values.source_id)}
                                            onChange={(value) => formik.setFieldValue('source_id', value)}
                                            error={formik.errors.source_id && formik.touched.source_id ? formik.errors.source_id as string : undefined}
                                            inputCss="!h-[34px] !bg-white !rounded-[0.375rem]"
                                            prefixIcon={<Wallet className="w-4 h-4" />}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <label className="text-sm font-semibold">เป้าหมาย <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            name="target"
                                            className={`form-control text-sm text-center ${formik.errors.target && formik.touched.target ? 'is-invalid' : ''}`}
                                            onChange={(e) => formik.setFieldValue('target', Number(e.target.value))}
                                            value={formik.values.target}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        {formik.errors.target && formik.touched.target && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.target as string}</div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-sm font-semibold">เป้าหมาย (ครั้ง/คน/วัน)</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="number"
                                                name="target_details.times"
                                                className={`form-control text-sm`}
                                                onChange={formik.handleChange}
                                                value={formik.values.target_details.times}
                                                placeholder="ครั้ง"
                                            />
                                            <input
                                                type="number"
                                                name="target_details.persons"
                                                className={`form-control text-sm`}
                                                onChange={formik.handleChange}
                                                value={formik.values.target_details.persons}
                                                placeholder="คน"
                                            />
                                            <input
                                                type="number"
                                                name="target_details.days"
                                                className={`form-control text-sm`}
                                                onChange={formik.handleChange}
                                                value={formik.values.target_details.days}
                                                placeholder="วัน"
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <div className="border border-gray-200 rounded p-3 mb-3 bg-gray-50">
                                    <h5 className="text-primary text-sm font-bold border-b pb-1 mb-2 flex items-center gap-2">
                                        <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full flex items-center justify-center">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        ข้อมูลผู้รับเงินและการจ่ายเงิน
                                    </h5>
                                    <Row className="mb-2">
                                        <Col md={6}>
                                            <label className="text-xs font-semibold">ผู้รับเงิน (จ่ายให้) <span className="text-red-500">*</span></label>
                                            <SearchableSelect
                                                options={supplierOptions}
                                                value={formik.values.paid_to}
                                                loading={isLoading}
                                                onSearch={(query) => setSupplierSearchQuery(query)}
                                                onChange={(value) => {
                                                    formik.setFieldValue('paid_to', value)

                                                    const _supplier = suppliers.find((s: any) => s.id === value)
                                                    setSelectSupplier(_supplier)
                                                }}
                                                error={formik.errors.paid_to && formik.touched.paid_to ? formik.errors.paid_to as string : undefined}
                                                inputCss="!h-[34px] !bg-white !rounded-[0.375rem]"
                                                prefixIcon={<Store className="w-4 h-4" />}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">วันที่จ่าย <span className="text-red-500">*</span></label>
                                            <DatePicker
                                                value={formik.values.paid_at}
                                                onChange={(date: string) => formik.setFieldValue('paid_at', date)}
                                                inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full ${formik.errors.paid_at && formik.touched.paid_at ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                                error={formik.errors.paid_at && formik.touched.paid_at ? (formik.errors.paid_at as string) : undefined}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">ผู้จ่ายเงิน <span className="text-red-500">*</span></label>
                                            <EmployeeSelection fieldName="paid_by" />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={3}>
                                            <label className="text-sm font-semibold">จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                name="amount"
                                                className={`form-control text-sm text-center ${formik.errors.amount && formik.touched.amount ? 'is-invalid' : ''}`}
                                                onChange={(e) => formik.setFieldValue('amount', Number(e.target.value))}
                                                onBlur={() => {
                                                    formik.setFieldValue('base_amount', handleCalculateBaseAmount(formik.values.amount, 7))
                                                    formik.setFieldValue('vat_amount', handleCalculateVatAmount(formik.values.amount, 7))
                                                }}
                                                value={formik.values.amount}
                                                onFocus={(e) => e.target.select()}
                                            />
                                            {formik.errors.amount && formik.touched.amount && (
                                                <ErrorMessage className="mt-1" message={formik.errors.amount as string} />
                                            )}
                                        </Col>
                                        <Col md={2}>
                                            <label className="text-sm font-semibold">ฐานภาษี (บาท) <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                name="base_amount"
                                                className={`form-control text-sm text-center cursor-not-allowed bg-gray-100`}
                                                onChange={(e) => formik.setFieldValue('base_amount', Number(e.target.value))}
                                                value={formik.values.base_amount}
                                                onFocus={(e) => e.target.select()}
                                                readOnly
                                            />
                                            {formik.errors.base_amount && formik.touched.base_amount && (
                                                <ErrorMessage className="mt-1" message={formik.errors.base_amount as string} />
                                            )}
                                        </Col>
                                        <Col md={2}>
                                            <label className="text-sm font-semibold">อัตราภาษีหัก ณ ที่จ่าย (%)</label>
                                            <input
                                                type="number"
                                                name="tax_rate"
                                                className="form-control text-sm text-center"
                                                onChange={(e) => formik.setFieldValue('tax_rate', Number(e.target.value))}
                                                onBlur={() => {
                                                    let _taxAmount = 0;
                                                    if (selectSupplier?.tax_type_id === 1) {
                                                        _taxAmount = handleCalculateTaxAmount(formik.values.amount, formik.values.tax_rate)
                                                        formik.setFieldValue('tax_amount', _taxAmount)
                                                    } else {
                                                        _taxAmount = handleCalculateTaxAmount(formik.values.base_amount, formik.values.tax_rate)
                                                        formik.setFieldValue('tax_amount', _taxAmount)
                                                    }
                                                    formik.setFieldValue('net_total', handleCalculateTotal(formik.values.amount, _taxAmount))

                                                }}
                                                value={formik.values.tax_rate}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <label className="text-sm font-semibold">ภาษีหัก ณ ที่จ่าย (บาท)</label>
                                            <input
                                                type="number"
                                                name="tax_amount"
                                                className="form-control text-sm text-center cursor-not-allowed bg-gray-100"
                                                onChange={(e) => formik.setFieldValue('tax_amount', Number(e.target.value))}
                                                value={formik.values.tax_amount}
                                                onFocus={(e) => e.target.select()}
                                                readOnly
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-sm font-semibold">จำนวนเงินสุทธิ (บาท)</label>
                                            <input
                                                type="number"
                                                name="net_total"
                                                value={formik.values.net_total}
                                                className={`form-control text-sm text-center bg-gray-100 font-bold text-blue-600 ${formik.errors.net_total && formik.touched.net_total ? 'is-invalid' : ''}`}
                                                readOnly
                                            />
                                            {formik.errors.net_total && formik.touched.net_total && (
                                                <ErrorMessage className="mt-1" message={formik.errors.net_total as string} />
                                            )}
                                        </Col>
                                    </Row>
                                </div>

                                <div className="border border-gray-200 rounded p-3 mb-3 bg-gray-50">
                                    <h5 className="text-primary text-sm font-bold border-b pb-1 mb-2 flex items-center gap-2">
                                        <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full flex items-center justify-center">
                                            <Receipt className="w-4 h-4" />
                                        </div>
                                        ข้อมูลการเบิกจ่าย
                                    </h5>
                                    <Row className="mb-2">
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">เลขที่ขอเบิก</label>
                                            <input
                                                type="text"
                                                name="withdrawal_no"
                                                className="form-control text-sm"
                                                onChange={formik.handleChange}
                                                value={formik.values.withdrawal_no}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">วันที่ขอเบิก</label>
                                            <DatePicker
                                                value={formik.values.withdrawal_at}
                                                onChange={(date: string) => formik.setFieldValue('withdrawal_at', date)}
                                                inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">เลขที่ขอจ่าย</label>
                                            <input
                                                type="text"
                                                name="payment_no"
                                                className="form-control text-sm"
                                                onChange={formik.handleChange}
                                                value={formik.values.payment_no}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">วันที่ขอจ่าย</label>
                                            <DatePicker
                                                value={formik.values.payment_at}
                                                onChange={(date: string) => formik.setFieldValue('payment_at', date)}
                                                inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <div className="border border-gray-200 rounded p-3 mb-0 bg-gray-50">
                                    <h5 className="text-primary text-sm font-bold border-b pb-1 mb-2 flex items-center gap-2">
                                        <div className="bg-purple-100 text-purple-600 p-1.5 rounded-full flex items-center justify-center">
                                            <Paperclip className="w-4 h-4" />
                                        </div>
                                        ข้อมูลอ้างอิง
                                    </h5>
                                    <Row className="mb-2">
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">เลขที่ฎีกา</label>
                                            <input
                                                type="text"
                                                name="voucher_no"
                                                className="form-control text-sm"
                                                onChange={formik.handleChange}
                                                value={formik.values.voucher_no}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">เลขที่อ้างอิง</label>
                                            <input
                                                type="text"
                                                name="ref_no"
                                                className="form-control text-sm"
                                                onChange={formik.handleChange}
                                                value={formik.values.ref_no}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">เลขที่หนังสือขอเบิก</label>
                                            <input
                                                type="text"
                                                name="doc_no"
                                                className={`form-control text-sm ${formik.errors.doc_no && formik.touched.doc_no ? 'is-invalid' : ''}`}
                                                onChange={formik.handleChange}
                                                value={formik.values.doc_no}
                                            />
                                            {formik.touched.doc_no && formik.errors.doc_no && (
                                                <ErrorMessage
                                                    message={formik.errors.doc_no as string}
                                                    className="text-danger text-xs"
                                                />
                                            )}
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">วันที่หนังสือขอเบิก</label>
                                            <DatePicker
                                                value={formik.values.doc_date}
                                                onChange={(date: string) => formik.setFieldValue('doc_date', date)}
                                                inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full ${formik.errors.doc_date && formik.touched.doc_date ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                                error={formik.errors.doc_date && formik.touched.doc_date ? (formik.errors.doc_date as string) : undefined}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <label className="text-xs font-semibold">หมายเหตุ</label>
                                            <textarea
                                                name="remark"
                                                className="form-control text-sm"
                                                rows={2}
                                                onChange={formik.handleChange}
                                                value={formik.values.remark}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="py-2">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={onHide}>
                                    ยกเลิก
                                </button>
                                <button type="submit" className="btn btn-primary btn-sm" disabled={formik.isSubmitting}>
                                    {formik.isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรายละเอียด'}
                                </button>
                            </Modal.Footer>
                        </Form>
                    )
                }}
            </Formik>
        </Modal>
    )
}

export default DetailModal
