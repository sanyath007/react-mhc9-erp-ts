import React, { Fragment, useEffect, useState } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import { FaSearch, FaFolderOpen, FaBox, FaTasks } from 'react-icons/fa';
import moment from 'moment';

import YearPicker from '../../components/ui/Forms/YearPicker';
import SearchableSelect from '../../components/ui/Forms/SearchableSelect';
import EmployeeSelection from '../../components/FormControls/EmployeeSelection';
import DatePicker from '../../components/ui/Forms/DatePicker';
import ModalBudgetList from '../../components/Modals/BudgetList';
import PlaceSelection from '../../components/ui/Forms/PlaceSelection';
import ModalPlaceList from '../../components/Modals/Place/List';
import ModalPlaceForm from '../../components/Modals/Place/Form';
import ButtonGroupSelection from '../../components/ui/Forms/ButtonGroupSelection';
import { useGetInitialFormDataQuery } from '../../features/services/project/projectApi';
import BudgetTypeBadge from '../../components/Badges/BudgetTypeBadge';

const PROJECT_TYPES = [
    {
        id: 1,
        name: 'โครงการ',
        icon: <FaFolderOpen />
    },
    {
        id: 2,
        name: 'ผลผลิต',
        icon: <FaBox />
    },
    {
        id: 3,
        name: 'กิจกรรม',
        icon: <FaTasks />
    },
];

const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาระบุชื่อโครงการ'),
    year: Yup.string().required('กรุณาระบุปีงบประมาณ'),
    project_type_id: Yup.string().required('กรุณาระบุประเภทโครงการ'),
    budget_id: Yup.string().required('กรุณาระบุรหัสงบประมาณ'),
    from_date: Yup.string().required('กรุณาระบุวันที่เริ่มดำเนินการ'),
    to_date: Yup.string().required('กรุณาระบุวันที่สิ้นสุด'),
});

const Form = ({ project, onSubmit }: any) => {
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<any>(null);
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [showPlaceFormModal, setShowPlaceFormModal] = useState(false);
    const [selectedDep, setSelectedDep] = useState('');

    useEffect(() => {
        if (project?.budget_id) {
            setSelectedBudget(project?.budget);
        }

        // if (project?.department_id) {
        //     setSelectedDep(project.department_id);
        // }
    }, [project])

    const initialValues = {
        name: project?.name || '',
        year: project?.year || moment().year(),
        project_type_id: project?.project_type_id || '',
        budget_id: project?.budget_id || '',
        budget_name: project?.budget ? `${project.budget.activity?.project?.plan?.plan_no} ${project.budget.activity?.project?.plan?.name} - ${project.budget.activity?.name}` : '',
        department_id: project?.department_id || '',
        division_id: project?.division_id || '',
        owner_id: project?.owner_id || '',
        from_date: project?.from_date || '',
        to_date: project?.to_date || '',
        place_id: project?.place_id || '',
        place: project?.place || null,
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
                {(formik) => {
                    return (
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
                                    {formik.errors.budget_id && formik.touched.budget_id && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.budget_id as string}</div>
                                    )}
                                </Col>
                            </Row>

                            {selectedBudget && (
                                <div className="bg-blue-50 rounded-md p-3 mb-3 border border-blue-200 text-sm">
                                    <p className="mb-1"><span className="font-semibold text-gray-700 mr-1">แผนงาน:</span>{selectedBudget.activity?.project?.plan?.plan_no} {selectedBudget.activity?.project?.plan?.name}</p>
                                    <p className="mb-1"><span className="font-semibold text-gray-700 mr-1">โครงการ/ผลผลิต:</span>{selectedBudget.activity?.project?.name}</p>
                                    <p className="mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">กิจกรรม:</span>
                                        {selectedBudget.activity?.name}
                                        <BudgetTypeBadge type={selectedBudget?.type} />
                                    </p>
                                </div>
                            )}

                            <Row className="mb-3">
                                <Col md={6}>
                                    <label>ประเภทโครงการ <span className="text-red-500">*</span></label>
                                    <ButtonGroupSelection
                                        value={formik.values.project_type_id}
                                        options={PROJECT_TYPES.map((t: any) => ({ value: String(t.id), label: t.name, icon: t.icon }))}
                                        onChange={(val: string | number) => formik.setFieldValue('project_type_id', val)}
                                        error={!!(formik.errors.project_type_id && formik.touched.project_type_id)}
                                        errorMessage={formik.errors.project_type_id as string}
                                    />
                                </Col>
                                <Col md={6}>
                                    <PlaceSelection
                                        place={formik.values.place}
                                        error={!!(formik.errors.place_id && formik.touched.place_id)}
                                        errorMessage={formik.errors.place_id as string}
                                        onSearchClick={() => setShowPlaceModal(true)}
                                        onAddClick={() => setShowPlaceFormModal(true)}
                                    />
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <label>กลุ่มงาน/หน่วยงานรับผิดชอบ</label>
                                    <select
                                        name="department_id"
                                        value={selectedDep}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.search(/-/i)) {
                                                const [department, division] = val.split('-');

                                                formik.setFieldValue('department_id', department);
                                                formik.setFieldValue('division_id', division);
                                            } else {
                                                formik.setFieldValue('department_id', val);
                                                formik.setFieldValue('division_id', '');
                                            }

                                            setSelectedDep(val)
                                            setTimeout(() => formik.setFieldTouched('division_id', true), 300);
                                        }}
                                        className={`form-control text-sm ${(formik.errors.division_id && formik.touched.division_id) && 'border-red-500'}`}
                                    >
                                        <option value="">-- หน่วยงาน --</option>
                                        {formData?.departments && formData.departments.filter(dep => dep.id !== 1).map(dep => (
                                            <Fragment key={dep.id}>
                                                <option value={dep.id} className="font-bold">
                                                    {dep.name}
                                                </option>
                                                {dep.divisions.length > 0 && dep.divisions.map(division => (
                                                    <option value={`${dep.id}-${division.id}`} key={`${dep.id}-${division.id}`}>
                                                        {division.name}
                                                    </option>
                                                ))}
                                            </Fragment>
                                        ))}
                                    </select>
                                    {(formik.errors.division_id && formik.touched.division_id) && (
                                        <span className="text-red-500 text-xs">{formik.errors.division_id as string}</span>
                                    )}
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

                            <ModalPlaceList
                                isShow={showPlaceModal}
                                onHide={() => setShowPlaceModal(false)}
                                onSelect={(place: any) => {
                                    formik.setFieldValue('place_id', place.id);
                                    formik.setFieldValue('place', place);
                                }}
                            />

                            <ModalPlaceForm
                                isShow={showPlaceFormModal}
                                onHide={() => setShowPlaceFormModal(false)}
                                onSubmit={(place: any) => {
                                    formik.setFieldValue('place_id', place?.id);
                                    formik.setFieldValue('place', place);
                                }}
                            />
                        </FormikForm>
                    )
                }}
            </Formik>
        </>
    );
};

export default Form;
