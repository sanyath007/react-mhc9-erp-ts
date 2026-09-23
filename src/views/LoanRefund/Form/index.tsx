import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Col, Row, Tabs, Tab } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { FaCheckSquare, FaSearch } from 'react-icons/fa'
import { DatePicker } from '@material-ui/pickers';
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import * as Yup from 'yup'
import moment from 'moment';
import {
    calculateNetTotal,
    currency,
    currencyToNumber,
    getFormDataItem,
    removeItemWithFlag,
    setFieldTouched,
    sortObjectByDate,
    toLongTHDate,
    toShortTHDate
} from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'
import { store, update } from '../../../features/slices/loan-refund/loanRefundSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/loan/loanApi'
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList'
import AddOrder from './AddOrder';
import OrderList from './OrderList';
import AddBudget from './AddBudget'
import Loading from '../../../components/ui/Loading'
import ModalLoanContractList from '../../../components/Modals/LoanContract/List'
import BudgetBullet from '../../../components/Budget/BudgetBullet'
import BudgetList from '../../../components/Budget/BudgetList'

const refundSchema = Yup.object().shape({
    doc_no: Yup.string().required('กรุณาระบุเลขที่เอกสารหักล้างฯ'),
    doc_date: Yup.string().required('กรุณาระบุวันที่เอกสารหักล้างฯ'),
    contract_id: Yup.string().required('กรุณาระบุเลือกสัญญาเงินยืม'),
    refund_type_id: Yup.string().required('กรุณาระบุเลขที่ฎีกา/อ้างอิง'),
    over20_no: Yup.string().when('is_over20', {
        is: true,
        then: (schema) => schema.required('กรุณาระบุเลขที่เอกสารคืนเกิน 20%')
    }),
    over20_date: Yup.string().when('is_over20', {
        is: true,
        then: (schema) => schema.required('กรุณาระบุวันที่เอกสารคืนเกิน 20%')
    }),
    over20_reason: Yup.string().when('is_over20', {
        is: true,
        then: (schema) => schema.required('กรุณาระบุเหตุผลคืนเกิน 20%')
    }),
    return_no: Yup.string().when('refund_type_id', {
        is: (val) => val === '4',
        then: (schema) => schema.required('กรุณาระบุเลขที่เอกสาร')
    }),
    return_date: Yup.string().when('refund_type_id', {
        is: (val) => val === '4',
        then: (schema) => schema.required('กรุณาระบุวันที่เอกสาร')
    }),
    return_topic: Yup.string().when('refund_type_id', {
        is: (val) => val === '4',
        then: (schema) => schema.required('กรุณาระบุหัวข้อ')
    }),
    return_reason: Yup.string().when('refund_type_id', {
        is: (val) => val === '4',
        then: (schema) => schema.required('กรุณาระบุเหตุผล')
    }),
    net_total: Yup.string().required('กรุณาระบุยอดใช้จริงทั้งสิ้น'),
    balance: Yup.mixed().test(
        'Compare balance and budget_total',
        'จำนวนงบประมาณและยอดเงินคืน/เบิกเพิ่มไม่เท่ากัน',
        (val: any, context: any) => {
            return val <= 0 || val > 0 && (parseFloat(parseFloat(currencyToNumber(val) as any).toFixed(2)) === parseFloat(currencyToNumber(context.parent.budget_total) as any))
        },
    ),
    items: Yup.mixed().test({
        message: "กรุณาระบุรายการค่าใช้จ่ายที่ต้องการคืน/เบิกเพิ่ม",
        test: (arr: any) => arr.length > 0
    }),
    budgets: Yup.mixed().test({
        message: "กรุณาระบุรายการงบประมาณต้องการคืน/เบิกเพิ่ม",
        test: (arr: any, context: any) => {
            return context.parent.balance <= 0 || (context.parent.balance > 0 && arr.length > 0)
        },
    })
});

