import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Col, Row } from 'react-bootstrap'
import moment from 'moment'
import { FaSearch, FaPlus, FaTrash, FaPencilAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import YearPicker from '../../../components/ui/Forms/YearPicker'
import ModalBudgetList from '../../../components/Modals/BudgetList'
import DropdownAutocomplete from '../../../components/FormControls/DropdownAutocomplete'
import { currency } from '../../../utils'
import DetailModal from './DetailModal'

const mockProjects = [
    { id: 1, label: 'โครงการพัฒนาบุคลากร', name: 'โครงการพัฒนาบุคลากร' },
    { id: 2, label: 'โครงการพัฒนาระบบสารสนเทศ', name: 'โครงการพัฒนาระบบสารสนเทศ' },
    { id: 3, label: 'โครงการบริหารจัดการองค์กร', name: 'โครงการบริหารจัดการองค์กร' },
];

const mockExpenseTypes = [
    { id: 1, label: 'ค่าตอบแทนใช้สอยและวัสดุ', name: 'ค่าตอบแทนใช้สอยและวัสดุ', budget_type_id: 2 },
    { id: 2, label: 'ค่าวัสดุ', name: 'ค่าวัสดุ', budget_type_id: 2 },
    { id: 3, label: 'ค่าสาธารณูปโภค', name: 'ค่าสาธารณูปโภค', budget_type_id: 2 },
    { id: 4, label: 'ค่าตอบแทนพนักงานราชการ', name: 'ค่าตอบแทนพนักงานราชการ', budget_type_id: 1 },
    { id: 5, label: 'เงินค่าครองชีพ', name: 'เงินค่าครองชีพ', budget_type_id: 1 },
    { id: 6, label: 'เงินสมทบกองทุนประกันสังคม', name: 'เงินสมทบกองทุนประกันสังคม', budget_type_id: 2 },
    { id: 7, label: 'ค่าล่วงเวลา', name: 'ค่าล่วงเวลา', budget_type_id: 99 },
    { id: 8, label: 'เงินช่วยการศึกษาบุตร', name: 'เงินช่วยการศึกษาบุตร', budget_type_id: 4 },
    { id: 9, label: 'ค่ารักษาพยาบาล', name: 'ค่ารักษาพยาบาล', budget_type_id: 4 },
    { id: 10, label: 'เงินนอกงบประมาณ', name: 'เงินนอกงบประมาณ', budget_type_id: 6 },
];

type BudgetExpenseFormProp = {
    visible?: boolean;
    onClose?: () => void;
};

type BudgetExpense = {
    id: number;
    year: number;               // ปีงบประมาณ
    budget_id: number;          // รหัสงบประมาณ
    budget_expense_id: number;  // ประเภทค่าใช้จ่าย
    project_id: number;         // รหัสโครงการ/กิจกรรม
    amount: number;             // จำนวนเงิน
    description: string;        // คำอธิบาย
    details: BudgetExpenseDetail[]; // รายละเอียด
}

type BudgetExpenseDetail = {
    id: number;
    budget_expense_id: number;
    mounth: number;             // เดือน
    year: number;               // ปี
    amount: number;             // จำนวนเงิน
    vat: number;                // ภาษีหัก ณ ที่จ่าย
    total: number;              // จำนวนเงินสุทธิ
    paid_to: number;            // จ่ายให้
    paid_at: Date;              // วันที่จ่าย
    paid_by: number;            // ผู้จ่าย
    source_id: string;          // แหล่งเงิน
    withdrawal_no: string;      // เลขที่ขอเบิก
    withdrawal_at: Date;        // วันที่ขอเบิก
    payment_no: string          // เลขที่ขอจ่าย
    payment_at: Date;           // วันที่ขอจ่าย
    voucher_no: string          // เลขที่ใบสำคัญ
    ref_no: string              // เลขที่อ้างอิง
    remark: string;             // หมายเหตุ
    user_id: number;            // ผู้บันทึก
}

const BudgetExpenseForm = ({ visible, onClose }: BudgetExpenseFormProp) => {
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [isMasterSaved, setIsMasterSaved] = useState(false);
    const [masterData, setMasterData] = useState<any>(null);
    const [details, setDetails] = useState<BudgetExpenseDetail[]>([]);
    const [selectedBudget, setSelectedBudget] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const initialValues = {
        year: moment().year(),
        budget_id: '',
        budget_name: '', // สำหรับแสดงผล
        project_id: '',
        budget_expense_id: '',
        amount: '',
        description: ''
    };

    const validationSchema = Yup.object().shape({
        year: Yup.string().required('กรุณาระบุปีงบประมาณ'),
        budget_id: Yup.string().required('กรุณาเลือกงบประมาณ'),
        project_id: Yup.string().required('กรุณาเลือกรหัสโครงการ'),
        budget_expense_id: Yup.string().required('กรุณาเลือกรหัสค่าใช้จ่าย'),
        amount: Yup.number().required('กรุณาระบุจำนวนเงิน').min(1, 'จำนวนเงินต้องมากกว่า 0')
    });

    return (
        <div className="p-4">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // จำลองการบันทึกข้อมูล
                    setSubmitting(true);
                    setTimeout(() => {
                        setMasterData({ ...values, id: 1 });
                        setIsMasterSaved(true);
                        setSubmitting(false);
                        toast.success('บันทึกข้อมูลหลักเรียบร้อยแล้ว');
                    }, 500);
                }}
            >
                {(formik) => (
                    <Form>
                        <h4 className="mb-3 text-primary border-b pb-2 font-bold">1. ข้อมูลค่าใช้จ่ายหลัก</h4>
                        <Row className="mb-3">
                            <Col md={3}>
                                <label>ปีงบประมาณ <span className="text-red-500">*</span></label>
                                <YearPicker
                                    value={formik.values.year}
                                    onChange={(year: string) => formik.setFieldValue('year', year)}
                                    inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                />
                                {formik.errors.year && formik.touched.year && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.year as string}</div>
                                )}
                            </Col>
                            <Col md={9}>
                                <label>งบประมาณ <span className="text-red-500">*</span></label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control text-sm ${formik.errors.budget_id && formik.touched.budget_id ? 'is-invalid' : ''}`}
                                        value={formik.values.budget_name}
                                        readOnly
                                        placeholder="คลิกปุ่มค้นหาเพื่อเลือกรหัสงบประมาณ"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowBudgetModal(true)}
                                        disabled={isMasterSaved}
                                    >
                                        <FaSearch />
                                    </button>
                                </div>
                                {formik.errors.budget_id && formik.touched.budget_id && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.budget_id as string}</div>
                                )}
                            </Col>
                        </Row>

                        {selectedBudget && (
                            <div className="bg-blue-50 rounded-md p-3 mb-3 border border-blue-200 text-sm">
                                <p className="mb-1"><span className="font-semibold text-gray-700">แผนงาน:</span> {selectedBudget.activity?.project?.plan?.plan_no} {selectedBudget.activity?.project?.plan?.name}</p>
                                <p className="mb-1"><span className="font-semibold text-gray-700">โครงการ/ผลผลิต:</span> {selectedBudget.activity?.project?.name}</p>
                                <p className="mb-1"><span className="font-semibold text-gray-700">กิจกรรม:</span> {selectedBudget.activity?.name}</p>
                                <p className="mb-0"><span className="font-semibold text-gray-700">รายการงบประมาณ:</span> {selectedBudget.type?.name} {selectedBudget.total ? `(งบจัดสรร: ${currency.format(selectedBudget.total)} บาท)` : ''}</p>
                            </div>
                        )}

                        <Row className="mb-3">
                            <Col md={3}>
                                <label>ประเภทค่าใช้จ่าย <span className="text-red-500">*</span></label>
                                <DropdownAutocomplete
                                    options={mockExpenseTypes}
                                    onSelect={(item) => formik.setFieldValue('budget_expense_id', item ? item.id : '')}
                                    defaultVal={mockExpenseTypes.find(e => e.id === Number(formik.values.budget_expense_id))}
                                    isInvalid={!!(formik.errors.budget_expense_id && formik.touched.budget_expense_id)}
                                />
                                {formik.errors.budget_expense_id && formik.touched.budget_expense_id && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.budget_expense_id as string}</div>
                                )}
                            </Col>
                            <Col md={9}>
                                <label>โครงการ/กิจกรรม <span className="text-red-500">*</span></label>
                                <DropdownAutocomplete
                                    options={mockProjects}
                                    onSelect={(item) => formik.setFieldValue('project_id', item ? item.id : '')}
                                    defaultVal={mockProjects.find(p => p.id === Number(formik.values.project_id))}
                                    isInvalid={!!(formik.errors.project_id && formik.touched.project_id)}
                                />
                                {formik.errors.project_id && formik.touched.project_id && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.project_id as string}</div>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <label>จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="amount"
                                    className={`form-control text-sm ${formik.errors.amount && formik.touched.amount ? 'is-invalid' : ''}`}
                                    onChange={formik.handleChange}
                                    value={formik.values.amount}
                                    disabled={isMasterSaved}
                                />
                                {formik.errors.amount && formik.touched.amount && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.amount as string}</div>
                                )}
                            </Col>
                            <Col md={9}>
                                <label>คำอธิบาย</label>
                                <input
                                    type="text"
                                    name="description"
                                    className="form-control text-sm"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    disabled={isMasterSaved}
                                />
                            </Col>
                        </Row>

                        <div className="text-center mb-4 border-b pb-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={formik.isSubmitting || isMasterSaved}
                            >
                                {formik.isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลหลัก'}
                            </button>
                            {isMasterSaved && (
                                <span className="ml-2 text-green-600 font-bold">บันทึกข้อมูลส่วนที่ 1 สำเร็จแล้ว</span>
                            )}
                        </div>

                        {/* Modal เลือกงบประมาณ (Plan -> Project -> Activity -> Budget) */}
                        <ModalBudgetList
                            isShow={showBudgetModal}
                            onHide={() => setShowBudgetModal(false)}
                            onSelect={(budget: any) => {
                                formik.setFieldValue('budget_id', budget.id);
                                formik.setFieldValue('project_id', budget.activity?.project_id);
                                formik.setFieldValue('budget_name', `${budget.activity?.name} (${budget.type?.name})`);
                                setSelectedBudget(budget);
                            }}
                        />
                    </Form>
                )}
            </Formik>

            {/* ------------------------------------------------------------- */}
            {/* Part 2: Detail Section */}
            {/* ------------------------------------------------------------- */}
            <div className={`mt-4 ${!isMasterSaved ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-primary m-0 font-bold">2. รายละเอียดค่าใช้จ่าย (รายเดือน)</h4>
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        disabled={!isMasterSaved}
                        onClick={() => setShowDetailModal(true)}
                    >
                        <FaPlus className="inline mr-1" /> เพิ่มรายละเอียด
                    </button>
                </div>

                {!isMasterSaved && (
                    <div className="alert alert-warning py-2 mb-2">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        กรุณาบันทึกข้อมูลหลัก (ส่วนที่ 1) ก่อน เพื่อปลดล็อคการเพิ่มรายละเอียดค่าใช้จ่าย
                    </div>
                )}

                <table className="table table-bordered table-striped text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-center w-[5%]">#</th>
                            <th className="text-center w-[10%]">เดือน/ปี</th>
                            <th className="text-center">เลขที่ขอเบิก</th>
                            <th className="text-center w-[20%]">ผู้รับเงิน</th>
                            <th className="text-center w-[15%]">จำนวนเงินสุทธิ</th>
                            <th className="text-center w-[10%]">การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                    -- ยังไม่มีข้อมูลรายละเอียดค่าใช้จ่าย --
                                </td>
                            </tr>
                        ) : (
                            details.map((detail, index) => (
                                <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">{detail.mounth}/{detail.year}</td>
                                    <td className="text-center">{detail.withdrawal_no}</td>
                                    <td>{detail.paid_to}</td>
                                    <td className="text-right">{currency.format(detail.total)}</td>
                                    <td className="text-center">
                                        <button className="btn btn-warning btn-sm mx-1"><FaPencilAlt /></button>
                                        <button className="btn btn-danger btn-sm mx-1"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <DetailModal 
                    isShow={showDetailModal}
                    onHide={() => setShowDetailModal(false)}
                    initialYear={masterData?.year}
                    onSave={(newDetail) => {
                        setDetails([...details, newDetail]);
                        toast.success('เพิ่มรายละเอียดเรียบร้อยแล้ว');
                    }}
                />
            </div>
        </div>
    )
}

export default BudgetExpenseForm