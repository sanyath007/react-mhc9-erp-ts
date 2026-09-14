import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb, Col, Row, Tab, Tabs } from 'react-bootstrap'
import moment from 'moment'
import { getLoan } from '../../features/slices/loan/loanSlice'
import { useGetInitialFormDataQuery } from '../../features/services/loan/loanApi'
import {
    currency,
    getFormDataItem,
    sortObjectByDate,
    toLongTHDate,
    toLongTHDateRange
} from '../../utils'
import Loading from '../../components/ui/Loading'
import BudgetList from '../../components/Budget/BudgetList'
import ExpenseList from '../../components/Expense/ExpenseList'
import DropdownButton from '../../components/FormControls/DropdownButton'
import DropdownItem from '../../components/FormControls/DropdownButton/DropdownItem'
import OrderList from './Form/OrderList'

const LoanDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { loan, isLoading } = useSelector((state: any) => state.loan);
    const { data: formData, isLoading: loading } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (id) {
            dispatch(getLoan(id));
        }
    }, [id]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan' }}>รายการคำขอยืมเงิน</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดคำขอยืมเงิน</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">รายละเอียดคำขอยืมเงิน (#{id})</h1>

                {isLoading && <div className="text-center"><Loading /></div>}
                {(!isLoading && loan) && (
                    <>
                        <Row className="mb-2">
                            <Col md={9} className="pr-1">
                                <div className="flex flex-col border rounded-md p-3 mt-2 min-h-[198px]">
                                    <Row className="mb-2">
                                        <Col md={4}>
                                            <label htmlFor="">เลขที่เอกสาร</label>
                                            <div className="text-sm font-thin">
                                                {loan?.doc_no}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="flex flex-col">
                                                <label htmlFor="">วันที่เอกสาร</label>
                                                <div className="text-sm font-thin">
                                                    {toLongTHDate(moment(loan?.doc_date).toDate())}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <label htmlFor="">หน่วยงาน</label>
                                            <div className="text-xs font-thin">
                                                {loan.division ? loan.division?.name : loan?.department?.name}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4}>
                                            <label>ประเภทการยืม</label>
                                            <div className="text-sm font-thin">
                                                {getFormDataItem(formData, 'loanTypes', loan?.loan_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <label htmlFor="">ประเภทเงินยืม</label>
                                            <div className="text-sm font-thin">
                                                {getFormDataItem(formData, 'moneyTypes', loan?.money_type_id)?.name}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <label htmlFor="">ปีงบประมาณ</label>
                                            <div className="text-sm font-thin">
                                                {loan?.year && loan?.year + 543}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label htmlFor="">หมายเหตุ</label>
                                            <div className="text-sm font-thin">
                                                {loan?.remark ? loan?.remark : '-'}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col className="pl-1">
                                <div className="flex flex-col items-center border rounded-md py-1 px-3 mt-2 min-h-[198px]">
                                    <div className={`border-4 border-gray-200 rounded-full w-[60px] h-[60px] overflow-hidden object-cover object-center mb-2`}>
                                        {loan?.employee?.avatar_url
                                            ? <img src={`${process.env.REACT_APP_API_URL}/uploads/${loan?.employee?.avatar_url}`} alt="requester-pic" />
                                            : <img src="/img/avatar-heroes.png" alt="requester-pic" className="avatar-img" />}
                                    </div>
                                    <div className="flex flex-col items-start w-full text-sm">
                                        <div className="w-full mb-1">
                                            <label htmlFor="">ผู้ขอ/เจ้าของโครงการ</label>
                                            <div className="input-group">
                                                <div className="text-xs font-thin">
                                                    {loan?.employee?.prefix?.name}{loan?.employee?.firstname} {loan?.employee?.lastname}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full mb-1">
                                            <label htmlFor="">ตำแหน่ง</label>
                                            <div className="input-group">
                                                <div className="text-xs font-thin">
                                                    {loan?.employee?.position?.name}{loan?.employee?.level?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div className="flex flex-col border rounded-md py-2 px-3 mb-2">
                            <h1 className="font-bold text-lg mb-1">รายละเอียดโครงการ</h1>

                            <Row className="mb-2">
                                <Col md={3}>
                                    <label htmlFor="">เลขที่ขออนุมัติ</label>
                                    <div className="text-sm font-thin">
                                        {loan?.project_no}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label htmlFor="">วันที่ขออนุมัติ</label>
                                    <div className="text-sm font-thin">
                                        {toLongTHDate(moment(loan?.project_date).toDate())}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <label htmlFor="">หน่วยงานเจ้าของโครงการ</label>
                                    <div className="text-sm font-thin">
                                        {loan?.project_owner}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={12}>
                                    <label htmlFor="">ชื่อโครงการ</label>
                                    <div className="text-sm font-thin">
                                        {loan?.project_name}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={2}>
                                    <label htmlFor="">วันที่จัด</label>
                                    <div className="text-sm font-thin">
                                        {toLongTHDate(moment(loan?.project_sdate).toDate())}
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <label htmlFor="">วันที่สิ้นสุด</label>
                                    <div className="text-sm font-thin">
                                        {toLongTHDate(moment(loan?.project_edate).toDate())}
                                    </div>
                                </Col>
                                <Col>
                                    <label htmlFor="">การคิดค่าใช้จ่าย</label>
                                    <div className="text-sm font-thin">
                                        {loan?.expense_calc === 1 && <span className="badge rounded-pill bg-success">คิดค่าใช้จ่ายรวม</span>}
                                        {loan?.expense_calc === 2 && <span className="badge rounded-pill bg-danger">คิดค่าใช้จ่ายแยกวันที่</span>}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="alert alert-primary py-1 px-1 mb-0">
                                        <h3 className="text-blue-900 ml-1 underline">รายการรุ่น</h3>

                                        <ul className="text-sm font-thin">
                                            {loan && [...loan?.courses]
                                                .sort((a, b) => sortObjectByDate(a.course_date, b.course_date))
                                                .map((course, index) => (
                                                    <li key={index} className="hover:bg-blue-300 py-1 px-2 rounded-md">
                                                        {/* - รุ่นที่ {course.seq_no} */}
                                                        {++index}.{course?.course_date && <span className="ml-1">วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</span>}
                                                        <span className="ml-1">
                                                            ณ {course?.room && <span className="mr-1">{course.room}</span>}
                                                            {course?.place?.name} จ.{course?.place?.changwat?.name}
                                                            <span className="ml-1">{course?.remark && course?.remark}</span>
                                                        </span>
                                                    </li>
                                                )
                                                )}
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <Row className="mb-2">
                            <Col md={12}>
                                <div className="flex flex-col border p-2 rounded-md">
                                    <h1 className="font-bold text-lg mb-1">งบประมาณ</h1>

                                    <BudgetList budgets={loan?.budgets} showButtons={false} />

                                    <div className="flex flex-row justify-end items-center">
                                        <div className="mr-2">งบประมาณทั้งสิ้น</div>
                                        <div className="w-[15%]">
                                            <div className="form-control font-bold float-right text-right text-green-500">
                                                {currency.format(loan?.budget_total)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-col">
                                    <Tabs id="" defaultActiveKey="expense">
                                        <Tab eventKey="expense" title="รายการค่าใช้จ่าย">
                                            <div className={`border-x-[1px] border-b-[1px] rounded-bl-md rounded-br-md py-3 px-2 border-x-[#ddd] border-b-[#ddd]`}>
                                                <ExpenseList
                                                    items={loan?.details.filter(item => item.expense_group === 1)}
                                                    courses={loan && [...loan?.courses].sort((a, b) => sortObjectByDate(a.course_date, b.course_date))}
                                                    showButtons={false}
                                                />
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[85%] text-right">รวมค่าใช้จ่ายทั้งสิ้น</div>
                                                    <div className="form-control min-h-[34px] w-[15%] text-right text-sm">
                                                        {currency.format(loan?.item_total)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="orders" title="รายการจัดซื้อจัดจ้าง">
                                            <div className={`border-x-[1px] border-b-[1px] rounded-bl-md rounded-br-md py-3 px-2 border-x-[#ddd] border-b-[#ddd]`}>
                                                <OrderList
                                                    orders={loan?.details.filter(item => item.expense_group === 2)}
                                                    showButtons={false}
                                                />
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-[85%] text-right">รวมจัดซื้อจัดจ้างทั้งสิ้น</div>
                                                    <div className="form-control min-h-[34px] w-[15%] text-right text-sm">
                                                        {currency.format(loan?.order_total)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>

                                    <div className="flex flex-row justify-end items-center mt-2 px-[10px]">
                                        <div className="w-[75%] text-right text-lg mr-2">
                                            <span className="text-lg font-bold">รวมเป็นเงินทั้งสิ้น</span>
                                            <span className="ml-1">(ค่าใช้จ่าย {currency.format(loan?.item_total)} บาท + จัดซื้อจัดจ้าง {currency.format(loan?.order_total)} บาท) =</span>
                                        </div>
                                        <div className="w-[15%]">
                                            <div className="form-control font-bold float-right text-right text-red-500">
                                                {currency.format(loan?.net_total)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2 mt-4">
                            <Col className="flex justify-center">
                                <DropdownButton title="คำขอยืมเงิน" btnColor="primary" cssClass="mr-1">
                                    <DropdownItem>
                                        <Link to={`/preview/${id}/loan/form`} target="_blank" className="text-success">
                                            <i className="fas fa-print mr-1"></i>
                                            พิมพ์คำขอ
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <a href={`${process.env.REACT_APP_API_URL}/loans/${id}/form`} target="_blank" className="text-primary">
                                            <i className="far fa-file-word mr-1"></i>
                                            ดาวน์โหลดคำขอ
                                        </a>
                                    </DropdownItem>
                                </DropdownButton>
                                <DropdownButton title="สัญญาเงินยืม" btnColor="primary" cssClass="mr-1">
                                    <DropdownItem>
                                        <Link to={`/preview/${id}/loan-contract/form`} target="_blank" className="text-success">
                                            <i className="fas fa-print mr-1"></i>
                                            พิมพ์สัญญาเงินยืม
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <a href={`${process.env.REACT_APP_API_URL}/loans/${id}/contract`} target="_blank" className="text-primary">
                                            <i className="far fa-file-word mr-1"></i>
                                            ดาวน์โหลดสัญญา
                                        </a>
                                    </DropdownItem>
                                </DropdownButton>
                                <a href={`${process.env.REACT_APP_API_URL}/uploads/documents/loan_contract_back.pdf`} target="_blank" className="btn btn-success btn-sm">
                                    พิมพ์ด้านหลังสัญญา
                                </a>
                                {/* <Link to={`/preview/${id}/project/verify`} target="_blank" className="btn btn-secondary mr-2">
                                    <i className="fas fa-print mr-1"></i>
                                    พิมพ์บันทึกทวนสอบ
                                </Link>
                                <Link to={`/preview/${id}/project/review`} target="_blank" className="btn btn-success mr-2">
                                    <i className="fas fa-print mr-1"></i>
                                    พิมพ์บันทึกทบทวน
                                </Link> */}
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </div>
    )
}

export default LoanDetail