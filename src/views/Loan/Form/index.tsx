import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie';
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import { DatePicker } from '@material-ui/pickers';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import moment from 'moment';
import {
    calculateNetTotal,
    currency,
    currencyToNumber,
    setFieldTouched,
    sortObjectByDate
} from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'
import { store, update } from '../../../features/slices/loan/loanSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/loan/loanApi'
import AddCourse from './AddCourse';
import CourseList from './CourseList';
import AddOrder from './AddOrder';
import OrderList from './OrderList';
import Loading from '../../../components/ui/Loading'
import AddBudget from '../../../components/Budget/AddBudget'
import BudgetList from '../../../components/Budget/BudgetList'
import AddExpense from '../../../components/Expense/AddExpense'
import ExpenseList from '../../../components/Expense/ExpenseList'
import EmployeeSelection from '../../../components/FormControls/EmployeeSelection';

const loanSchema = Yup.object().shape({
    doc_no: Yup.string().required('กรุณาระบุเลขที่เอกสาร'),
    doc_date: Yup.string().required('กรุณาเลือกวันที่เอกสาร'),
    loan_type_id: Yup.string().required('กรุณาเลือกประเภทการยืม'),
    money_type_id: Yup.string().required('กรุณาเลือกประเภทเงินยืม'),
    year: Yup.string().required('กรุณาเลือกปีงบประมาณ'),
    department_id: Yup.string().required('กรุณาเลือกหน่วยงาน'),
    employee_id: Yup.string().required('กรุณาเลือกผู้ขอ/เจ้าของโครงการ'),
    project_no: Yup.string().required('กรุณาระบุเลขที่ขออนุมัติโครงการ'),
    project_date: Yup.string().required('กรุณาเลือกวันที่ขออนุมัติโครงการ'),
    project_owner: Yup.string().required('กรุณาระบุหน่วยงานเจ้าของโครงการ'),
    project_name: Yup.string().required('กรุณาระบุชื่อโครงการ'),
    project_sdate: Yup.string().required('กรุณาเลือกวันที่เริ่มโครงการ'),
    project_edate: Yup.string().required('กรุณาเลือกวันที่สิ้นสุดโครงการ'),
    net_total: Yup.mixed().test(
        'Compare net_total and budget_total',
        'จำนวนงบประมาณและจำนวนเงินทั้งสิ้นไม่เท่ากัน',
        (val: any, context: any) => parseFloat(val) === parseFloat(currencyToNumber(context.parent.budget_total) as any),
    ),
    courses: Yup.mixed().test('coursesCount', 'ไม่พบรายการรุ่นโครงการ', (val: any) => val.filter(item => !item.removed).length > 0),
    budgets: Yup.mixed().test('budgetsCount', 'ไม่พบรายการงบประมาณ', (val: any) => val.filter(item => !item.removed).length > 0),
    items: Yup.mixed().test('itemsCount', 'ไม่พบรายการค่าใช้จ่าย/รายการจัดซื้อจัดจ้าง', (val: any) => val.filter(item => !item.removed).length > 0),
});

