import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker } from '@material-ui/pickers'
import { toast } from 'react-toastify'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { removeItemWithFlag } from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'
import { store, update } from '../../../features/slices/budget-activity/budgetActivitySlice'
import { getAllBudgetPlans } from '../../../features/slices/budget-plan/budgetPlanSlice'
import { getAllBudgetProjects } from '../../../features/slices/budget-project/budgetProjectSlice'
import AddBudget from './AddBudget'
import BudgetList from './BudgetList'
import Loading from '../../../components/ui/Loading'

const budgetSchema = Yup.object().shape({
    activity_no: Yup.string().required('กรุณาระบุเลขที่กิจกรรม'),
    name: Yup.string().required('กรุณาระบุชื่อกิจกรรม'),
    plan_id: Yup.string().required('กรุณาเลือกแผนงาน'),
    project_id: Yup.string().required('กรุณาเลือกโครงการ/ผลผลิต'),
    year: Yup.string().required('กรุณาเลือกปีงบประมาณ'),
});

const BudgetActivityForm = ({ activity, defaultYear, defaultProject }: any) => {
    const classes = useStyles();
    const dispatch = useDispatch<any>();
    const { plans, isLoading: isPlanLoading } = useSelector((state: any) => state.budgetPlan);
    const { projects, isLoading: isProjectLoading } = useSelector((state: any) => state.budgetProject);
    const [filteredProject, setFilteredProject] = useState([]);
    const [selectedYear, setSelectedYear] = useState(activity ? moment(`${activity.year}-01-01`) : (defaultYear ? moment(`${defaultYear}-01-01`) : moment()));
    const [showBudgetForm, setShowBudgetForm] = useState(false);
    const [editingItem, setEdittingItem] = useState(null);
    const [planId, setPlanId] = useState('');

    useEffect(() => {
        dispatch(getAllBudgetPlans({ url: `/api/budget-plans?year=${selectedYear.year()}` }));
        dispatch(getAllBudgetProjects({ url: `/api/budget-projects?year=${selectedYear.year()}` }));
    }, [selectedYear]);

    useEffect(() => {
        if (activity) {
            handleFilterProject(activity?.project?.plan_id);
        }
    }, [activity]);

    useEffect(() => {
        if (projects && !activity) {
            const _project = projects.find(proj => proj.id === parseInt(defaultProject, 10));
            setPlanId(_project?.plan_id);
            handleFilterProject(_project?.plan_id);
        }
    }, [projects]);

    const handleFilterProject = (planId) => {
        const newProjects = projects.filter(project => project.plan_id === parseInt(planId, 10));

        setFilteredProject(newProjects);
    };

    const handleAddBudget = (formik, data) => {
        if (formik.values.budgets.some(type => type.budget_type_id === data.budget_type_id)) {
            toast.error("ไม่สามารถระบุรายการซ้ำได้!!");
            return;
        }

        const newBudgets = [...formik.values.budgets, data];
        formik.setFieldValue('budgets', newBudgets);
    };

    const handleUpdateBudget = (formik, id, data) => {
        const updatedBudgets = formik.values.budgets.map(budget => {
            if (budget.id === id) {
                return {
                    ...data,
                    updated: true,
                }
            }

            return budget;
        });

        formik.setFieldValue('budgets', updatedBudgets);
    };

    const handleRemoveBudget = (formik, id, isNewItem) => {
        if (window.confirm('คุณต้องการลบรายการประเภทงบประมาณใช้หรือไม่?')) {
            const updatedBudgets = removeItemWithFlag(formik.values.budgets, id, isNewItem);
            formik.setFieldValue('budgets', updatedBudgets);
        }
    };

    const handleSubmit = (values, formik) => {
        if (activity) {
            dispatch(update({ id: activity.id, data: values }));
        } else {
            dispatch(store(values));
            setPlanId('');
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: activity ? activity.name : '',
                activity_no: activity ? activity.activity_no : '',
                year: activity ? activity.year : (defaultYear ? defaultYear : moment().format('YYYY')),
                gfmis_id: (activity && activity.gfmis_id) ? activity.gfmis_id : '',
                plan_id: (activity && activity.project) ? activity.project.plan_id : (planId !== '' ? planId : ''),
                project_id: activity ? activity.project_id : (defaultProject ? defaultProject : ''),
                budgets: activity ? activity.budgets : []
            }}
            onSubmit={handleSubmit}
            validationSchema={budgetSchema}
        >
            {(formik) => {
                return (
                    <Form>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">ปีงบประมาณ :</label>
                            <Col md={6}>
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
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">แผนงาน :</label>
                            <Col md={6}>
                                {isPlanLoading && <div className="form-control"><Loading /></div>}
                                {!isPlanLoading && <select
                                    name="plan_id"
                                    value={formik.values.plan_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleFilterProject(e.target.value);
                                    }}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- แผนงาน --</option>
                                    {plans && plans.map(plan => (
                                        <option value={plan.id} key={plan.id}>
                                            {plan.plan_no} {plan.name}
                                        </option>
                                    ))}
                                </select>}
                                {(formik.errors.plan_id && formik.touched.plan_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.plan_id as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">โครงการ/ผลผลิต :</label>
                            <Col md={6}>
                                {isProjectLoading && <div className="form-control"><Loading /></div>}
                                {!isProjectLoading && <select
                                    name="project_id"
                                    value={formik.values.project_id}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- โครงการ/ผลผลิต --</option>
                                    {filteredProject && filteredProject.map(project => (
                                        <option value={project.id} key={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>}
                                {(formik.errors.project_id && formik.touched.project_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.project_id as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">เลขที่กิจกรรม :</label>
                            <Col md={6}>
                                <input
                                    type="text"
                                    name="activity_no"
                                    value={formik.values.activity_no}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                    placeholder="ระบุเลขที่กิจกรรม"
                                />
                                {(formik.errors.activity_no && formik.touched.activity_no) && (
                                    <span className="text-red-500 text-sm">{formik.errors.activity_no as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">ชื่อกิจกรรม :</label>
                            <Col md={6}>
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                    placeholder="ระบุชื่อกิจกรรม"
                                />
                                {(formik.errors.name && formik.touched.name) && (
                                    <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">รหัส New GFMIS :</label>
                            <Col md={6}>
                                <input
                                    type="text"
                                    name="gfmis_id"
                                    value={formik.values.gfmis_id}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                    placeholder="ระบุรหัส New GFMIS"
                                />
                                {(formik.errors.gfmis_id && formik.touched.gfmis_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.gfmis_id as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <label htmlFor="" className="col-3 col-form-label text-right">รายการประเภทงบ :</label>
                            <Col md={7} className="pr-1">
                                <BudgetList
                                    data={formik.values.budgets.filter(budget => !budget.removed)}
                                    onRemoveItem={(id, isNewItem) => handleRemoveBudget(formik, id, isNewItem)}
                                    onEditItem={(item) => {
                                        setEdittingItem(item);
                                        setShowBudgetForm(true);
                                    }}
                                />

                                <AddBudget
                                    isShow={showBudgetForm}
                                    hide={() => setShowBudgetForm(false)}
                                    data={editingItem}
                                    onSubmit={(data) => {
                                        if (editingItem) {
                                            handleUpdateBudget(formik, editingItem.id, data);
                                            setEdittingItem(null);
                                        } else {
                                            handleAddBudget(formik, data);
                                        }
                                    }}
                                />
                            </Col>
                            <Col className="pl-0">
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowBudgetForm(true)}>
                                    เพิ่ม
                                </button>
                            </Col>
                        </Row>
                        <Row>
                            <div className="col-3 offset-md-3">
                                <button type="submit" className={`btn ${activity ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-sm`}>
                                    {activity ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </div>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default BudgetActivityForm