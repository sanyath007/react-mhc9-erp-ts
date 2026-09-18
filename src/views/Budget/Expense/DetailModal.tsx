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
import { storeDetail } from '../../../features/slices/budget-expense/budgetExpenseSlice'

const mockSources = [
    { value: '1', label: 'เงินงบประมาณ' },
    { value: '2', label: 'เงินนอกงบประมาณ' },
    { value: '3', label: 'เงินบริจาค' },
];

const mockMonths = MONTH_TH_NAMES.map((name, index) => ({ value: String(index + 1), label: name }));

type DetailModalProps = {
    isShow: boolean;
    onHide: () => void;
    onSave: (detail: any) => void;
    initialYear: number;
    expenseId?: string | number;
}

const DetailModal = ({ isShow, onHide, onSave, initialYear, expenseId }: DetailModalProps) => {
    const dispatch = useDispatch<any>();
    const { suppliers, isLoading } = useSelector((state: any) => state.supplier);
    const { loggedInUser } = useSelector((state: any) => state.auth);
    const [supplierSearchQuery, setSupplierSearchQuery] = useState('');

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
        month: moment().month() + 1,
        year: initialYear || moment().year(),
        amount: 0,
        vat_amount: 0,
        vat_rate: 0,
        net_total: 0,
        paid_to: '',
        paid_at: '',
        paid_by: '',
        source_id: '',
        withdrawal_no: '',
        withdrawal_at: '',
        payment_no: '',
        payment_at: '',
        voucher_no: '',
        ref_no: '',
        doc_no: '',
        doc_date: '',
        remark: '',
        created_by: loggedInUser?.id || '',
    };

    const validationSchema = Yup.object().shape({
        month: Yup.number().required('กรุณาระบุเดือน'),
        year: Yup.number().required('กรุณาระบุปี'),
        amount: Yup.number().required('กรุณาระบุจำนวนเงิน').min(0, 'จำนวนเงินต้องไม่ติดลบ'),
        vat_amount: Yup.number().min(0, 'ภาษีต้องไม่ติดลบ'),
        vat_rate: Yup.number().min(0, 'ภาษีต้องไม่ติดลบ'),
        paid_to: Yup.string().required('กรุณาระบุผู้รับเงิน'),
        paid_at: Yup.string().required('กรุณาระบุวันที่'),
        paid_by: Yup.string().required('กรุณาระบุผู้ออกเงิน'),
        source_id: Yup.string().required('กรุณาระบุแหล่งเงิน')
    });

    const handleCalculateTotal = (amount: number, vat: number) => {
        return amount - vat;
    }

    const handleCalculateVat = (amount: number, vat_rate: number) => {
        return amount * (vat_rate / 100);
    }

    return (
        <Modal show={isShow} onHide={onHide} size="xl" backdrop="static">
            <Modal.Header closeButton className="py-2">
                <Modal.Title className="text-lg font-bold">เพิ่มรายละเอียดค่าใช้จ่ายรายเดือน</Modal.Title>
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
                        const res = await dispatch(storeDetail({ id: expenseId, data: values })).unwrap();
                        if (res.status === 1) {
                            onSave(res.detail || values);
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
                    console.log(formik.errors);
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
                                        <label className="text-sm font-semibold">ปีงบประมาณ <span className="text-red-500">*</span></label>
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
                                    <Col md={4}>
                                        <label className="text-sm font-semibold">จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            name="amount"
                                            className={`form-control text-sm text-center ${formik.errors.amount && formik.touched.amount ? 'is-invalid' : ''}`}
                                            onChange={(e) => formik.setFieldValue('amount', Number(e.target.value))}
                                            onBlur={() => formik.setFieldValue('net_total', handleCalculateTotal(formik.values.amount, formik.values.vat_amount))}
                                            value={formik.values.amount}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        {formik.errors.amount && formik.touched.amount && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.amount as string}</div>
                                        )}
                                    </Col>
                                    <Col md={2}>
                                        <label className="text-sm font-semibold">อัตราภาษีหัก ณ ที่จ่าย (%)</label>
                                        <input
                                            type="number"
                                            name="vat_rate"
                                            className="form-control text-sm text-center"
                                            onChange={(e) => formik.setFieldValue('vat_rate', Number(e.target.value))}
                                            onBlur={() => formik.setFieldValue('vat_amount', handleCalculateVat(formik.values.amount, formik.values.vat_rate))}
                                            value={formik.values.vat_rate}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <label className="text-sm font-semibold">ภาษีหัก ณ ที่จ่าย (บาท)</label>
                                        <input
                                            type="number"
                                            name="vat_amount"
                                            className="form-control text-sm text-center"
                                            onChange={(e) => formik.setFieldValue('vat_amount', Number(e.target.value))}
                                            onBlur={() => formik.setFieldValue('net_total', handleCalculateTotal(formik.values.amount, formik.values.vat_amount))}
                                            value={formik.values.vat_amount}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <label className="text-sm font-semibold">จำนวนเงินสุทธิ (บาท)</label>
                                        <input
                                            type="number"
                                            name="net_total"
                                            className="form-control text-sm text-center bg-gray-100 font-bold text-blue-600"
                                            readOnly
                                            value={formik.values.net_total}
                                        />
                                    </Col>
                                </Row>

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
                                                onChange={(value) => formik.setFieldValue('paid_to', value)}
                                                error={formik.errors.paid_to && formik.touched.paid_to ? formik.errors.paid_to as string : undefined}
                                                inputCss="!h-[34px] !bg-white !rounded-[0.375rem]"
                                                prefixIcon={<Store className="w-4 h-4" />}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">วันที่จ่าย</label>
                                            <DatePicker
                                                value={formik.values.paid_at}
                                                error={formik.errors.paid_at && formik.touched.paid_at ? formik.errors.paid_at as string : undefined}
                                                onChange={(date: string) => formik.setFieldValue('paid_at', date)}
                                                inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">ผู้จ่ายเงิน</label>
                                            <EmployeeSelection fieldName="paid_by" />
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
                                                className="form-control text-sm"
                                                onChange={formik.handleChange}
                                                value={formik.values.doc_no}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <label className="text-xs font-semibold">วันที่หนังสือขอเบิก</label>
                                            <DatePicker
                                                value={formik.values.doc_date}
                                                onChange={(date: string) => formik.setFieldValue('doc_date', date)}
                                                inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
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