const LoanForm = ({ loan }: any) => {
    const classes = useStyles()
    const [cookies] = useCookies()
    const dispatch = useDispatch<any>();
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [selectedDocDate, setSelectedDocDate] = useState(moment());
    const [selectedProjectDate, setSelectedProjectDate] = useState(moment());
    const [selectedStartDate, setSelectedStartDate] = useState(moment());
    const [selectedEndDate, setSelectedEndDate] = useState(moment());
    const [selectedYear, setSelectedYear] = useState(moment(`${cookies.budgetYear}-01-01`));
    const [selectedDep, setSelectedDep] = useState('');
    const [edittingItem, setEdittingItem] = useState(null);

    useEffect(() => {
        if (loan) {
            setSelectedDocDate(moment(loan.doc_date));
            setSelectedProjectDate(moment(loan.project_date));
            setSelectedStartDate(moment(loan.project_sdate));
            setSelectedEndDate(moment(loan.project_edate));
            setSelectedYear(moment(`${loan.year}`));
            setSelectedDep(`${loan.department_id}${loan.division_id ? '-' + loan.division_id : ''}`);
        }
    }, [loan]);

    const handleAddItem = (formik, expense) => {
        const newItems = [...formik.values.items, expense];
        formik.setFieldValue('items', newItems);
        setFieldTouched(formik, 'items');

        calcNetTotal(formik, newItems);
    };

    /**
     * 
     * @param formik as Formik
     * @param id as int
     * @param data as data (loan_detail table)
     */
    const handleUpdateItem = (formik, id, data) => {
        const updatedItems = formik.values.items.map(item => {
            if (item.id === id) return { ...data, updated: true };

            return item;
        });

        formik.setFieldValue('items', updatedItems);
        setFieldTouched(formik, 'items');

        calcNetTotal(formik, updatedItems);
        setEdittingItem(null);
    };

    /**
     * 
     * @param formik Formik
     * @param id int
     * @param isNewLoan bool
     */
    const handleRemoveItem = (formik, id, isNewLoan = false) => {
        const newItems = removeItemWithFlag(formik.values.items, id, isNewLoan);
        formik.setFieldValue('items', newItems);
        setFieldTouched(formik, 'items');

        calcNetTotal(formik, newItems);
    };

    const handleAddCourse = (formik, course) => {
        const newCourses = [...formik.values.courses, course];

        formik.setFieldValue('courses', newCourses);
    };

    const handleRemoveCourse = (formik, id, isNewLoan = false) => {
        if (formik.values.items.some(item => parseInt(item.course_id, 10) === id && !item.removed)) {
            toast.error('ไม่สามารถลบรายการได้ เนื่องจากโครงการรุ่นนี้มีรายการค่าใช้จ่ายอยู่!!');
            return;
        }

        let newCourses = [];
        if (isNewLoan) {
            newCourses = formik.values.courses.filter(course => course.id !== id);
        } else {
            newCourses = formik.values.courses.map(course => {
                if (course.id === id) return { ...course, removed: true };

                return course;
            });
        }

        formik.setFieldValue('courses', newCourses);
    };

    const handleAddBudget = (formik, budget) => {
        const newBudgets = [...formik.values.budgets, budget];
        const budgetTotal = calculateNetTotal(newBudgets, (isRemoved) => isRemoved);

        formik.setFieldValue('budgets', newBudgets);
        formik.setFieldValue('budget_total', currency.format(budgetTotal));
        setFieldTouched(formik, 'budgets');
    };

    const handleRemoveBudget = (formik, id, isNewLoan = false) => {
        let newBudgets = [];
        if (isNewLoan) {
            newBudgets = formik.values.budgets.filter(item => item.id !== id);
        } else {
            newBudgets = formik.values.budgets.map(item => {
                if (item.id === id) return { ...item, removed: true };

                return item;
            });
        }

        formik.setFieldValue('budgets', newBudgets);
        formik.setFieldValue('budget_total', currency.format(calculateNetTotal(newBudgets, (isRemoved) => isRemoved)));
        setFieldTouched(formik, 'budgets');
    };

    const removeItemWithFlag = (items, id, isNewLoan) => {
        if (isNewLoan) {
            return items.filter(item => item.id !== id);
        } else {
            /** Create new items array by setting removed flag if item is removed by user */
            return items.map(item => {
                if (item.id === id) return { ...item, removed: true };

                return item;
            });
        }
    };

    const calcNetTotal = (formik, items) => {
        const itemTotal = items.length > 0 ? calculateNetTotal(items.filter(item => item.expense_group === 1), (isRemoved) => isRemoved) : 0;
        const orderTotal = items.length > 0 ? calculateNetTotal(items.filter(item => item.expense_group === 2), (isRemoved) => isRemoved) : 0;
        const netTotal = orderTotal + itemTotal;

        formik.setFieldValue('item_total', itemTotal);
        formik.setFieldValue('order_total', orderTotal);
        formik.setFieldValue('net_total', netTotal);
    };

    const handleSubmit = (values, formik) => {
        if (loan) {
            dispatch(update({ id: loan.id, data: values }));
        } else {
            dispatch(store(values));
        }

        formik.resetForm();

        /** Clear value of local states */
        setSelectedDocDate(moment());
        setSelectedProjectDate(moment());
        setSelectedStartDate(moment());
        setSelectedEndDate(moment());
        setSelectedYear(moment());
    };

    return (
        <Formik
            initialValues={{
                doc_no: loan ? loan.doc_no : '',
                doc_date: loan ? moment(loan.doc_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                loan_type_id: loan ? loan.loan_type_id : '',
                money_type_id: loan ? loan.money_type_id : '',
                year: loan ? moment(`${loan.year}`).year() : cookies.budgetYear,
                department_id: loan ? loan.department_id : '',
                division_id: (loan && loan.division_id) ? loan.division_id : '',
                employee_id: loan ? loan.employee_id : '',
                project_no: loan ? loan.project_no : '',
                project_date: loan ? moment(loan.project_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                project_owner: (loan && loan.project_owner) ? loan.project_owner : '',
                project_name: loan ? loan.project_name : '',
                project_sdate: loan ? moment(loan.project_sdate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                project_edate: loan ? moment(loan.project_edate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                expense_calc: loan ? loan.expense_calc : 1,
                budget_total: loan ? loan.budget_total : 0,
                item_total: loan ? loan.item_total : 0,
                order_total: loan ? loan.order_total : 0,
                net_total: loan ? loan.net_total : 0,
                remark: (loan && loan.remark) ? loan.remark : '',
                courses: loan ? [...loan.courses].sort((a, b) => sortObjectByDate(a.course_date, b.course_date)) : [], //รุ่นที่
                budgets: loan ? loan.budgets : [],
                items: loan ? loan.details : [],
            }}
            validationSchema={loanSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <Row className="mb-2">
                            <Col md={2}>
                                <label htmlFor="">เลขที่เอกสาร</label>
                                <input
                                    type="text"
                                    name="doc_no"
                                    value={formik.values.doc_no}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm ${(formik.errors.doc_no && formik.touched.doc_no) && 'border-red-500'}`}
                                />
                                {(formik.errors.doc_no && formik.touched.doc_no) && (
                                    <span className="text-red-500 text-xs">{formik.errors.doc_no as string}</span>
                                )}
                            </Col>
                            <Col md={2}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่เอกสาร</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={selectedDocDate}
                                        className={classes.muiTextFieldInput}
                                        onChange={(date) => {
                                            setSelectedDocDate(date);
                                            formik.setFieldValue('doc_date', date.format('YYYY-MM-DD'));
                                        }}
                                    />
                                </div>
                                {(formik.errors.doc_date && formik.touched.doc_date) && (
                                    <span className="text-red-500 text-xs">{formik.errors.doc_date as string}</span>
                                )}
                            </Col>
                            <Col md={4}>
                                <label>ประเภทการยืม</label>
                                {isLoading && <div className="form-control text-sm text-center"><Loading /></div>}
                                {!isLoading && <select
                                    name="loan_type_id"
                                    value={formik.values.loan_type_id}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm ${(formik.errors.loan_type_id && formik.touched.loan_type_id) && 'border-red-500'}`}
                                >
                                    <option value="">-- ประเภทการยืม --</option>
                                    {formData && formData.loanTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>}
                                {(formik.errors.loan_type_id && formik.touched.loan_type_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.loan_type_id as string}</span>
                                )}
                            </Col>
                            <Col md={4}>
                                <label htmlFor="">ประเภทเงินยืม</label>
                                <select
                                    name="money_type_id"
                                    value={formik.values.money_type_id}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm ${(formik.errors.money_type_id && formik.touched.money_type_id) && 'border-red-500'}`}
                                >
                                    <option value="">-- ประเภทเงินยืม --</option>
                                    <option value="1">เงินทดลองราชการ</option>
                                    <option value="2">เงินยืมนอกงบประมาณ</option>
                                    <option value="3">เงินยืมราชการ	</option>
                                </select>
                                {(formik.errors.money_type_id && formik.touched.money_type_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.money_type_id as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}>
                                <label htmlFor="">หน่วยงาน</label>
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

                                        setSelectedDep(val);
                                        setTimeout(() => formik.setFieldTouched('department_id', true), 300);
                                    }}
                                    className={`form-control text-sm ${(formik.errors.department_id && formik.touched.department_id) && 'border-red-500'}`}
                                >
                                    <option value="">-- หน่วยงาน --</option>
                                    {formData?.departments && formData.departments.filter(dep => dep.id !== 1).map(dep => (
                                        <Fragment key={dep.id}>
                                            <option value={dep.id} className="font-bold">
                                                {dep.name}
                                            </option>
                                            {dep.divisions.length > 0 && dep.divisions.filter(division => division.has_saraban === 1).map(division => (
                                                <option value={`${dep.id}-${division.id}`} key={`${dep.id}-${division.id}`}>
                                                    {division.name}
                                                </option>
                                            ))}
                                        </Fragment>
                                    ))}
                                </select>
                                {(formik.errors.department_id && formik.touched.department_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.department_id as string}</span>
                                )}
                            </Col>
                            <Col md={6}>
                                <label htmlFor="">ผู้ขอ/เจ้าของโครงการ</label>
                                <EmployeeSelection
                                    data={loan?.employee}
                                    fieldName="employee_id"
                                />
                                {(formik.errors.employee_id && formik.touched.employee_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.employee_id as string}</span>
                                )}
                            </Col>
                            <Col md={2}>
                                <div className="flex flex-col">
                                    <label htmlFor="">ปีงบ</label>
                                    <DatePicker
                                        format="YYYY"
                                        views={['year']}
                                        value={selectedYear}
                                        className={classes.muiTextFieldInput}
                                        onChange={(date) => {
                                            setSelectedYear(date);
                                            formik.setFieldValue('year', date.year());
                                        }}
                                    />
                                </div>
                                {(formik.errors.year && formik.touched.year) && (
                                    <span className="text-red-500 text-xs">{formik.errors.year as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={12}>
                                <div className="flex flex-col border p-2 rounded-md">
                                    <h1 className="font-bold text-lg mb-1">รายละเอียดโครงการ</h1>
                                    <Row className="mb-2">
                                        <Col md={3}>
                                            <label htmlFor="">เลขที่ขออนุมัติ</label>
                                            <input
                                                type="text"
                                                name="project_no"
                                                value={formik.values.project_no}
                                                onChange={formik.handleChange}
                                                className={`form-control text-sm ${(formik.errors.project_no && formik.touched.project_no) && 'border-red-500'}`}
                                            />
                                            {(formik.errors.project_no && formik.touched.project_no) && (
                                                <span className="text-red-500 text-xs">{formik.errors.project_no as string}</span>
                                            )}
                                        </Col>
                                        <Col md={3}>
                                            <div className="flex flex-col">
                                                <label htmlFor="">วันที่ขออนุมัติ</label>
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    value={selectedProjectDate}
                                                    className={classes.muiTextFieldInput}
                                                    onChange={(date) => {
                                                        setSelectedProjectDate(date);
                                                        formik.setFieldValue('project_date', date.format('YYYY-MM-DD'));
                                                    }}
                                                />
                                            </div>
                                            {(formik.errors.project_date && formik.touched.project_date) && (
                                                <span className="text-red-500 text-sm">{formik.errors.project_date as string}</span>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                            <label htmlFor="">หน่วยงานเจ้าของโครงการ</label>
                                            <input
                                                type="text"
                                                name="project_owner"
                                                value={formik.values.project_owner}
                                                onChange={formik.handleChange}
                                                className={`form-control text-sm ${(formik.errors.project_owner && formik.touched.project_owner) && 'border-red-500'}`}
                                            />
                                            {(formik.errors.project_owner && formik.touched.project_owner) && (
                                                <span className="text-red-500 text-xs">{formik.errors.project_owner as string}</span>
                                            )}
                                        </Col>
                                        <Col md={12}>
                                            <label htmlFor="">ชื่อโครงการ</label>
                                            <input
                                                type="text"
                                                name="project_name"
                                                value={formik.values.project_name}
                                                onChange={formik.handleChange}
                                                className={`form-control text-sm ${(formik.errors.project_name && formik.touched.project_name) && 'border-red-500'}`}
                                            />
                                            {(formik.errors.project_name && formik.touched.project_name) && (
                                                <span className="text-red-500 text-xs">{formik.errors.project_name as string}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={3}>
                                            <div className="flex flex-col">
                                                <label htmlFor="">วันที่เริ่ม</label>
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    value={selectedStartDate}
                                                    className={classes.muiTextFieldInput}
                                                    onChange={(date) => {
                                                        setSelectedStartDate(date);
                                                        formik.setFieldValue('project_sdate', date.format('YYYY-MM-DD'));

                                                        /** เซตค่าเริ่มของวันที่สิ้นสุดโครงการ */
                                                        setSelectedEndDate(date);
                                                        formik.setFieldValue('project_edate', date.format('YYYY-MM-DD'));
                                                    }}
                                                />
                                            </div>
                                            {(formik.errors.project_sdate && formik.touched.project_sdate) && (
                                                <span className="text-red-500 text-xs">{formik.errors.project_sdate as string}</span>
                                            )}
                                        </Col>
                                        <Col md={3}>
                                            <div className="flex flex-col">
                                                <label htmlFor="">วันที่สิ้นสุด</label>
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    value={selectedEndDate}
                                                    className={classes.muiTextFieldInput}
                                                    onChange={(date) => {
                                                        setSelectedEndDate(date);
                                                        formik.setFieldValue('project_edate', date.format('YYYY-MM-DD'));
                                                    }}
                                                />
                                            </div>
                                            {(formik.errors.project_edate && formik.touched.project_edate) && (
                                                <span className="text-red-500 text-xs">{formik.errors.project_edate as string}</span>
                                            )}
                                        </Col>
                                        <Col>
                                            <label>การคิดค่าใช้จ่าย</label>
                                            <label className="form-control text-sm font-thin">
                                                <Field
                                                    type="radio"
                                                    name="expense_calc"
                                                    value="1"
                                                    checked={parseInt(formik.values.expense_calc, 10) === 1}
                                                    onChange={() => formik.setFieldValue("expense_calc", "1")}
                                                />
                                                <span className="ml-1 mr-8">คิดค่าใช้จ่ายรวม</span>

                                                <Field
                                                    type="radio"
                                                    name="expense_calc"
                                                    value="2"
                                                    checked={parseInt(formik.values.expense_calc, 10) === 2}
                                                    onChange={() => formik.setFieldValue("expense_calc", "2")}
                                                />
                                                <span className="ml-1">คิดค่าใช้จ่ายแยกวันที่</span>
                                            </label>
                                            {(formik.errors.expense_calc && formik.touched.expense_calc) && (
                                                <span className="text-red-500 text-sm">{formik.errors.expense_calc as string}</span>
                                            )}
                                        </Col>
                                    </Row>

                                    <div className="mt-2">
                                        <h3 className="font-bold text-base mb-1">กำหนดรุ่นโครงการ</h3>

                                        <AddCourse
                                            courses={formik.values.courses}
                                            defaultCourseDate={formik.values.project_sdate}
                                            expenseCalc={parseInt(formik.values.expense_calc, 10)}
                                            onAdd={(course) => handleAddCourse(formik, course)}
                                        />

                                        <CourseList
                                            courses={formik.values.courses.filter(course => !course.removed)}
                                            onRemoveCourse={(id, isNewLoan) => handleRemoveCourse(formik, id, isNewLoan)}
                                        />
                                    </div>
                                    {(formik.errors.courses && formik.touched.courses) && (
                                        <span className="text-red-500 text-xs">{formik.errors.courses as string}</span>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div
                                    className={
                                        `flex flex-col p-2 rounded-md mt-2 
                                        ${(formik.errors.budgets && formik.touched.budgets) || (formik.errors.net_total && formik.touched.net_total)
                                            ? 'border-[1px] border-red-500'
                                            : 'border'
                                        }`
                                    }
                                >
                                    <h1 className="font-bold text-lg mb-1">งบประมาณ</h1>
                                    <AddBudget
                                        formData={formData?.budgets}
                                        onAddBudget={(budget) => handleAddBudget(formik, budget)}
                                    />

                                    <BudgetList
                                        budgets={formik.values.budgets.filter(budget => !budget.removed)}
                                        newFlagField="loan_id"
                                        onRemoveBudget={(id, isNewLoan) => handleRemoveBudget(formik, id, isNewLoan)}
                                    />

                                    <div className="flex flex-row justify-end items-center">
                                        <div className="mr-2">งบประมาณทั้งสิ้น</div>
                                        <div className="w-[15%]">
                                            <input
                                                type="text"
                                                name="budget_total"
                                                value={formik.values.budget_total}
                                                onChange={formik.handleChange}
                                                placeholder="งบประมาณทั้งสิ้น"
                                                className="form-control text-sm float-right text-right"
                                            />
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                </div>
                                {(formik.errors.budgets && formik.touched.budgets) && (
                                    <span className="text-red-500 text-xs">{formik.errors.budgets as string}</span>
                                )}
                                {(formik.errors.net_total && formik.touched.net_total) && (
                                    <span className="text-red-500 text-xs">{formik.errors.net_total as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-col">
                                    <Tabs
                                        id=""
                                        defaultActiveKey="expenses"
                                        className={`mt-2 ${(formik.errors.items && formik.touched.items) && 'border-red-500'}`}
                                    >
                                        <Tab eventKey="expenses" title="รายการค่าใช้จ่าย">
                                            <div
                                                className={
                                                    `border-x-[1px] border-b-[1px] rounded-bl-md rounded-br-md py-3 px-2
                                                    ${(formik.errors.items && formik.touched.items)
                                                        ? 'border-x-red-500 border-b-red-500'
                                                        : 'border-x-[#ddd] border-b-[#ddd]'
                                                    }`
                                                }
                                            >
                                                <AddExpense
                                                    data={edittingItem}
                                                    formData={formData?.expenses.filter(exp => exp.group_id === 1)}
                                                    courses={formik.values.courses.filter(course => !course.removed)}
                                                    onAddItem={(expense) => handleAddItem(formik, expense)}
                                                    onUpdateItem={(id, expense) => handleUpdateItem(formik, id, expense)}
                                                    onClear={setEdittingItem}
                                                />

                                                <ExpenseList
                                                    items={formik.values.items.filter(item => item.expense_group === 1)}
                                                    courses={formik.values.courses.filter(course => !course.removed)}
                                                    edittingItem={edittingItem}
                                                    onEditItem={(data) => setEdittingItem(data)}
                                                    onRemoveItem={(id, isNewLoan) => handleRemoveItem(formik, id, isNewLoan)}
                                                />

                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[75%] text-right">รวมค่าใช้จ่ายทั้งสิ้น</div>
                                                    <div className="form-control min-h-[34px] w-[15%] text-right text-sm">
                                                        {currency.format(formik.values.item_total)}
                                                    </div>
                                                    <div className="w-[10%]"></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="orders" title="รายการจัดซื้อจัดจ้าง">
                                            <div
                                                className={
                                                    `border-x-[1px] border-b-[1px] rounded-bl-md rounded-br-md py-3 px-2
                                                    ${(formik.errors.items && formik.touched.items)
                                                        ? 'border-x-red-500 border-b-red-500'
                                                        : 'border-x-[#ddd] border-b-[#ddd]'
                                                    }`
                                                }
                                            >
                                                <AddOrder
                                                    data={''}
                                                    formData={formData?.expenses.filter(exp => exp.group_id === 2)}
                                                    onAdd={(order) => {
                                                        const newOrders = [...formik.values.items, order];
                                                        formik.setFieldValue('items', newOrders);

                                                        calcNetTotal(formik, newOrders);
                                                    }}
                                                    onUpdate={(order) => console.log(order)}
                                                />

                                                <OrderList i
                                                    orders={formik.values.items.filter(item => item.expense_group === 2 && !item.removed)}
                                                    onRemove={(id, isNewLoan = false) => {
                                                        const updatedOrders = removeItemWithFlag(formik.values.items, id, isNewLoan);
                                                        formik.setFieldValue('items', updatedOrders);

                                                        calcNetTotal(formik, updatedOrders);
                                                    }}
                                                />

                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[75%] text-right">รวมจัดซื้อจัดจ้างทั้งสิ้น</div>
                                                    <div className="form-control min-h-[34px] w-[15%] text-right text-sm">
                                                        {currency.format(formik.values.order_total)}
                                                    </div>
                                                    <div className="w-[10%]"></div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                    {(formik.errors.items && formik.touched.items) && (
                                        <span className="text-red-500 text-xs">{formik.errors.items as string}</span>
                                    )}

                                    <div className="flex flex-row justify-start items-center mt-2 px-[10px]">
                                        <div className="w-[75%] text-right text-lg mr-2">
                                            <span className="text-lg font-bold">รวมเป็นเงินทั้งสิ้น</span>
                                            <span className="ml-1">(ค่าใช้จ่าย {currency.format(formik.values.item_total)} บาท + จัดซื้อจัดจ้าง {currency.format(formik.values.order_total)} บาท) =</span>
                                        </div>
                                        <div className="w-[15%]">
                                            <div className="form-control text-lg float-right text-right text-green-800 font-bold">
                                                {currency.format(formik.values.net_total)}
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <label htmlFor="">หมายเหตุ</label>
                                <textarea
                                    rows={3}
                                    name="remark"
                                    value={formik.values.remark}
                                    onChange={formik.handleChange}
                                    className="form-control"
                                ></textarea>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button type="submit" className={`btn ${loan ? 'btn-outline-warning' : 'btn-outline-primary'} float-right`}>
                                    {loan ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default LoanForm