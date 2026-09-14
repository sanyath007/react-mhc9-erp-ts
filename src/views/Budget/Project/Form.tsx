import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker } from '@material-ui/pickers'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { useStyles } from '../../../hooks/useStyles'
import { getAllBudgetPlans } from '../../../features/slices/budget-plan/budgetPlanSlice'
import { store, update } from '../../../features/slices/budget-project/budgetProjectSlice'
import Loading from '../../../components/ui/Loading'

const budgetProjectSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาระบุชื่อโครงการ/ผลผลิต'),
    plan_id: Yup.string().required('กรุณาเลือกแผนงาน'),
    project_type_id: Yup.string().required('กรุณาเลือกประเภท'),
    year: Yup.string().required('กรุณาเลือกปีงบประมาณ'),
});

const BudgetProjectForm = ({ project, defaultYear, defaultPlan }: any) => {
    const classes = useStyles();
    const dispatch = useDispatch<any>();
    const { plans, isLoading } = useSelector((state: any) => state.budgetPlan);
    const [selectedYear, setSelectedYear] = useState(project ? moment(`${project.year}-01-01`) : (defaultYear ? moment(`${defaultYear}-01-01`) : moment()));

    useEffect(() => {
        dispatch(getAllBudgetPlans({ url: `/api/budget-plans?year=${selectedYear.year()}` }));
    }, [selectedYear]);

    const handleSubmit = (values, formik) => {
        if (project) {
            dispatch(update({ id: project.id, data: values }));
        } else {
            dispatch(store(values));
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: project ? project.name : '',
                plan_id: project ? project.plan_id : (defaultPlan ? defaultPlan : ''),
                project_type_id: project ? project.project_type_id : 1,
                year: project ? project.year : (defaultYear ? defaultYear : moment().format('YYYY')),
                gfmis_id: project ? project.gfmis_id : '',
                status: project ? project.status : ''
            }}
            onSubmit={handleSubmit}
            validationSchema={budgetProjectSchema}
        >
            {(formik) => {
                return (
                    <Form>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">ปีงบประมาณ :</label>
                            <div className="col-6">
                                <div className="flex flex-col w-[40%]">
                                    <DatePicker
                                        format="YYYY"
                                        views={['year']}
                                        value={selectedYear}
                                        onChange={(date) => {
                                            setSelectedYear(date);
                                            formik.setFieldValue('year', date.year());
                                        }}
                                        className={classes.muiTextFieldInput}
                                    />
                                    {(formik.errors.year && formik.touched.year) && (
                                        <span className="text-red-500 text-sm">{formik.errors.year as string}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">แผนงาน :</label>
                            <div className="col-6">
                                {isLoading && <div className="form-control text-sm"><Loading /></div>}
                                {!isLoading && <select
                                    name="plan_id"
                                    value={formik.values.plan_id}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- เลือกแผนงาน --</option>
                                    {plans && plans.map(plan => (
                                        <option value={plan.id} key={plan.id}>
                                            {plan.plan_no} {plan.name}
                                        </option>
                                    ))}
                                </select>}
                                {(formik.errors.plan_id && formik.touched.plan_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.plan_id as string}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">ประเภท :</label>
                            <div className="col-6 flex items-center justify-start gap-10 h-[34px]">
                                <label>
                                    <input
                                        type="radio"
                                        name="project_type_id"
                                        value={1}
                                        checked={formik.values.project_type_id === 1}
                                        onChange={() => formik.setFieldValue('project_type_id', 1)}
                                        className="mr-2"
                                    />
                                    โครงการ
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="project_type_id"
                                        value={2}
                                        checked={formik.values.project_type_id === 2}
                                        onChange={() => formik.setFieldValue('project_type_id', 2)}
                                        className="mr-2"
                                    />
                                    ผลผลิต
                                </label>
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">ชื่อโครงการ/ผลผลิต :</label>
                            <div className="col-6">
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                />
                                {(formik.errors.name && formik.touched.name) && (
                                    <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">รหัส GFMIS :</label>
                            <div className="col-6">
                                <input
                                    type="text"
                                    name="gfmis_id"
                                    value={formik.values.gfmis_id}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                />
                                {(formik.errors.gfmis_id && formik.touched.gfmis_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.gfmis_id as string}</span>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="offset-3">
                                <button type="submit" className={`btn ${project ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-sm`}>
                                    {project ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    )
}

export default BudgetProjectForm