const LoanRefundForm = ({ refund }: any) => {
    const classes = useStyles();
    const dispatch = useDispatch<any>();
    const [selectedDocDate, setSelectedDocDate] = useState(moment());
    const [selectedOver20Date, setSelectedOver20Date] = useState(moment());
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [contract, setContract] = useState(null);
    const [edittingItem, setEdittingItem] = useState(null);
    const [contractItems, setContractItems] = useState([]);
    const [contractBudgets, setContractBudgets] = useState([]);
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (refund) {
            setContract(refund.contract);
            setSelectedDocDate(moment(refund.doc_date));

            /** Filter contractItems for AddExpense'expese prop */
            setContractItems(
                refund.contract?.details.filter(item => {
                    return !refund.details.some(it => it.contract_detail_id === item.id);
                })
            );

            /** Filter contractBudgets for AddBudget'budget prop */
            setContractBudgets(
                refund.contract?.loan?.budgets.filter(budget => {
                    return !refund.budgets.some(bg => bg.budget_id === budget.budget_id);
                })
            );
        }
    }, [refund]);

    const handleAddItem = (formik, contractDetail) => {
        /** Determines whether incoming data is existed or not  */
        if (formik.values.items.some(item => item.contract_detail_id === contractDetail.contract_detail_id)) {
            toast.error('ไม่สามารถระบุรายการค่าใช้จ่ายซ้ำได้!!');
            return
        }

        /** Create new items array */
        const newItems = [...formik.values.items, contractDetail];
        formik.setFieldValue('items', newItems);
        setFieldTouched(formik, 'items');

        /** Filter contractItems for AddExpense'expese prop */
        setContractItems(contractItems.filter(item => item.id !== parseInt(contractDetail.contract_detail_id, 10)));

        /** Calculate net total */
        const netTotal = getNetTotal(formik, newItems);

        /** คำนวณยอดคงเหลือและยอดคืนเกิน 20% หรือไม่ */
        const balance = contract?.net_total - netTotal;
        formik.setFieldValue('balance', balance);
        setRefundType(formik, balance);
    };

    const handleEditItem = (data) => {
        setEdittingItem(data);
    };

    const handleUpdateItem = (formik, id, data) => {
        const updatedItems = formik.values.items.map(item => {
            if (item.item_id === id) return { ...data };

            return item;
        });

        setEdittingItem(null);
        formik.setFieldValue('items', updatedItems);
        formik.setFieldValue('net_total', currency.format(calculateNetTotal(updatedItems, (isRemoved) => isRemoved)));
    };

    const handleRemoveItem = (formik, id, isNewRefund = false) => {
        /** Create new items array */
        const newItems = removeItemWithFlag(formik.values.items, id, isNewRefund);
        formik.setFieldValue('items', newItems);

        /** Filter contractItems for AddExpense'expese prop */
        setContractItems(
            contract?.details
                .filter(item => item.expense_group === 1)
                .filter(item => !newItems.some(it => (!it.removed && parseInt(it.contract_detail_id, 10) === item.id)))
        );

        /** Calculate net total */
        const netTotal = getNetTotal(formik, newItems);

        /** คำนวณยอดคงเหลือและยอดคืนเกิน 20% หรือไม่ */
        const balance = contract?.net_total - netTotal;
        formik.setFieldValue('balance', balance);
        setRefundType(formik, balance);
    };

    const createItemsToReturn = (items) => {
        const newItems = items.map(item => {
            /** เซตค่าฟิลด์ has_pattern โดยเช็คค่า pattern จาก expense ของ expenses prop */
            const pattern = !!item.expense?.pattern;

            /** Filter contractItems for AddExpense'expese prop */
            setContractItems(contractItems.filter(item => item.id !== parseInt(item.id, 10)));

            return {
                id: uuid(),
                contract_detail_id: item.id,
                has_pattern: pattern,
                contract_detail: item,
                description: item.description,
                total: 0,
            };
        });

        return newItems;
    };

    const setRefundType = (formik, balance) => {
        if (parseInt(formik.values.refund_type_id, 10) !== 4) {
            formik.setFieldValue('is_over20', (balance * 100) / contract?.loan?.budget_total >= 20);
            formik.setFieldValue('refund_type_id', balance === 0 ? '3' : (balance > 0 ? '1' : '2'));
        }
    };

    const getNetTotal = (formik, items) => {
        const itemTotal = items.length > 0 ? calculateNetTotal(items.filter(item => item.contract_detail?.expense_group === 1), (isRemoved) => isRemoved) : 0;
        const orderTotal = items.length > 0 ? calculateNetTotal(items.filter(item => item.contract_detail?.expense_group === 2), (isRemoved) => isRemoved) : 0;
        const netTotal = orderTotal + itemTotal;

        formik.setFieldValue('item_total', itemTotal);
        formik.setFieldValue('order_total', orderTotal);
        formik.setFieldValue('net_total', netTotal);

        return netTotal;
    };

    const handleAddBudget = (formik, budget) => {
        const newBudgets = [...formik.values.budgets, budget];
        const budgetTotal = calculateNetTotal(newBudgets, (isRemoved) => isRemoved);

        /** Filter contractBudgets for AddBudget'budget prop */
        setContractBudgets(contractBudgets.filter(cb => cb.budget_id !== parseInt(budget.budget_id, 10)));

        formik.setFieldValue('budgets', newBudgets);
        formik.setFieldValue('budget_total', currency.format(budgetTotal));
        setFieldTouched(formik, 'budgets');
    };

    const handleRemoveBudget = (formik, id, isNewRefund = false) => {
        let newBudgets = removeItemWithFlag(formik.values.budgets, id, isNewRefund);

        /** Filter contractBudgets for AddBudget'budget prop */
        setContractBudgets(
            contract?.loan?.budgets.filter(budget => {
                return !newBudgets.some(bg => (!bg.removed && parseInt(bg.budget_id, 10) === budget.budget_id))
            })
        );

        formik.setFieldValue('budgets', newBudgets);
        formik.setFieldValue('budget_total', currency.format(calculateNetTotal(newBudgets, (isRemoved) => isRemoved)));
        setFieldTouched(formik, 'budgets');
    };

    const handleSubmit = (values, formik) => {
        if (refund) {
            dispatch(update({ id: refund.id, data: values }));
        } else {
            dispatch(store(values));
        }

        formik.resetForm();

        /** Clear value of local states */
        setContract(null);
        setSelectedDocDate(moment());
    };

    return (
        <Formik
            initialValues={{
                doc_no: refund ? refund.doc_no : '',
                doc_date: refund ? moment(refund.doc_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                contract_id: refund ? refund.contract_id : '',
                refund_type_id: refund ? refund.refund_type_id : '1',
                employee_id: refund ? refund.employee_id : '',
                year: refund ? refund.year : '',
                item_total: refund ? refund.item_total : 0,
                order_total: refund ? refund.order_total : 0,
                net_total: refund ? refund.net_total : 0,
                budget_total: refund ? refund.budget_total : 0,
                balance: refund ? refund.balance : 0,
                is_over20: refund ? ((!refund.is_over20 || refund.is_over20 === 0) ? false : true) : false,
                over20_no: (refund && refund.over20_no) ? refund.over20_no : '',
                over20_date: (refund && refund.over20_date) ? refund.over20_date : '',
                over20_reason: (refund && refund.over20_reason) ? refund.over20_reason : '',
                return_no: (refund && refund.return_no) ? refund.return_no : '',
                return_date: (refund && refund.return_date) ? refund.return_date : '',
                return_topic: (refund && refund.return_topic) ? refund.return_topic : '',
                return_reason: (refund && refund.return_reason) ? refund.return_reason : '',
                items: refund ? refund.details : [],
                budgets: refund ? refund.budgets : [],
            }}
            validationSchema={refundSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <ModalLoanContractList
                            isShow={showLoanModal}
                            onHide={() => setShowLoanModal(false)}
                            onSelect={(contract) => {
                                setContract(contract);
                                setContractItems(contract?.details);
                                setContractBudgets(contract?.loan?.budgets);

                                formik.setFieldValue('contract_id', contract?.id);
                                formik.setFieldValue('employee_id', contract?.employee_id);
                                formik.setFieldValue('year', contract?.year);

                                /** หน่วงเวลา */
                                setFieldTouched(formik, 'contract_id');
                            }}
                        />

                        <Row className="mb-3">
                            <Col md={8} className="pr-1">
                                <div
                                    className={`
                                        border rounded-md py-2 px-3 bg-[#EAD9D5] text-sm 
                                        ${formik.values.is_over20 ? 'min-h-[402px]' : 'min-h-[315px]'}
                                    `}
                                >
                                    <h1 className="font-bold text-lg mb-2">สัญญายืมเงิน</h1>
                                    <Row className="mb-3">
                                        <Col md={8} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[22%] mt-[8px]">สัญญายืมเงิน :</label>
                                            <div className="w-[65%]">
                                                <div className="input-group">
                                                    <div className="form-control text-sm h-[34px] bg-gray-100">
                                                        {contract && <span className="mr-4"><b className="mr-1">เลขที่</b> {contract?.contract_no}</span>}
                                                    </div>
                                                    {!refund && <button type="button" className="btn btn-outline-secondary" onClick={() => setShowLoanModal(true)}>
                                                        <FaSearch />
                                                    </button>}
                                                </div>
                                                {(formik.errors.contract_id && formik.touched.contract_id) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.contract_id as string}</span>
                                                )}
                                            </div>
                                        </Col>
                                        <Col className="flex flex-row items-center">
                                            <label htmlFor="">ส่งวันที่ :</label>
                                            <div className="font-thin ml-1">
                                                {toLongTHDate(moment(contract?.sent_date).toDate())}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col className="flex flex-row items-center">
                                            <label>เงินเข้าวันที่ :</label>
                                            <div className="ml-1 text-green-600 font-bold">
                                                {toLongTHDate(moment(contract?.deposited_date).toDate())}
                                            </div>
                                        </Col>
                                        <Col className="flex flex-row items-center">
                                            <label>กำหนดคืนเงินภายใน :</label>
                                            <div className="font-thin ml-1">
                                                {contract ? currency.format(contract?.refund_days) : '-'} วัน
                                            </div>
                                        </Col>
                                        <Col className="flex flex-row items-center">
                                            <label>วันที่กำหนดคืนเงิน :</label>
                                            <div className="ml-1 text-red-500 font-bold">
                                                {toLongTHDate(moment(contract?.refund_date).toDate())}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label>ประเภทการยืม :</label>
                                            <div className="font-thin ml-1">
                                                {getFormDataItem(formData, 'loanTypes', contract?.loan?.loan_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={5} className="flex flex-row items-center">
                                            <label htmlFor="">ประเภทเงินยืม :</label>
                                            <div className="font-thin ml-1">
                                                {getFormDataItem(formData, 'moneyTypes', contract?.loan?.money_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={3} className="flex flex-row items-center">
                                            <label htmlFor="">ปีงบประมาณ :</label>
                                            <div className="font-thin ml-1">
                                                {contract && contract?.loan?.year + 543}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label htmlFor="">หน่วยงาน :</label>
                                            <div className="font-thin ml-1">{contract?.loan?.department?.name}</div>
                                        </Col>
                                        <Col md={8} className="flex flex-row items-center">
                                            <label htmlFor="">ผู้ขอ/เจ้าของโครงการ :</label>
                                            <div className="font-thin ml-1">
                                                {contract?.loan?.employee?.prefix?.name}{contract?.loan?.employee?.firstname} {contract?.loan?.employee?.lastname}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={12} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[12%]">โครงการ :</label>
                                            <div className="font-thin ml-1 w-[88%]">
                                                {contract?.loan?.project_name}
                                                <span className="ml-1"><b>ระหว่างวันที่</b> {toShortTHDate(contract?.loan?.project_sdate)} - {toShortTHDate(contract?.loan?.project_edate)}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={12} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[12%]">งบประมาณ :</label>
                                            <BudgetBullet
                                                budgets={contract?.loan?.budgets}
                                                total={contract?.loan?.budget_total}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col md={4} className="pl-1">
                                <div className="border rounded-md py-2 px-4 text-sm min-h-[315px]">
                                    <h1 className="font-bold text-lg mb-2">เอกสารหักล้างเงินยืม</h1>
                                    <Row className="mb-2">
                                        <Col md={6} className="max-[768px]:mt-2">
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
                                        <Col md={6} className="max-[768px]:mt-2">
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
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={6} className="max-[768px]:mt-2">
                                            <label htmlFor="">ประเภท</label>
                                            <select
                                                name="refund_type_id"
                                                value={formik.values.refund_type_id}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            >
                                                <option value="">-- เลือกประเภท --</option>
                                                <option value="1">คืนเงิน</option>
                                                <option value="2">เบิกเพิ่ม</option>
                                                <option value="3">พอดี</option>
                                                <option value="4">คืนเงินเต็มจำนวน</option>
                                            </select>
                                            {(formik.errors.refund_type_id && formik.touched.refund_type_id) && (
                                                <span className="text-red-500 text-xs">{formik.errors.refund_type_id as string}</span>
                                            )}
                                        </Col>
                                        <Col md={6} className="max-[768px]:mt-2">
                                            <div className="flex flex-col">
                                                <label htmlFor="">ยอดเงิน{parseFloat(formik.values.balance) >= 0 ? 'คืน' : 'เบิกเพิ่ม'}</label>
                                                <div className="form-control text-sm font-bold bg-gray-200 min-h-[34px]">
                                                    {parseFloat(formik.values.balance) < 0 && (
                                                        <span className="text-red-600">
                                                            {currency.format(Math.abs(formik.values.balance))}
                                                        </span>
                                                    )}
                                                    {parseFloat(formik.values.balance) >= 0 && (
                                                        <span className="text-green-600">
                                                            {currency.format(formik.values.balance)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {(formik.errors.net_total && formik.touched.net_total) && (
                                                <span className="text-red-500 text-xs">{formik.errors.net_total as string}</span>
                                            )}
                                        </Col>
                                    </Row>

                                    {/* คืนเงินเกิน 20% */}
                                    {formik.values.is_over20 && (
                                        <Row className="mb-2 mt-3 border-t">
                                            <Col md={12} className="mt-1">
                                                <div className="flex flex-row items-center gap-1">
                                                    <FaCheckSquare /> คืนเกิน 20%
                                                </div>
                                            </Col>
                                            <Col md={6} className="mt-2">
                                                <label htmlFor="">เลขที่เอกสาร</label>
                                                <input
                                                    type="text"
                                                    name="over20_no"
                                                    value={formik.values.over20_no}
                                                    onChange={formik.handleChange}
                                                    className={`form-control text-sm ${(formik.errors.over20_no && formik.touched.over20_no) && 'border-red-500'}`}
                                                />
                                                {(formik.errors.over20_no && formik.touched.over20_no) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.over20_no as string}</span>
                                                )}
                                            </Col>
                                            <Col md={6} className="mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="">วันที่เอกสาร</label>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        value={selectedOver20Date}
                                                        className={classes.muiTextFieldInput}
                                                        onChange={(date) => {
                                                            setSelectedOver20Date(date);
                                                            formik.setFieldValue('over20_date', date.format('YYYY-MM-DD'));
                                                        }}
                                                    />
                                                </div>
                                                {(formik.errors.over20_date && formik.touched.over20_date) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.over20_date as string}</span>
                                                )}
                                            </Col>
                                            <Col md={12} className="mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="">เหตุผล</label>
                                                    <textarea
                                                        rows={5}
                                                        name="over20_reason"
                                                        value={formik.values.over20_reason}
                                                        onChange={formik.handleChange}
                                                        className={`form-control text-sm ${(formik.errors.over20_reason && formik.touched.over20_reason) && 'border-red-500'}`}
                                                    ></textarea>
                                                </div>
                                                {(formik.errors.over20_reason && formik.touched.over20_reason) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.over20_reason as string}</span>
                                                )}
                                            </Col>
                                        </Row>
                                    )}

                                    <Row>
                                        <Col className="text-center">
                                            {(contract && parseInt(formik.values.refund_type_id, 10) !== 4) && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm my-2"
                                                    onClick={() => {
                                                        if (formik.values.items.filter(item => !item.removed).length > 0) {
                                                            toast.error("คุณมีรายการค่าใช้จ่ายอยู่แล้ว กรุณาลบรายการออกก่อน!!");
                                                            return;
                                                        }

                                                        formik.setFieldValue('refund_type_id', '4');

                                                        /** Clear values of inputs that related over20 data */
                                                        formik.setFieldValue('is_over20', false);
                                                        formik.setFieldValue('over20_no', '');
                                                        formik.setFieldValue('over20_date', '');
                                                        formik.setFieldValue('over20_reason', '');

                                                        /** Create item list to return */
                                                        const newItems = createItemsToReturn(contractItems);

                                                        formik.setFieldValue('items', [...formik.values.items, ...newItems]);
                                                        setFieldTouched(formik, 'items');

                                                        /** Calculate net total */
                                                        const netTotal = getNetTotal(formik, newItems);

                                                        /** คำนวณยอดคงเหลือและยอดคืนเกิน 20% หรือไม่ */
                                                        const balance = contract?.net_total - netTotal;
                                                        formik.setFieldValue('balance', balance);
                                                    }}
                                                >
                                                    คืนเงินเต็มจำนวน
                                                </button>
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        {/* คืนเงินเต็มจำนวน */}
                        {parseInt(formik.values.refund_type_id, 10) === 4 && (
                            <Row className="mb-2">
                                <Col>
                                    <div className="border rounded-md py-2 px-4 text-sm">
                                        <div className="flex flex-row items-center justify-between">
                                            <h2 className="font-bold text-base underline my-1">รายละเอียดคืนเงินเต็มจำนวน</h2>

                                            {parseInt(formik.values.refund_type_id, 10) === 4 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => {
                                                        formik.setFieldValue('refund_type_id', '1');

                                                        formik.setFieldValue('items', [])

                                                        /** Calculate net total */
                                                        const netTotal = getNetTotal(formik, []);

                                                        /** คำนวณยอดคงเหลือและยอดคืนเกิน 20% หรือไม่ */
                                                        formik.setFieldValue('balance', contract?.net_total - netTotal);

                                                        formik.setFieldValue('return_no', '');
                                                        formik.setFieldValue('return_date', '');
                                                        formik.setFieldValue('return_reason', '');

                                                        /** Filter contractItems for AddExpense'expese prop */
                                                        setContractItems(contract?.details);
                                                    }}
                                                >
                                                    ยกเลิก
                                                </button>
                                            )}
                                        </div>

                                        <Row>
                                            <Col md={6}>
                                                <label htmlFor="">เลขที่เอกสาร</label>
                                                <input
                                                    type="text"
                                                    name="return_no"
                                                    value={formik.values.return_no}
                                                    onChange={formik.handleChange}
                                                    className={`form-control text-sm ${(formik.errors.return_no && formik.touched.return_no) && 'border-red-500'}`}
                                                />
                                                {(formik.errors.return_no && formik.touched.return_no) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.return_no as string}</span>
                                                )}
                                            </Col>
                                            <Col md={6} className="max-md:mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="">วันที่เอกสาร</label>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        value={selectedOver20Date}
                                                        className={classes.muiTextFieldInput}
                                                        onChange={(date) => {
                                                            setSelectedOver20Date(date);
                                                            formik.setFieldValue('return_date', date.format('YYYY-MM-DD'));
                                                        }}
                                                    />
                                                </div>
                                                {(formik.errors.return_date && formik.touched.return_date) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.return_date as string}</span>
                                                )}
                                            </Col>
                                            <Col md={6} className="my-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="">หัวข้อ</label>
                                                    <textarea
                                                        rows={3}
                                                        name="return_topic"
                                                        value={formik.values.return_topic}
                                                        onChange={formik.handleChange}
                                                        className={`form-control text-sm font-thin ${(formik.errors.return_topic && formik.touched.return_topic) && 'border-red-500'}`}
                                                    ></textarea>
                                                </div>
                                                {(formik.errors.return_topic && formik.touched.return_topic) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.return_topic as string}</span>
                                                )}
                                            </Col>
                                            <Col md={6} className="my-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="">เหตุผล</label>
                                                    <textarea
                                                        rows={3}
                                                        name="return_reason"
                                                        value={formik.values.return_reason}
                                                        onChange={formik.handleChange}
                                                        className={`form-control text-sm font-thin ${(formik.errors.return_reason && formik.touched.return_reason) && 'border-red-500'}`}
                                                    ></textarea>
                                                </div>
                                                {(formik.errors.return_reason && formik.touched.return_reason) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.return_reason as string}</span>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-col border p-2 rounded-md">
                                    <Tabs
                                        id=""
                                        defaultActiveKey="expenses"
                                        className={`mt-2 ${(formik.errors.items && formik.touched.items) && 'border-red-500'}`}
                                    >
                                        <Tab eventKey="expenses" title="รายการค่าใช้จ่ายจริง">
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
                                                    expenses={contractItems.filter(item => item.expense_group === 1)}
                                                    courses={contract && [...contract?.loan?.courses].sort((a, b) => sortObjectByDate(a.course_date, b.course_date))}
                                                    refundType={formik.values.refund_type_id}
                                                    onAddItem={(data) => handleAddItem(formik, data)}
                                                />

                                                <ExpenseList
                                                    items={
                                                        formik.values.items
                                                            .filter(item => !item.removed)
                                                            .filter(item => item.contract_detail?.expense_group === 1)
                                                    }
                                                    courses={contract && [...contract?.loan?.courses].sort((a, b) => sortObjectByDate(a.course_date, b.course_date))}
                                                    showButtons={parseInt(formik.values.refund_type_id, 10) !== 4}
                                                    edittingItem={edittingItem}
                                                    onEditItem={(data) => handleEditItem(data)}
                                                    onRemoveItem={(id, isNewRefund) => handleRemoveItem(formik, id, isNewRefund)}
                                                />

                                                <div className="flex flex-row justify-end items-center gap-2">
                                                    รวมค่าใช้จ่ายทั้งสิ้น
                                                    <div className="w-[9.5%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {currency.format(formik.values.item_total)}
                                                        </div>
                                                    </div>
                                                    <div className="w-[9.5%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {contract ? currency.format(contract?.item_total - parseFloat(formik.values.item_total)) : '0'}
                                                        </div>
                                                    </div>
                                                    <div className="w-[9.5%]"></div>
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
                                                    expenses={contractItems.filter(item => item.expense_group === 2)}
                                                    onAdd={(order) => {
                                                        // /** Create new items array */
                                                        const newItems = [...formik.values.items, order];
                                                        formik.setFieldValue('items', newItems);

                                                        /** Filter contractItems for AddExpense'expese prop */
                                                        setContractItems(contractItems.filter(item => item.id !== parseInt(order.contract_detail_id, 10)));

                                                        /** Calculate net total */
                                                        const netTotal = getNetTotal(formik, newItems);

                                                        /** คำนวณยอดคงเหลือและยอดคืนเกิน 20% หรือไม่ */
                                                        formik.setFieldValue('balance', contract?.net_total - netTotal);
                                                        setRefundType(formik, contract?.net_total - netTotal);
                                                    }}
                                                />

                                                <OrderList
                                                    orders={
                                                        formik.values.items
                                                            .filter(item => !item.removed)
                                                            .filter(item => item.contract_detail?.expense_group === 2)
                                                    }
                                                    showButtons={parseInt(formik.values.refund_type_id, 10) !== 4}
                                                    onRemove={(id, isNewRefund) => {
                                                        const newItems = removeItemWithFlag(formik.values.items, id, isNewRefund);
                                                        formik.setFieldValue('items', newItems);

                                                        /** Filter contractItems for AddExpense'expese prop */
                                                        setContractItems(
                                                            contract?.details
                                                                .filter(item => item.expense_group === 2)
                                                                .filter(item => !newItems.some(it => (!it.removed && parseInt(it.contract_detail_id, 10) === item.id)))
                                                        );

                                                        /** Calculate net total */
                                                        const netTotal = getNetTotal(formik, newItems);

                                                        /** คำนวณยอดคงเหลือและยอดคืนเกิน 20% หรือไม่ */
                                                        formik.setFieldValue('balance', contract?.net_total - netTotal);
                                                        setRefundType(formik, contract?.net_total - netTotal);
                                                    }}
                                                />

                                                <div className="flex flex-row justify-end items-center gap-2">
                                                    รวมจัดซื้อจัดทั้งสิ้น
                                                    <div className="w-[9.5%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {currency.format(formik.values.order_total)}
                                                        </div>
                                                    </div>
                                                    <div className="w-[9.5%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {contract ? currency.format(contract?.order_total - parseFloat(formik.values.order_total)) : '0'}
                                                        </div>
                                                    </div>
                                                    <div className="w-[9.5%]"></div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                    {(formik.errors.items && formik.touched.items) && (
                                        <span className="text-red-500 text-xs">
                                            {formik.errors.items as string}
                                        </span>
                                    )}

                                    <div className="flex flex-row justify-end items-center gap-2 p-2">
                                        <div>
                                            <span className="text-lg font-bold">ยอดใช้จริงทั้งสิ้น</span>
                                            <span className="ml-1">(ค่าใช้จ่าย {currency.format(formik.values.item_total)} บาท + จัดซื้อจัดจ้าง {currency.format(formik.values.order_total)} บาท) =</span>
                                        </div>
                                        <div className="w-[9.5%]">
                                            <div className="form-control font-bold text-lg text-right float-right min-h-[34px]">
                                                {contract?.net_total < parseFloat(formik.values.net_total) && (
                                                    <span className="text-red-600">
                                                        {currency.format(formik.values.net_total)}
                                                    </span>
                                                )}
                                                {contract?.net_total >= parseFloat(formik.values.net_total) && (
                                                    <span className="text-green-600">
                                                        {currency.format(formik.values.net_total)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-[9.5%]">
                                            <div className="form-control font-bold text-lg text-right float-right min-h-[34px]">
                                                {parseFloat(formik.values.balance) < 0 && (
                                                    <span className="text-red-600">
                                                        {currency.format(formik.values.balance)}
                                                    </span>
                                                )}
                                                {parseFloat(formik.values.balance) >= 0 && (
                                                    <span className="text-green-600">
                                                        {currency.format(formik.values.balance)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-[9.5%]"></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col>
                                <div
                                    className={
                                        `flex flex-col p-2 rounded-md 
                                        ${(formik.errors.budgets && formik.touched.budgets) || (formik.errors.balance && formik.touched.balance)
                                            ? 'border-[1px] border-red-500'
                                            : 'border'
                                        }`
                                    }
                                >
                                    <h1 className="font-bold text-lg mb-1">งบประมาณ ({parseFloat(formik.values.balance) >= 0 ? 'คืน' : 'เบิกเพิ่ม'})</h1>
                                    <AddBudget
                                        items={contractBudgets}
                                        onAdd={(budget) => handleAddBudget(formik, budget)}
                                    />
                                    <BudgetList
                                        budgets={formik.values.budgets.filter(budget => !budget.removed)}
                                        newFlagField="refund_id"
                                        onRemoveBudget={(id, isNewRefund) => handleRemoveBudget(formik, id, isNewRefund)}
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
                                                className="form-control float-right text-right text-lg font-bold"
                                            />
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                </div>
                                {((formik.errors.budgets && formik.touched.budgets) || (formik.errors.balance && formik.touched.balance)) && (
                                    <>
                                        {(formik.errors.budgets && formik.touched.budgets) && <span className="text-red-500 text-xs">{formik.errors.budgets as string}</span>}
                                        {((formik.errors.budgets && formik.touched.budgets) && (formik.errors.balance && formik.touched.balance)) && (
                                            <span className="text-red-500 text-xs mr-1">,</span>
                                        )}
                                        {(formik.errors.balance && formik.touched.balance) && <span className="text-red-500 text-xs">{formik.errors.balance as string}</span>}
                                    </>
                                )}
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <button type="submit" className={`btn ${refund ? 'btn-outline-warning' : 'btn-outline-primary'} float-right`}>
                                    {refund ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default LoanRefundForm