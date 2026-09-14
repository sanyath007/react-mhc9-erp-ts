import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Col, Row } from 'react-bootstrap'
import DatePicker from '../../../components/ui/Forms/DatePicker'
import YearPicker from '../../../components/ui/Forms/YearPicker'
import SearchableSelect from '../../../components/ui/Forms/SearchableSelect'
import { toast } from 'react-toastify'
import moment from 'moment'
import {
    calculateNetTotal,
    currency,
    getFormDataItem,
    isExisted,
    removeItemWithFlag,
    setFieldTouched
} from '../../../utils'
import { useGetInitialFormDataQuery } from '../../../features/services/requisition/requisitionApi'
import { store, update } from '../../../features/slices/requisition/requisitionSlice'
import { useStyles } from '../../../hooks/useStyles'
import AddItem from './AddItem'
import ItemList from './ItemList'
import Committee from './Committee'
import Deputy from './Deputy'
import Loading from '../../../components/ui/Loading'
import ModalEmployeeList from '../../../components/Modals/EmployeeList'
import ModalBudgetList from '../../../components/Modals/BudgetList'
import EmployeeSelection from '../../../components/FormControls/EmployeeSelection'
import AddBudget from '../../../components/Budget/AddBudget'
import BudgetList from '../../../components/Budget/BudgetList'

const requisitionSchema = Yup.object().shape({
    pr_no: Yup.string().required('กรุณาระบุเลขที่เอกสาร'),
    pr_date: Yup.string().required('กรุณาระบุวันที่เอกสาร'),
    order_type_id: Yup.string().required('กรุณาระบุประเภทการจัดซื้อ'),
    requisition_type_id: Yup.string().required('กรุณาระบุประเภทคำขอ'),
    category_id: Yup.string().required('กรุณาระบุประเภทสินค้า'),
    contract_desc: Yup.string().ensure().when('order_type_id', {
        is: (val) => val === '2',
        then: () => Yup.string().required('กรุณาระบุรายละเอียดการจ้าง'),
    }),
    topic: Yup.string().required('กรุณาระบุเรื่อง'),
    year: Yup.string().required('กรุณาระบุปีงบ'),
    // budget_id: Yup.string().required('กรุณาระบุงบประมาณ'),
    requester_id: Yup.string().required('กรุณาระบุผู้ขอ/เจ้าของโครงการ'),
    department_id: Yup.string().required('กรุณาระบุหน่วยงาน'),
    reason: Yup.string().required('กรุณาระบุเหตุผลที่ขอ'),
    desired_date: Yup.string().when('requisition_type_id', {
        is: (val) => val === '1', // adjust condition as needed
        then: () => Yup.string().required('กรุณาระบุวันที่ต้องการใช้'),
    }),
    budgets: Yup.mixed().test('Budget count', 'ไม่พบการระบุรายการงบประมาณ', (val: any) => val.filter(budget => !budget.removed).length > 0),
    items: Yup.mixed().test('Items count', 'ไม่พบการระบุรายการสินค้า', (val: any) => val.filter(item => !item.removed).length > 0),
    committees: Yup.mixed().test('Committees count', 'ไม่พบการระบุผู้ตรวจรับ', (val: any) => val.filter(comm => !comm.removed).length > 0),
});

const initialFormData = {
    categories: [],
    departments: [],
    divisions: [],
    projects: [],
};

