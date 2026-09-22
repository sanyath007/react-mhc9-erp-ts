import React, { useState } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import moment from 'moment';

import YearPicker from '../../components/ui/Forms/YearPicker';
import SearchableSelect from '../../components/ui/Forms/SearchableSelect';
import EmployeeSelection from '../../components/FormControls/EmployeeSelection';
import DatePicker from '../../components/ui/Forms/DatePicker';
import ModalBudgetList from '../../components/Modals/BudgetList';
import { useGetInitialFormDataQuery } from '../../features/services/project/projectApi';

const PROJECT_TYPES = [
    {
        id: 1,
        name: 'โครงการ',
    },
    {
        id: 2,
        name: 'ผลผลิต',
    },
    {
        id: 3,
        name: 'กิจกรรม',
    },
];

const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาระบุชื่อโครงการ'),
    year: Yup.string().required('กรุณาระบุปีงบประมาณ'),
    project_type_id: Yup.string().required('กรุณาระบุประเภทโครงการ'),
    from_date: Yup.string().required('กรุณาระบุวันที่เริ่มดำเนินการ'),
    to_date: Yup.string().required('กรุณาระบุวันที่สิ้นสุด'),
});

const Form = ({ project, onSubmit }: any) => {
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<any>(null);

    const initialValues = {
        name: project?.name || '',
        year: project?.year || moment().year(),
        project_type_id: project?.project_type_id || '',
        budget_id: project?.budget_id || '',
        budget_name: project?.budget ? `${project.budget.activity?.project?.plan?.plan_no} ${project.budget.activity?.project?.plan?.name} - ${project.budget.activity?.name}` : '',
        division_id: project?.division_id || '',
        owner_id: project?.owner_id || '',
        from_date: project?.from_date || '',
        to_date: project?.to_date || '',
        place_id: project?.place_id || '',
        status: project?.status !== undefined ? project.status : 1,
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={ProjectSchema}
                onSubmit={(values) => {
                    const dataToSubmit = { ...values };
                    delete dataToSubmit.budget_name;
                    onSubmit(dataToSubmit);
                }}
            >
                {(formik) => (
                    <FormikForm>
                        <Row className="mb-3">
                            <Col md={10}>
                                <label>ชื่อโครงการ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control text-sm ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.name && formik.touched.name && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name as string}</div>
                                )}
                            </Col>
                            <Col md={2}>
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
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <label>งบประมาณ</label>
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
                            </Col>
                        </Row>

                        {selectedBudget && (
                            <div className="bg-blue-50 rounded-md p-3 mb-3 border border-blue-200 text-sm">
                                <p className="mb-1"><span className="font-semibold text-gray-700">แผนงาน:</span> {selectedBudget.activity?.project?.plan?.plan_no} {selectedBudget.activity?.project?.plan?.name}</p>
                                <p className="mb-1"><span className="font-semibold text-gray-700">โครงการ/ผลผลิต:</span> {selectedBudget.activity?.project?.name}</p>
                                <p className="mb-1"><span className="font-semibold text-gray-700">กิจกรรม:</span> {selectedBudget.activity?.name}</p>
                            </div>
                        )}

                        <Row className="mb-3">
                            <Col md={6}>
                                <label>ประเภทโครงการ <span className="text-red-500">*</span></label>
                                <SearchableSelect
                                    value={String(formik.values.project_type_id)}
                                    options={PROJECT_TYPES.map((t: any) => ({ value: String(t.id), label: t.name }))}
                                    onChange={(val: string) => formik.setFieldValue('project_type_id', val)}
                                    placeholder="-- เลือกประเภทโครงการ --"
                                    inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                />
                                {formik.errors.project_type_id && formik.touched.project_type_id && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.project_type_id as string}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <label>สถานที่จัดโครงการ</label>
                                <SearchableSelect
                                    value={String(formik.values.place_id)}
                                    options={(formData?.places || []).map((p: any) => ({ value: String(p.id), label: p.name }))}
                                    onChange={(val: string) => formik.setFieldValue('place_id', val)}
                                    placeholder="-- เลือกสถานที่ --"
                                    inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <label>กลุ่มงาน/หน่วยงานรับผิดชอบ</label>
                                <SearchableSelect
                                    value={String(formik.values.division_id)}
                                    options={(formData?.divisions || []).map((d: any) => ({ value: String(d.id), label: d.name }))}
                                    onChange={(val: string) => formik.setFieldValue('division_id', val)}
                                    placeholder="-- เลือกกลุ่มงาน/หน่วยงาน --"
                                    inputCss="!min-h-[34px] !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                />
                            </Col>
                            <Col md={6}>
                                <label>ผู้รับผิดชอบโครงการ</label>
                                <EmployeeSelection
                                    selected={formik.values.owner_id}
                                    onSelect={(val: any) => formik.setFieldValue('owner_id', val)}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <label>เริ่มดำเนินการ <span className="text-red-500">*</span></label>
                                <DatePicker
                                    value={formik.values.from_date}
                                    onChange={(date: string) => formik.setFieldValue('from_date', date)}
                                    inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full ${formik.errors.from_date && formik.touched.from_date ? '!border-red-500' : ''}`}
                                />
                                {formik.errors.from_date && formik.touched.from_date && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.from_date as string}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <label>สิ้นสุดดำเนินการ <span className="text-red-500">*</span></label>
                                <DatePicker
                                    value={formik.values.to_date}
                                    onChange={(date: string) => formik.setFieldValue('to_date', date)}
                                    inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full ${formik.errors.to_date && formik.touched.to_date ? '!border-red-500' : ''}`}
                                />
                                {formik.errors.to_date && formik.touched.to_date && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.to_date as string}</div>
                                )}
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <div className="flex justify-center space-x-2">
                            <button type="submit" className="btn btn-primary px-4">
                                บันทึก
                            </button>
                        </div>

                        <ModalBudgetList
                            isShow={showBudgetModal}
                            onHide={() => setShowBudgetModal(false)}
                            onSelect={(budget: any) => {
                                formik.setFieldValue('budget_id', budget.id);
                                formik.setFieldValue('budget_name', `${budget.activity?.project?.plan?.plan_no} ${budget.activity?.project?.plan?.name} - ${budget.activity?.name}`);
                                setSelectedBudget(budget);
                            }}
                        />
                    </FormikForm>
                )}
            </Formik>
        </>
    );
};

export default Form;
