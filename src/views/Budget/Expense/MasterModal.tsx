import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import YearPicker from '../../../components/ui/Forms/YearPicker';
import ModalBudgetList from '../../../components/Modals/BudgetList';
import DropdownAutocomplete from '../../../components/FormControls/DropdownAutocomplete';
import { currency } from '../../../utils';
import { update } from '../../../features/slices/budget-expense/budgetExpenseSlice';

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

type MasterModalProps = {
    isShow: boolean;
    onHide: () => void;
    expenseData: any;
    onSaveSuccess: () => void;
};

const MasterModal = ({ isShow, onHide, expenseData, onSaveSuccess }: MasterModalProps) => {
    const dispatch = useDispatch<any>();
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<any>(null);

    const initialValues = {
        year: expenseData?.year || moment().year(),
        budget_id: expenseData?.budget_id || '',
        budget_name: expenseData?.budget?.activity?.name ? `${expenseData.budget.activity.name} (${expenseData.budget.type?.name || ''})` : '',
        project_id: expenseData?.project_id || '',
        expense_type_id: expenseData?.expense_type_id || '',
        unit_text: expenseData?.unit_text || '',
        target: expenseData?.target || 0,
        amount: expenseData?.amount || 0.00,
        description: expenseData?.description || ''
    };

    const validationSchema = Yup.object().shape({
        year: Yup.string().required('กรุณาระบุปีงบประมาณ'),
        budget_id: Yup.string().required('กรุณาเลือกงบประมาณ'),
        project_id: Yup.string().required('กรุณาเลือกรหัสโครงการ'),
        expense_type_id: Yup.string().required('กรุณาเลือกรหัสค่าใช้จ่าย'),
        amount: Yup.number().required('กรุณาระบุจำนวนเงิน').min(1, 'จำนวนเงินต้องมากกว่า 0')
    });

    return (
        <Modal show={isShow} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="text-lg">แก้ไขข้อมูลค่าใช้จ่ายหลัก</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        try {
                            const payload = {
                                expense_type_id: parseInt(values.expense_type_id as string),
                                year: values.year,
                                budget_id: parseInt(values.budget_id as string),
                                project_id: parseInt(values.project_id as string),
                                unit_text: values.unit_text,
                                target: values.target,
                                amount: values.amount,
                                description: values.description || '',
                            };
                            const res = await dispatch(update({ id: expenseData.id, data: payload })).unwrap();
                            if (res.status === 1) {
                                toast.success('แก้ไขข้อมูลหลักเรียบร้อยแล้ว');
                                onSaveSuccess();
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
                    {(formik) => (
                        <Form>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <label className="text-sm">ปีงบประมาณ <span className="text-red-500">*</span></label>
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
                                    <label className="text-sm">งบประมาณ <span className="text-red-500">*</span></label>
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
                                    <label className="text-sm">ประเภทค่าใช้จ่าย <span className="text-red-500">*</span></label>
                                    <DropdownAutocomplete
                                        options={mockExpenseTypes}
                                        onSelect={(item) => formik.setFieldValue('expense_type_id', item ? item.id : '')}
                                        defaultVal={mockExpenseTypes.find(e => e.id === Number(formik.values.expense_type_id))}
                                        isInvalid={!!(formik.errors.expense_type_id && formik.touched.expense_type_id)}
                                    />
                                    {formik.errors.expense_type_id && formik.touched.expense_type_id && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.expense_type_id as string}</div>
                                    )}
                                </Col>
                                <Col md={9}>
                                    <label className="text-sm">โครงการ/กิจกรรม <span className="text-red-500">*</span></label>
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
                                <Col md={4}>
                                    <label className="text-sm">หน่วยนับ <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="unit_text"
                                        className={`form-control text-sm ${formik.errors.unit_text && formik.touched.unit_text ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        value={formik.values.unit_text}
                                    />
                                    {formik.errors.unit_text && formik.touched.unit_text && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.unit_text as string}</div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <label className="text-sm">เป้าหมาย <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="target"
                                        className={`form-control text-sm ${formik.errors.target && formik.touched.target ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        value={formik.values.target}
                                    />
                                    {formik.errors.target && formik.touched.target && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.target as string}</div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <label className="text-sm">จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className={`form-control text-sm ${formik.errors.amount && formik.touched.amount ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        value={formik.values.amount}
                                    />
                                    {formik.errors.amount && formik.touched.amount && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.amount as string}</div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="text-sm">คำอธิบาย</label>
                                    <textarea
                                        name="description"
                                        className="form-control text-sm"
                                        onChange={formik.handleChange}
                                        value={formik.values.description}
                                    />
                                </Col>
                            </Row>

                            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                                <button type="button" className="btn btn-secondary" onClick={onHide}>
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </button>
                            </div>

                            <ModalBudgetList
                                isShow={showBudgetModal}
                                onHide={() => setShowBudgetModal(false)}
                                onSelect={(budget: any) => {
                                    formik.setFieldValue('budget_id', budget.id);
                                    formik.setFieldValue('project_id', budget.activity?.project_id);
                                    formik.setFieldValue('budget_name', `${budget.activity?.name} (${budget.type?.name})`);
                                    setSelectedBudget(budget);
                                    setShowBudgetModal(false);
                                }}
                            />
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default MasterModal;