const RequisitionForm = ({ requisition }: any) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const dispatch = useDispatch<any>();
    const { loggedInUser } = useSelector((state: any) => state.auth);
    const [budget, setBudget] = useState(null);
    const [requester, setRequester] = useState(null);
    const [itemToedit, setItemToEdit] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedYear, setSelectedYear] = useState(moment(`${cookies.budgetYear}-01-01`));
    const [selectedDesiredDate, setSelectedDesiredDate] = useState(moment());
    const [selectedDep, setSelectedDep] = useState('');
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    useEffect(() => {
        /** Initial filteredType state with order_type_id is 1 */
        handleTypeChange(1);
    }, []);

    useEffect(() => {
        if (loggedInUser) setRequester(loggedInUser.employee);
    }, [loggedInUser]);

    /** On editting mode set default value to requester, budget, selectedDate and selectedYear local states */
    useEffect(() => {
        if (requisition) {
            setBudget(requisition.budget);
            setRequester(requisition.requester);
            setSelectedDate(requisition.pr_date);
            setSelectedYear(moment(`${requisition.year}-09-01`));
            setSelectedDep(`${requisition.department_id}${requisition.division_id ? '-' + requisition.division_id : ''}`);

            handleTypeChange(requisition.order_type_id || 1);
        }
    }, [requisition]);

    const handleAddItem = (formik, item) => {
        if (isExisted(formik.values.items.filter(item => !item.removed), 'item_id', item.item_id)) {
            toast.error("ไม่สามารถเลือกรายการซ้ำได้!!");
            return;
        }

        const newItems = [...formik.values.items, item];
        formik.setFieldValue('items', newItems);
        setFieldTouched(formik, 'items');

        /** Calculate net total */
        calcNetTotal(formik, newItems);
    };

    const handleEditItem = (data) => {
        setItemToEdit(data);
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

        /** Calculate net total */
        calcNetTotal(formik, updatedItems);

        /** Clear item to edit */
        setItemToEdit(null);
    };

    /**
     * 
     * @param formik Formik
     * @param id int
     * @param isNewItem bool
     */
    const handleRemoveItem = (formik, id, isNewItem = false) => {
        const newItems = removeItemWithFlag(formik.values.items, id, isNewItem);
        formik.setFieldValue('items', newItems);
        setFieldTouched(formik, 'items');

        /** Calculate net total */
        calcNetTotal(formik, newItems);
    };

    const calcNetTotal = (formik, items) => {
        const itemTotal = calculateNetTotal(items, (isRemoved) => isRemoved);

        formik.setFieldValue('item_count', items.filter(item => !item.removed).length);
        formik.setFieldValue('net_total', currency.format(itemTotal));
    };

    const handleUpdateCommittees = (formik, committees) => {
        formik.setFieldValue('committees', committees);
    };

    const handleTypeChange = (typeId) => {
        (formData && formData.types) && setFilteredTypes(formData.types.filter(type => type.order_type_id === parseInt(typeId)));
    };

    const handleUpdateDesc = (formik, id, desc) => {
        const updatedItems = formik.values.items.map(item => {
            if (item.id === id) return { ...item, description: desc };
            return item;
        });
        formik.setFieldValue('items', updatedItems);
    };

    const handleSubmit = (values, formik) => {
        if (requisition) {
            dispatch(update({ id: requisition.id, data: values }));
        } else {
            dispatch(store(values));
        }

        formik.resetForm();

        /** Clear value of local states */
        setBudget(null);
        setRequester(null);
        setSelectedDate(moment());
        setSelectedYear(moment(`${cookies.budgetYear}-01-01`));
    };

    return (
        <Formik
            initialValues={{
                pr_no: requisition ? requisition.pr_no : '',
                pr_date: requisition ? moment(requisition.pr_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                order_type_id: requisition ? requisition.order_type_id : 1,
                requisition_type_id: requisition ? requisition.requisition_type_id : 1,
                category_id: requisition ? requisition.category_id : '',
                contract_desc: (requisition && requisition.contract_desc) ? requisition.contract_desc : '',
                topic: requisition ? requisition.topic : 'ขออนุมัติงบประมาณซื้อ',
                year: requisition ? requisition.year : cookies.budgetYear,
                budget_id: requisition ? requisition.budget_id : '',
                project_id: (requisition && requisition.project_id) ? requisition.project_id : '',
                project_name: (requisition && requisition.project_name) ? requisition.project_name : '',
                department_id: (requisition && requisition.department_id) ? requisition.department_id : '',
                division_id: (requisition && requisition.division_id) ? requisition.division_id : '',
                requester_id: requisition ? requisition.requester_id : requester?.id,
                reason: requisition ? requisition.reason : '',
                desired_date: requisition ? requisition.desired_date : '',
                item_count: requisition ? requisition.item_count : 0,
                net_total: requisition ? requisition.net_total : '',
                budget_total: requisition ? requisition.budget_total : '',
                deputy_id: (requisition && requisition.deputy_id) ? requisition.deputy_id : '',
                deputy: (requisition && requisition.deputy) ? requisition.deputy : '',
                items: requisition ? requisition.details : [],
                budgets: requisition ? requisition.budgets : [],
                committees: requisition ? requisition.committees : []
            }}
            validationSchema={requisitionSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        {isLoading && <div className="text-center"><Loading /></div>}
                        {!isLoading && (
                            <>
                                <ModalEmployeeList
                                    isShow={showEmployeeModal}
                                    onHide={() => setShowEmployeeModal(false)}
                                    onSelect={(employee) => {
                                        setRequester(employee);
                                        formik.setFieldValue('requester_id', employee.id);

                                        /** Set default division_id of employee is member */
                                        if (employee.member_of.length > 0) {
                                            formik.setFieldValue('division_id', employee.member_of[0]?.division_id);
                                        }
                                    }}
                                />

                                <ModalBudgetList
                                    isShow={showBudgetModal}
                                    onHide={() => setShowBudgetModal(false)}
                                    onSelect={(budget) => {
                                        setBudget(budget);
                                        formik.setFieldValue('budget_id', budget.id);
                                    }}
                                />

                                <Row className="mb-2">
                                    <Col md={4}>
                                        <label htmlFor="">เลขที่เอกสาร <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="pr_no"
                                            value={formik.values.pr_no}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        />
                                        {(formik.errors.pr_no && formik.touched.pr_no) && (
                                            <span className="text-red-500 text-sm">{formik.errors.pr_no as string}</span>
                                        )}
                                    </Col>
                                    <Col md={2}>
                                        <div className="flex flex-col">
                                            <label htmlFor="">วันที่เอกสาร <span className="text-red-500">*</span></label>
                                            <DatePicker
                                                value={formik.values.pr_date}
                                                onChange={(date: any) => {
                                                    formik.setFieldValue('pr_date', date);
                                                }}
                                                inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                            />
                                        </div>
                                        {(formik.errors.pr_date && formik.touched.pr_date) && (
                                            <span className="text-red-500 text-sm">{formik.errors.pr_date as string}</span>
                                        )}
                                    </Col>
                                    <Col md={2}>
                                        <label>ประเภทซื้อ/จ้าง <span className="text-red-500">*</span></label>
                                        <select
                                            name="order_type_id"
                                            value={formik.values.order_type_id}
                                            onChange={(e) => {
                                                const { value } = e.target;

                                                formik.handleChange(e);
                                                formik.setFieldValue('topic', value === '1' ? 'ขออนุมัติงบประมาณซื้อ' : 'ขออนุมัติงบประมาณจ้าง');
                                                handleTypeChange(value);
                                            }}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- ประเภท --</option>
                                            <option value="1">ซื้อ</option>
                                            <option value="2">จ้าง</option>
                                        </select>
                                        {(formik.errors.order_type_id && formik.touched.order_type_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.order_type_id as string}</span>
                                        )}
                                    </Col>
                                    <Col md={4}>
                                        <label htmlFor="">ประเภทสินค้า <span className="text-red-500">*</span></label>
                                        <SearchableSelect
                                            value={formik.values.category_id?.toString()}
                                            onChange={(val: string) => {
                                                formik.setFieldValue('category_id', val);

                                                if (parseInt(formik.values.order_type_id, 10) === 1) {
                                                    formik.setFieldValue('topic', 'ขออนุมัติงบประมาณซื้อ' + getFormDataItem(formData, "categories", parseInt(val))?.name);
                                                }
                                            }}
                                            options={filteredTypes.flatMap((type: any) =>
                                                type.categories.map((category: any) => ({
                                                    value: category.id.toString(),
                                                    label: category.name,
                                                    description: type.name
                                                }))
                                            )}
                                            placeholder="-- ประเภทสินค้า --"
                                            inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                        />
                                        {(formik.errors.category_id && formik.touched.category_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.category_id as string}</span>
                                        )}
                                    </Col>
                                </Row>

                                {parseInt(formik.values.order_type_id, 10) === 2 && (
                                    <Row className="mb-2">
                                        <Col>
                                            <label htmlFor="">รายละเอียดการจ้าง <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="contract_desc"
                                                value={formik.values.contract_desc}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    formik.setFieldValue('topic', 'ขออนุมัติงบประมาณ' + e.target.value);
                                                }}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.contract_desc && formik.touched.contract_desc) && (
                                                <span className="text-red-500 text-sm">{formik.errors.contract_desc as string}</span>
                                            )}
                                        </Col>
                                    </Row>
                                )}

                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">เรื่อง <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="topic"
                                            value={formik.values.topic}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        />
                                        {(formik.errors.topic && formik.touched.topic) && (
                                            <span className="text-red-500 text-sm">{formik.errors.topic as string}</span>
                                        )}
                                    </Col>
                                    <Col md={2}>
                                        <label htmlFor="">ประเภทคำขอ <span className="text-red-500">*</span></label>
                                        <select
                                            name="requisition_type_id"
                                            value={formik.values.requisition_type_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- ประเภทคำขอ --</option>
                                            <option value="1">ปกติ</option>
                                            <option value="2">จัดซื้อซ้ำได้</option>
                                        </select>
                                        {(formik.errors.requisition_type_id && formik.touched.requisition_type_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.requisition_type_id as string}</span>
                                        )}
                                    </Col>
                                    <Col md={2}>
                                        <label htmlFor="">ปีงบประมาณ <span className="text-red-500">*</span></label>
                                        <YearPicker
                                            value={formik.values.year}
                                            onChange={(year: string) => {
                                                formik.setFieldValue('year', year);
                                            }}
                                            inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                        />
                                        {(formik.errors.year && formik.touched.year) && (
                                            <span className="text-red-500 text-sm">{formik.errors.year as string}</span>
                                        )}
                                    </Col>
                                </Row>

                                <Row className="mb-2">
                                    <Col md={6}>
                                        <label htmlFor="">ผู้ขอ/เจ้าของโครงการ <span className="text-red-500">*</span></label>
                                        <EmployeeSelection
                                            data={requisition?.requester}
                                            fieldName="requester_id"
                                        />
                                        {(formik.errors.requester_id && formik.touched.requester_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.requester_id as string}</span>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <label htmlFor="">หน่วยงาน <span className="text-red-500">*</span></label>
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
                                            className="form-control text-sm"
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
                                            <span className="text-red-500 text-sm">{formik.errors.department_id as string}</span>
                                        )}
                                    </Col>
                                </Row>

                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">โครงการ (ถ้ามี)</label>
                                        <textarea
                                            rows={5}
                                            name="project_name"
                                            value={formik.values.project_name}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        ></textarea>
                                        {/* <select
                                            name="project_id"
                                            value={formik.values.project_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- โครงการ --</option>
                                            {formData.projects && formData.projects.map(project => (
                                                <option value={project.id} key={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select> */}
                                        {(formik.errors.project_id && formik.touched.project_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.project_id as string}</span>
                                        )}
                                    </Col>
                                    <Col>
                                        <label htmlFor="">เหตุผลที่ขอ <span className="text-red-500">*</span></label>
                                        <textarea
                                            rows={5}
                                            name="reason"
                                            value={formik.values.reason}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        ></textarea>
                                        {(formik.errors.reason && formik.touched.reason) && (
                                            <span className="text-red-500 text-sm">{formik.errors.reason as string}</span>
                                        )}
                                    </Col>
                                </Row>

                                <Row className="mb-2">
                                    <Col>
                                        <div className="flex flex-col border p-2 rounded-md mt-1">
                                            <h1 className="font-bold text-lg mb-1">งบประมาณ <span className="text-red-500">*</span></h1>

                                            <AddBudget
                                                onAddBudget={(budget) => {
                                                    if (formik.values.budgets.filter(bg => !bg.removed).some(chk => chk.budget_id === budget.budget_id)) {
                                                        toast.error('คุณเลือกรายการซ้ำ!!');
                                                        return;
                                                    }

                                                    const newBudgets = [...formik.values.budgets, budget];
                                                    const budgetTotal = calculateNetTotal(newBudgets, (isRemoved) => isRemoved);

                                                    formik.setFieldValue('budgets', newBudgets);
                                                    formik.setFieldValue('budget_total', currency.format(budgetTotal));
                                                }}
                                            />
                                            <BudgetList
                                                budgets={formik.values.budgets}
                                                newFlagField="requisition_id"
                                                onRemoveBudget={(id, isNewRequisition) => {
                                                    let newBudgets = [];
                                                    if (isNewRequisition) {
                                                        newBudgets = formik.values.budgets.filter(item => item.id !== id);
                                                    } else {
                                                        newBudgets = formik.values.budgets.map(item => {
                                                            if (item.id === id) return { ...item, removed: true };

                                                            return item;
                                                        });
                                                    }

                                                    formik.setFieldValue('budgets', newBudgets);
                                                    formik.setFieldValue('budget_total', currency.format(calculateNetTotal(newBudgets, (isRemoved) => isRemoved)));
                                                }}
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
                                                    {(formik.errors.budget_total && formik.touched.budget_total) && (
                                                        <span className="text-red-500 text-sm">{formik.errors.budget_total as string}</span>
                                                    )}
                                                </div>
                                                <div className="w-[10%]"></div>
                                            </div>
                                        </div>
                                        {(formik.errors.budgets && formik.touched.budgets) && (
                                            <span className="text-red-500 text-sm">{formik.errors.budgets as string}</span>
                                        )}
                                    </Col>
                                </Row>

                                <Row className="mb-2">
                                    <Col>
                                        <div className="flex flex-col border p-2 rounded-md">
                                            <h1 className="font-bold text-lg mb-1">รายการสินค้า/บริการ <span className="text-red-500">*</span></h1>
                                            <AddItem
                                                item={itemToedit}
                                                defaultCategory={formik.values.category_id}
                                                onAddItem={(item) => handleAddItem(formik, item)}
                                                onUpdateItem={(id, item) => handleUpdateItem(formik, id, item)}
                                                onCancel={() => setItemToEdit(null)}
                                            />

                                            <ItemList
                                                items={formik.values.items.filter(item => !item.removed)}
                                                onEditItem={(data) => handleEditItem(data)}
                                                onRemoveItem={(id, isNewItem = false) => handleRemoveItem(formik, id, isNewItem)}
                                                onUpdateDesc={(id, desc) => handleUpdateDesc(formik, id, desc)}
                                            />
                                            {(formik.errors.items && formik.touched.items) && (
                                                <span className="text-red-500 text-sm">{formik.errors.items as string}</span>
                                            )}

                                            <Row>
                                                <Col md={4}>
                                                    <div className={`flex flex-row justify-start ${formik.errors.desired_date ? 'items-start' : 'items-center'} gap-1 ml-4`}>
                                                        <label className={`col-4 text-right pr-1 ${formik.errors.desired_date && 'mt-1'}`}>
                                                            วันที่ต้องการใช้ <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="col-8 w-[50%] pl-1">
                                                            <DatePicker
                                                                value={formik.values.desired_date}
                                                                onChange={(date: any) => {
                                                                    formik.setFieldValue('desired_date', date);
                                                                }}
                                                                inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm"
                                                            />
                                                            {(formik.errors.desired_date && formik.touched.desired_date) && (
                                                                <span className="text-red-500 text-sm">{formik.errors.desired_date as string}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="flex flex-row justify-end items-center gap-1">
                                                        <div className="text-right pr-1">รวมเป็นเงินทั้งสิ้น</div>
                                                        <div className="w-[22%]">
                                                            <input
                                                                type="text"
                                                                name="net_total"
                                                                value={formik.values.net_total}
                                                                onChange={formik.handleChange}
                                                                placeholder="รวมเป็นเงินทั้งสิ้น"
                                                                className="form-control text-sm float-right text-right"
                                                            />
                                                            {(formik.errors.net_total && formik.touched.net_total) && (
                                                                <span className="text-red-500 text-sm">{formik.errors.net_total as string}</span>
                                                            )}
                                                        </div>
                                                        <div className="w-[15%] pl-1">บาท</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mb-2">
                                    <Col md={12} lg={8} className="lg:pr-1">
                                        <Committee
                                            defaultValue={formik.values.committees}
                                            onUpdate={(committees) => handleUpdateCommittees(formik, committees)}
                                        />
                                        {(formik.errors.committees && formik.touched.committees) && (
                                            <span className="text-red-500 text-sm">{formik.errors.committees as string}</span>
                                        )}
                                    </Col>
                                    <Col className="max-[990px]:mt-2 lg:pl-1">
                                        <Deputy
                                            defaultValue={formik.values.deputy}
                                            onUpdate={(employee) => formik.setFieldValue('deputy_id', employee?.id)}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <button type="submit" className={`btn ${requisition ? 'btn-outline-secondary' : 'btn-outline-primary'} float-right`}>
                                            {requisition ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                        </button>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Form>
                )
            }}
        </Formik>
    )
}

export default RequisitionForm
