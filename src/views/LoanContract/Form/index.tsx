import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Col, Row, Tabs, Tab } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { FaSearch } from 'react-icons/fa'
import { DatePicker } from '@material-ui/pickers';
import * as Yup from 'yup'
import moment from 'moment';
import {
    calculateNetTotal,
    currency,
    getFormDataItem,
    toLongTHDate,
    toShortTHDate,
    sortObjectByDate
} from '../../../utils'
import { store, update } from '../../../features/slices/loan-contract/loanContractSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/loan/loanApi'
import Loading from '../../../components/ui/Loading'
import ExpenseList from '../../../components/Expense/ExpenseList'
import OrderList from '../../Loan/Form/OrderList'
import ModalLoanList from '../../../components/Modals/Loan/List'
import BudgetBullet from '../../../components/Budget/BudgetBullet'

const contractSchema = Yup.object().shape({
    loan_id: Yup.string().required('กรุณาระบุเลือกรายการคำขอ'),
    contract_no: Yup.string().required('กรุณาระบุเลขที่สัญญา'),
    sent_date: Yup.string().required('กรุณาเลือกวันที่ส่งสัญญา'),
    approved_date: Yup.string().required('กรุณาเลือกวันที่อนุมัติ'),
    bill_no: Yup.string().required('กรุณาระบุเลขที่ฎีกา/อ้างอิง'),
    bk02_date: Yup.string().required('กรุณาเลือกวันที่วาง ขบ.02'),
    net_total: Yup.string().required('กรุณาระบุเลขที่สัญญา'),
});

