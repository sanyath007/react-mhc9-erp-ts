import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Col, Row, Tabs, Tab } from 'react-bootstrap'
import { FaCheckSquare } from 'react-icons/fa'
import { toast } from 'react-toastify';
import moment from 'moment';
import {
    currency,
    getFormDataItem,
    sortObjectByDate,
    toLongTHDate,
    toShortTHDate
} from '../../utils'
import { getRefund, resetSuccess } from '../../features/slices/loan-refund/loanRefundSlice';
import { useGetInitialFormDataQuery } from '../../features/services/loan/loanApi'
import ExpenseList from './Form/ExpenseList'
import OrderList from './Form/OrderList';
import Loading from '../../components/ui/Loading'
import ModalApprovalForm from '../../components/Modals/LoanRefund/Approval/Form'
import ModalReceiptForm from '../../components/Modals/LoanRefund/Receipt/Form';
import DropdownButton from '../../components/FormControls/DropdownButton'
import DropdownItem from '../../components/FormControls/DropdownButton/DropdownItem'
import BudgetList from '../../components/Budget/BudgetList';

const LoanRefundDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { refund, isLoading, isSuccess } = useSelector((state: any) => state.loanRefund);
    const { loggedInUser } = useSelector((state: any) => state.auth);
    const { data: formData } = useGetInitialFormDataQuery();
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [showReceiptForm, setShowReceiptForm] = useState(false);

    useEffect(() => {
        if (id) dispatch(getRefund(id));
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetSuccess());

            toast.success("บันทึกเคลียร์เงินเรียบร้อยแล้ว!!");
        }
    }, [isSuccess]);

    const renderRefundType = (type) => {
        return (
            <>
                {type === 1 && <span>คืนเงิน</span>}
                {type === 2 && <span>เบิกเพิ่ม</span>}
                {type === 3 && <span>พอดี</span>}
                {type === 4 && <span>คืนเงินเต็มจำนวน</span>}
            </>
        )
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan-refund' }}>รายการหักล้างเงินยืม</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดหักล้างเงินยืม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">รายละเอียดหักล้างเงินยืม (#{id})</h1>

                {isLoading && <div className="text-center"><Loading /></div>}
                {!isLoading && (
                    <>
                        <ModalApprovalForm
                            isShow={showApprovalForm}
                            onHide={() => setShowApprovalForm(false)}
                            refund={refund}
                        />

                        <ModalReceiptForm
                            isShow={showReceiptForm}
                            onHide={() => setShowReceiptForm(false)}
                            refund={refund}
                        />

                        <Row className="mb-2">
                            <Col md={8} className="pr-1">
                                <div className="border rounded-md py-2 px-4 bg-[#EAD9D5] text-sm min-h-[315px]">
                                    <h1 className="font-bold text-lg mb-2">สัญญายืมเงิน</h1>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label htmlFor="">สัญญายืมเงินเลขที่ :</label>
                                            <div className="ml-1 text-blue-600 font-bold">
                                                {refund?.contract && <span>{refund?.contract?.contract_no}</span>}
                                            </div>
                                        </Col>
                                        <Col md={4} className="flex flex-row items-center">
                                            <label htmlFor="">ส่งวันที่ :</label>
                                            <div className="ml-1 font-thin">
                                                {toLongTHDate(moment(refund?.contract?.sent_date).toDate())}
                                            </div>
                                        </Col>
                                        <Col className="flex flex-row items-center">
                                            <label>เงินเข้าวันที่ :</label>
                                            <div className="ml-1 text-green-600 font-bold">
                                                {toLongTHDate(moment(refund?.contract?.deposited_date).toDate())}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label>กำหนดคืนเงินภายใน :</label>
                                            <div className="ml-1 font-thin">
                                                {refund?.contract ? currency.format(refund?.contract?.refund_days) : '-'} วัน
                                            </div>
                                        </Col>
                                        <Col className="flex flex-row items-center">
                                            <label>วันที่กำหนดคืนเงิน :</label>
                                            <div className="ml-1 text-red-500 font-bold">
                                                {toLongTHDate(moment(refund?.contract?.refund_date).toDate())}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label>ประเภทการยืม :</label>
                                            <div className="ml-1 font-thin">
                                                {getFormDataItem(formData, 'loanTypes', refund?.contract?.loan?.loan_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={5} className="flex flex-row items-center">
                                            <label htmlFor="">ประเภทเงินยืม :</label>
                                            <div className="ml-1 font-thin">
                                                {getFormDataItem(formData, 'moneyTypes', refund?.contract?.loan?.money_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={3} className="flex flex-row items-center">
                                            <label htmlFor="">ปีงบประมาณ :</label>
                                            <div className="ml-1 font-thin">
                                                {refund?.contract && refund?.contract?.loan?.year + 543}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4} className="flex flex-row items-center">
                                            <label htmlFor="">หน่วยงาน :</label>
                                            <div className="ml-1 font-thin">{refund?.contract?.loan?.department?.name}</div>
                                        </Col>
                                        <Col md={8} className="flex flex-row items-center">
                                            <label htmlFor="">ผู้ขอ/เจ้าของโครงการ :</label>
                                            <div className="ml-1 font-thin">
                                                {refund?.contract?.loan?.employee?.prefix?.name}{refund?.contract?.loan?.employee?.firstname} {refund?.contract?.loan?.employee?.lastname}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={12} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[12%]">โครงการ :</label>
                                            <div className="ml-1 font-thin w-[88%]">
                                                {refund?.contract?.loan?.project_name}
                                                <span className="ml-1"><b>ระหว่างวันที่</b> {toShortTHDate(refund?.contract?.loan?.project_sdate)} - {toShortTHDate(refund?.contract?.loan?.project_edate)}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={12} className="flex flex-row items-start">
                                            <label htmlFor="" className="w-[12%]">งบประมาณ :</label>
                                            <div className="ml-1 font-thin w-[88%]">
                                                {refund?.contract?.loan?.budgets && refund?.contract?.loan?.budgets.map((item, index) => (
                                                    <ul key={item.id}>
                                                        <li>
                                                            <span className="mr-1">{index + 1}.</span>
                                                            {item.budget?.activity?.name}
                                                            {/* <span className="ml-1">
                                                                {item.budget?.project?.plan?.name} / {item.budget?.project?.name}
                                                            </span> */}
                                                            <span className="ml-1">
                                                                <b>งบประมาณ</b> {currency.format(item?.total)} บาท
                                                            </span>
                                                        </li>
                                                    </ul>
                                                ))}
                                                <p><b>รวมงบประมาณทั้งสิ้น</b> {currency.format(refund?.contract?.loan?.budget_total)} บาท</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col md={4} className="pl-1">
                                <div className="border rounded-md py-2 px-4 text-sm min-h-[315px]">
                                    <div className="flex flex-row items-center gap-2">
                                        <h1 className="font-bold text-lg">เอกสารหักล้างเงินยืม</h1>
                                        <div>
                                            {refund?.status === 'N' && <span className="badge rounded-pill bg-danger">ยังไม่เคลียร์</span>}
                                            {refund?.status === 'Y' && <span className="badge rounded-pill bg-success">เคลียร์แล้ว</span>}
                                        </div>
                                    </div>
                                    <Row className="mb-2">
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="" className="font-bold">เลขที่เอกสาร</label>
                                            <div className="text-sm">
                                                {refund?.doc_no}
                                            </div>
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="" className="font-bold">วันที่เอกสาร</label>
                                            <div className="text-sm">
                                                {toLongTHDate(moment(refund?.doc_date).toDate())}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="" className="font-bold">ประเภท</label>
                                            <div className="text-sm">
                                                {renderRefundType(refund?.refund_type_id)}
                                            </div>
                                        </Col>
                                        <Col md={6} className="mt-2">
                                            <label htmlFor="" className="font-bold">ยอดเงิน{refund?.balance >= 0 ? 'คืน' : 'เบิกเพิ่ม'}</label>
                                            <div className="text-sm">
                                                {refund?.balance < 0 && (
                                                    <span className="text-red-600 font-bold">
                                                        {currency.format(Math.abs(refund?.balance))}
                                                    </span>
                                                )}
                                                {refund?.balance >= 0 && (
                                                    <span className="text-green-600 font-bold">
                                                        {currency.format(refund?.balance)}
                                                    </span>
                                                )} บาท
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* คืนเงินเกิน 20% */}
                                    {refund?.is_over20 === 1 && (
                                        <Row className="my-2">
                                            <Col md={12} className="mt-1">
                                                <div className="flex flex-row items-center gap-1">
                                                    <FaCheckSquare /> คืนเกิน 20%
                                                </div>
                                            </Col>
                                            <Col md={6} className="mt-2">
                                                <label htmlFor="" className="font-bold">เลขที่เอกสาร</label>
                                                <div className="text-sm">
                                                    {refund?.over20_no}
                                                </div>
                                            </Col>
                                            <Col md={6} className="mt-2">
                                                <label htmlFor="" className="font-bold">วันที่เอกสาร</label>
                                                <div className="text-sm">
                                                    {toLongTHDate(moment(refund?.over20_date).toDate())}
                                                </div>
                                            </Col>
                                            <Col md={12} className="mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="" className="font-bold">เหตุผล</label>
                                                    <div className="text-xs min-h-[45px]">
                                                        {refund?.over20_reason ? refund?.over20_reason : '-'}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}

                                </div>
                            </Col>
                        </Row>

                        {/* คืนเงินเต็มจำนวน */}
                        {refund?.refund_type_id === 4 && (
                            <Row className="mb-2">
                                <Col>
                                    <div className="border rounded-md py-2 px-4 text-sm">
                                        <h2 className="font-bold text-base underline my-1">รายละเอียดคืนเงินเต็มจำนวน</h2>

                                        <Row>
                                            <Col md={6}>
                                                <label htmlFor="" className="font-bold">เลขที่เอกสารอ้างอิง</label>
                                                <div className="text-sm">
                                                    {refund?.return_no}
                                                </div>
                                            </Col>
                                            <Col md={6} className="max-md:mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="" className="font-bold">วันที่เอกสารอ้างอิง</label>
                                                    <div className="text-sm">
                                                        {toLongTHDate(moment(refund?.return_date).toDate())}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6} className="mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="" className="font-bold">หัวข้อ</label>
                                                    <div className="text-xs min-h-[45px]">
                                                        {refund?.return_topic}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6} className="mt-2">
                                                <div className="flex flex-col">
                                                    <label htmlFor="" className="font-bold">เหตุผล</label>
                                                    <div className="text-xs min-h-[45px]">
                                                        {refund?.return_reason}
                                                    </div>
                                                </div>
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
                                    >
                                        <Tab eventKey="expenses" title="รายการค่าใช้จ่าย">
                                            <div className={`border-x-[1px] border-b-[1px] rounded-bl-md rounded-br-md py-3 px-2 border-x-[#ddd] border-b-[#ddd]`}>
                                                <ExpenseList
                                                    items={refund?.details.filter(item => item.contract_detail?.expense_group === 1)}
                                                    courses={refund && [...refund?.contract?.loan?.courses].sort((a, b) => sortObjectByDate(a.course_date, b.course_date))}
                                                    showButtons={false}
                                                />

                                                <div className="flex flex-row justify-end items-center gap-2">
                                                    รวมค่าใช้จ่ายทั้งสิ้น
                                                    <div className="w-[10%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {currency.format(refund?.item_total)}
                                                        </div>
                                                    </div>
                                                    <div className="w-[9.5%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {refund?.contract ? currency.format(refund?.contract?.item_total - parseFloat(refund?.item_total)) : '0'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="orders" title="รายการจัดซื้อจัดจ้าง">
                                            <div className={`border-x-[1px] border-b-[1px] rounded-bl-md rounded-br-md py-3 px-2 border-x-[#ddd] border-b-[#ddd]`}>
                                                <OrderList
                                                    orders={refund?.details.filter(item => item.contract_detail?.expense_group === 2)}
                                                    showButtons={false}
                                                />

                                                <div className="flex flex-row justify-end items-center gap-2">
                                                    รวมจัดซื้อจัดทั้งสิ้น
                                                    <div className="w-[10%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {currency.format(refund?.order_total)}
                                                        </div>
                                                    </div>
                                                    <div className="w-[9.5%]">
                                                        <div className="form-control min-h-[34px] text-right text-sm font-bold">
                                                            {refund?.contract ? currency.format(refund?.contract?.order_total - parseFloat(refund?.order_total)) : '0'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>

                                    <div className="flex flex-row justify-end items-center gap-2 mt-2">
                                        <div>
                                            <span className="text-lg font-bold">ยอดใช้จริงทั้งสิ้น</span>
                                            <span className="ml-1">
                                                (ค่าใช้จ่าย {currency.format(refund?.item_total)} บาท + จัดซื้อจัดจ้าง {currency.format(refund?.order_total)} บาท) =
                                            </span>
                                        </div>
                                        <div className="w-[10%]">
                                            <div className="form-control font-bold text-lg text-right float-right min-h-[34px]">
                                                {refund?.net_total >= refund?.contract?.net_total && (
                                                    <span className="text-red-600 font-bold">
                                                        {currency.format(refund?.net_total)}
                                                    </span>
                                                )}
                                                {refund?.net_total < refund?.contract?.net_total && (
                                                    <span className="text-green-600 font-bold">
                                                        {currency.format(refund?.net_total)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-[10%]">
                                            <div className="form-control font-bold text-lg text-right float-right min-h-[34px]">
                                                {refund?.balance < 0 && (
                                                    <span className="text-red-600 font-bold">
                                                        {currency.format(refund?.balance)}
                                                    </span>
                                                )}
                                                {refund?.balance >= 0 && (
                                                    <span className="text-green-600 font-bold">
                                                        {currency.format(refund?.balance)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-col p-2 rounded-md border">
                                    <h1 className="font-bold text-lg mb-1">งบประมาณ ({parseFloat(refund?.balance) >= 0 ? 'คืน' : 'เบิกเพิ่ม'})</h1>

                                    <BudgetList
                                        budgets={refund?.budgets.filter(budget => !budget.removed)}
                                        showButtons={false}
                                    />

                                    <div className="flex flex-row justify-end items-center">
                                        <div className="mr-2">งบประมาณทั้งสิ้น</div>
                                        <div className="w-[15%]">
                                            <div className="form-control float-right text-right text-lg font-bold">
                                                {currency.format(refund?.budget_total)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2 mt-4">
                            <Col className="flex justify-center">
                                {refund?.refund_type_id !== 4 && (
                                    <DropdownButton title="เอกสารหักล้างเงินยืม" btnColor="primary" cssClass="mr-1">
                                        <DropdownItem>
                                            <Link to={`/preview/${id}/loan-refund/form`} target="_blank" className="text-success">
                                                <i className="fas fa-print mr-1"></i>
                                                พิมพ์คำขอ
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <a href={`${process.env.REACT_APP_API_URL}/loan-refunds/${id}/form`} target="_blank" className="text-primary">
                                                <i className="far fa-file-word mr-1"></i>
                                                ดาวน์โหลดบันทึก
                                            </a>
                                        </DropdownItem>
                                    </DropdownButton>
                                )}

                                {/* คืนเงินเกิน 20% */}
                                {refund?.is_over20 === 1 && (
                                    <DropdownButton title="เอกสารคืนเงินยืมเกิน 20%" btnColor="primary" cssClass="mr-1">
                                        <DropdownItem>
                                            <Link to={`/preview/${id}/loan-refund/over20`} target="_blank" className="text-success">
                                                <i className="fas fa-print mr-1"></i>
                                                พิมพ์บันทึก
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <a href={`${process.env.REACT_APP_API_URL}/loan-refunds/${id}/over20`} target="_blank" className="text-primary">
                                                <i className="far fa-file-word mr-1"></i>
                                                ดาวน์โหลดบันทึก
                                            </a>
                                        </DropdownItem>
                                    </DropdownButton>
                                )}

                                {/* คืนเงินเต็มจำนวน */}
                                {refund?.refund_type_id === 4 && (
                                    <DropdownButton title="เอกสารคืนเงินเต็มจำนวน" btnColor="primary" cssClass="mr-1">
                                        <DropdownItem>
                                            <Link to={`/preview/${id}/loan-refund/return`} target="_blank" className="text-success">
                                                <i className="fas fa-print mr-1"></i>
                                                พิมพ์บันทึก
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <a href={`${process.env.REACT_APP_API_URL}/loan-refunds/${id}/return`} target="_blank" className="text-primary">
                                                <i className="far fa-file-word mr-1"></i>
                                                ดาวน์โหลดบันทึก
                                            </a>
                                        </DropdownItem>
                                    </DropdownButton>
                                )}

                                {[1, 4].includes(loggedInUser?.permissions[0].role_id) && (
                                    <>
                                        {refund?.status === 'N' && (
                                            <a href="#" className="btn btn-primary btn-sm" onClick={() => setShowApprovalForm(true)}>
                                                เคลียร์เงินยืม
                                            </a>
                                        )}
                                        {(refund?.status === 'Y' && !refund?.receipt_no) && (
                                            <>
                                                <Link to={`/preview/${id}/loan-refund/bill`} target="_blank" className="btn btn-success btn-sm mr-1">
                                                    พิมพ์ใบรับใบสำคัญ
                                                </Link>
                                                <a href="#" className="btn btn-primary btn-sm" onClick={() => setShowReceiptForm(true)}>
                                                    บันทึกใบเสร็จ
                                                </a>
                                            </>
                                        )}
                                    </>
                                )}

                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
}

export default LoanRefundDetail;