const LoanContractForm = ({ contract }: any) => {
    const dispatch = useDispatch<any>();
    const [selectedBk02Date, setSelectedBk02Date] = useState(moment());
    const [selectedSentDate, setSelectedSentDate] = useState(moment());
    const [selectedApprovedDate, setSelectedApprovedDate] = useState(moment());
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [loan, setLoan] = useState(null);
    const [edittingItem, setEdittingItem] = useState(null);
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (contract) {
            setSelectedSentDate(moment(contract.sent_date));
            setSelectedApprovedDate(moment(contract.approved_date));
            setSelectedBk02Date(moment(contract.bk02_date));
            setLoan(contract.loan);
        }
    }, [contract]);

    const handleAddItem = (formik, expense) => {
        const newItems = [...formik.values.items, expense];

        formik.setFieldValue('items', newItems);
        formik.setFieldValue('net_total', currency.format(calculateNetTotal(newItems)));
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
        formik.setFieldValue('net_total', currency.format(calculateNetTotal(updatedItems)));
    };

    const handleRemoveItem = (formik, id) => {
        const newItems = formik.values.items.filter(item => item.expense_id !== id);

        formik.setFieldValue('items', newItems);
        formik.setFieldValue('net_total', currency.format(calculateNetTotal(newItems)));
    };

    const handleSubmit = (values, formik) => {
        if (contract) {
            dispatch(update({ id: contract.id, data: values }));
        } else {
            dispatch(store(values));
        }

        formik.resetForm();

        /** Clear value of local states */
        setLoan(null);
        setSelectedBk02Date(moment());
        setSelectedSentDate(moment());
        setSelectedApprovedDate(moment());
    };

    const convertToExpenseItem = (contractDetails = []) => {
        if (contractDetails.length === 0) return [];

        return contractDetails.map(detail => ({ ...detail, course_id: detail.loan_detail.course_id }));
    };

    return (
        <Formik
            initialValues={{
                contract_no: contract ? contract.contract_no : '',
                year: contract ? contract.year : '',
                loan_id: contract ? contract.loan_id : '',
                employee_id: contract ? contract.employee_id : '',
                sent_date: contract ? contract.sent_date : '',
                approved_date: contract ? contract.approved_date : '',
                bill_no: contract ? contract.bill_no : '',
                bk02_date: contract ? contract.bk02_date : '',
                refund_days: contract ? contract.refund_days : '',
                item_total: contract ? contract.item_total : '0',
                order_total: contract ? contract.order_total : '0',
                net_total: contract ? contract.net_total : '0',
                remark: (contract && contract.remark) ? contract.remark : '',
                items: contract ? contract.details : [],
            }}
            validationSchema={contractSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <ModalLoanList
                            isShow={showLoanModal}
                            onHide={() => setShowLoanModal(false)}
                            onSelect={(loan) => {
                                setLoan(loan);

                                formik.setFieldValue('year', loan.year);
                                formik.setFieldValue('loan_id', loan.id);
                                formik.setFieldValue('employee_id', loan.employee_id);
                                formik.setFieldValue('refund_days', loan.loan_type_id === 1 ? 30 : 15);
                                formik.setFieldValue('item_total', loan.item_total);
                                formik.setFieldValue('order_total', loan.order_total);
                                formik.setFieldValue('net_total', loan.net_total);
                                formik.setFieldValue('items', loan.details);

                                setTimeout(() => formik.setFieldTouched('loan_id', true));
                            }}
                        />

                        <Row className="mb-3">
                            <Col md={8}>
                                <div className="border rounded-md py-2 px-3 bg-[#D8E2DC] text-sm min-h-[325px]">
                                    <h1 className="font-bold text-lg mb-2">คำขอยืมเงิน</h1>
                                    <Row className="mb-2">
                                        <Col md={8} className="flex flex-row items-start justify-center border">
                                            <label htmlFor="" className="w-[18%] mt-[8px]">คำขอ :</label>
                                            <div className="w-[90%]">
                                                <div className="input-group">
                                                    <div className="form-control text-sm h-[34px] bg-gray-100">
                                                        <b>เลขที่</b> {loan && <span>{loan?.doc_no} <b>ลงวันที่</b> {toLongTHDate(moment(loan?.doc_date).toDate())}</span>}
                                                    </div>
                                                    <input
                                                        type="hidden"
                                                        name="loan_id"
                                                        value={formik.values.loan_id}
                                                        onChange={formik.handleChange}
                                                        className="form-control text-sm"
                                                    />
                                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowLoanModal(true)}>
                                                        <FaSearch />
                                                    </button>
                                                </div>
                                                {(formik.errors.loan_id && formik.touched.loan_id) && (
                                                    <span className="text-red-500 text-xs">{formik.errors.loan_id as string}</span>
                                                )}
                                            </div>
                                        </Col>
                                        <Col className="flex flex-row items-center gap-2">
                                            <label htmlFor="">กำหนดคืนภายใน :</label>
                                            <div className="form-control min-h-[34px] w-[20%] text-center text-sm">
                                                {formik.values.refund_days}
                                            </div>
                                            วัน
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label>ประเภทการยืม :</label>
                                            <div className="font-thin ml-1">
                                                {getFormDataItem(formData, 'loanTypes', loan?.loan_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={5} className="flex flex-row items-center">
                                            <label htmlFor="">ประเภทเงินยืม :</label>
                                            <div className="font-thin ml-1">
                                                {getFormDataItem(formData, 'moneyTypes', loan?.money_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={3} className="flex flex-row items-center">
                                            <label htmlFor="">ปีงบประมาณ :</label>
                                            <div className="font-thin ml-1">
                                                {loan && loan?.year + 543}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label htmlFor="">หน่วยงาน :</label>
                                            <div className="font-thin ml-1">{loan?.department?.name}</div>
                                        </Col>
                                        <Col md={8} className="flex flex-row items-center">
                                            <label htmlFor="">ผู้ขอ/เจ้าของโครงการ :</label>
                                            <div className="font-thin ml-1">
                                                {loan?.employee?.prefix?.name}{loan?.employee?.firstname} {loan?.employee?.lastname}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={12} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[12%]">โครงการ :</label>
                                            <div className="font-thin ml-1 w-[88%]">
                                                {loan?.project_name}
                                                <span className="ml-1"><b>ระหว่างวันที่</b> {toShortTHDate(loan?.project_sdate)} - {toShortTHDate(loan?.project_edate)}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={12} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[12%]">งบประมาณ :</label>
                                            <BudgetBullet
                                                budgets={loan?.budgets}
                                                total={loan?.budget_total}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <div className="border rounded-md py-2 px-4 bg-[#EAD9D5] text-sm min-h-[325px]">
                                            <div className="flex items-center mb-2">
                                                <h1 className="font-bold text-lg mr-2">สัญญายืมเงิน</h1>
                                                <div className="text-lg text-center">
                                                    {contract?.status === 1 && <span className="badge rounded-pill text-bg-secondary">รออนุมัติ</span>}
                                                    {contract?.status === 2 && <span className="badge rounded-pill text-bg-success">อนุมัติแล้ว</span>}
                                                    {contract?.status === 3 && <span className="badge rounded-pill text-bg-info">เคลียร์แล้ว</span>}
                                                    {contract?.status === 9 && <span className="badge rounded-pill text-bg-danger">ยกเลิก</span>}
                                                </div>
                                            </div>

                                            <Row className="mb-2">
                                                <Col>
                                                    <label htmlFor="">เลขที่สัญญา</label>
                                                    <input
                                                        type="text"
                                                        name="contract_no"
                                                        value={formik.values.contract_no}
                                                        onChange={formik.handleChange}
                                                        className="form-control text-sm text-center min-h-[34px]"
                                                    />
                                                    {(formik.errors.contract_no && formik.touched.contract_no) && (
                                                        <span className="text-red-500 text-xs">{formik.errors.contract_no as string}</span>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={6}>
                                                    <label htmlFor="">วันที่ส่งสัญญา</label>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        value={selectedSentDate}
                                                        onChange={(date) => {
                                                            setSelectedSentDate(date);
                                                            formik.setFieldValue('sent_date', date.format('YYYY-MM-DD'));
                                                        }}
                                                        inputVariant="outlined"
                                                    />
                                                    {(formik.errors.sent_date && formik.touched.sent_date) && (
                                                        <span className="text-red-500 text-xs">{formik.errors.sent_date as string}</span>
                                                    )}
                                                </Col>
                                                <Col md={6}>
                                                    <label htmlFor="">วันที่อนุมัติ</label>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        value={selectedApprovedDate}
                                                        onChange={(date) => {
                                                            setSelectedApprovedDate(date);
                                                            formik.setFieldValue('approved_date', date.format('YYYY-MM-DD'));
                                                        }}
                                                        inputVariant="outlined"
                                                    />
                                                    {(formik.errors.approved_date && formik.touched.approved_date) && (
                                                        <span className="text-red-500 text-xs">{formik.errors.approved_date as string}</span>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={6}>
                                                    <label htmlFor="">เลขที่ฎีกา/อ้างอิง</label>
                                                    <input
                                                        type="text"
                                                        name="bill_no"
                                                        value={formik.values.bill_no}
                                                        onChange={formik.handleChange}
                                                        className="form-control text-sm text-center min-h-[34px]"
                                                    />
                                                    {(formik.errors.bill_no && formik.touched.bill_no) && (
                                                        <span className="text-red-500 text-xs">{formik.errors.bill_no as string}</span>
                                                    )}
                                                </Col>
                                                <Col md={6}>
                                                    <label htmlFor="">วันที่วาง ขบ.02</label>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        value={selectedBk02Date}
                                                        onChange={(date) => {
                                                            setSelectedBk02Date(date);
                                                            formik.setFieldValue('bk02_date', date.format('YYYY-MM-DD'));
                                                        }}
                                                        inputVariant="outlined"
                                                    />
                                                    {(formik.errors.bk02_date && formik.touched.bk02_date) && (
                                                        <span className="text-red-500 text-xs">{formik.errors.bk02_date as string}</span>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row className="mb-1">
                                                <Col>
                                                    <label htmlFor="">หมายเหตุ</label>
                                                    <textarea
                                                        rows={2}
                                                        name="remark"
                                                        value={formik.values.remark}
                                                        onChange={formik.handleChange}
                                                        className="form-control"
                                                    ></textarea>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-col border rounded-md p-2">
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
                                                <ExpenseList
                                                    items={(contract ? convertToExpenseItem(contract.details).filter(item => item.expense_group === 1) : loan?.details.filter(item => item.expense_group === 1)) || []}
                                                    courses={loan && [...loan?.courses].sort((a, b) => sortObjectByDate(a.course_date, b.course_date))}
                                                    showButtons={false}
                                                />
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[85%] text-right">รวมค่าใช้จ่ายทั้งสิ้น</div>
                                                    <div className="form-control min-h-[34px] w-[15%] text-right text-sm font-bold">
                                                        {currency.format(loan?.item_total)}
                                                    </div>
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
                                                <OrderList
                                                    orders={contract ? convertToExpenseItem(contract.details).filter(item => item.expense_group === 2) : loan?.details.filter(item => item.expense_group === 2)}
                                                    showButtons={false}
                                                />

                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[85%] text-right">รวมจัดซื้อจัดจ้างทั้งสิ้น</div>
                                                    <div className="form-control min-h-[34px] w-[15%] text-right text-sm font-bold">
                                                        {currency.format(loan?.order_total)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>

                                    <div className="flex flex-row justify-end items-center gap-2 p-2">
                                        <div>
                                            <span className="text-lg font-bold">ยอดยืมทั้งสิ้น</span>
                                            <span className="ml-1">(ค่าใช้จ่าย {currency.format(loan?.item_total)} บาท + จัดซื้อจัดจ้าง {currency.format(loan?.order_total)} บาท) =</span>
                                        </div>
                                        <div className="w-[15%]">
                                            <div className="form-control font-bold text-lg text-right text-red-600 float-right">
                                                {currency.format(formik.values.net_total)}
                                            </div>
                                            {(formik.errors.net_total && formik.touched.net_total) && (
                                                <span className="text-red-500 text-xs">{formik.errors.net_total as string}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {(formik.errors.items && formik.touched.items) && (
                                    <span className="text-red-500 text-xs">{formik.errors.items as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button type="submit" className={`btn ${contract ? 'btn-outline-warning' : 'btn-outline-primary'} float-right`}>
                                    {contract ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default LoanContractForm