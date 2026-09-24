import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaEdit } from "react-icons/fa";
import { currency, toShortTHDate } from '../../../utils'
import { getRequisition, updateApprovals } from '../../../features/slices/requisition/requisitionSlice'
import { resetSuccess } from '../../../features/slices/approval/approvalSlice'
import ItemList from '../Form/ItemList'
import StatusBadge from '../StatusBadge'
import ModalApprovalForm from './Approval/Form'
import ConsiderationForm from './Consideration/Form'
import ConsiderationDetail from './Consideration/Detail'
import Loading from '../../../components/ui/Loading'
import DropdownButton from '../../../components/FormControls/DropdownButton'
import DropdownItem from '../../../components/FormControls/DropdownButton/DropdownItem'
import BudgetList from '../../../components/Budget/BudgetList'

const RequisitionDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { requisition, isLoading } = useSelector((state: any) => state.requisition);
    const { approval, isSuccess } = useSelector((state: any) => state.approval);
    const { loggedInUser } = useSelector((state: any) => state.auth);
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [showConsiderForm, setShowConsiderForm] = useState(false);

    useEffect(() => {
        if (id) dispatch(getRequisition({ id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลคำขอเรียบร้อยแล้ว!!');

            dispatch(updateApprovals(approval));
            dispatch(resetSuccess());
        }
    }, [isSuccess]);

    /** เซตโชว์ฟอร์มบันทึกรายงานผลการพิจารณา ถ้ายังไม่ได้บันทึกข้อมูลรายงานผลการพิจารณา */
    useEffect(() => {
        if (requisition && requisition.approvals.length > 0) {
            setShowConsiderForm((requisition.approvals[0].consider_no === null || requisition.approvals[0].consider_no === ''));
        }
    }, [requisition]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/requisition' }}>รายการคำขอซื้อ/จ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดคำขอซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl">รายละเอียดคำขอซื้อ/จ้าง (#{id})</h2>
                    <div className="flex flex-row items-center">
                        <span className="mr-2">สถานะ :</span>
                        <StatusBadge status={requisition?.status} />
                    </div>
                </div>

                <div>
                    {isLoading && <div className="text-center"><Loading /></div>}

                    {(!isLoading && requisition) && (
                        <>
                            <ModalApprovalForm
                                isShow={showApprovalForm}
                                onHide={() => setShowApprovalForm(false)}
                                approval={
                                    requisition.requisition_type_id === 1
                                        ? requisition.approvals && requisition.approvals.length > 0 ? requisition.approvals[0] : null
                                        : null
                                }
                                requisition={requisition}
                            />

                            <Row className="mb-2">
                                <Col md={9} className="pr-1">
                                    <div className="border py-2 px-3 mt-2 rounded-md min-h-[225px]">
                                        <Row className="text-sm">
                                            <Col md={3} className="pb-1">
                                                <label htmlFor="">เลขที่เอกสาร</label>
                                                <div className="text-sm font-thin">{requisition.pr_no}</div>
                                            </Col>
                                            <Col md={3} className="pb-1">
                                                <div className="flex flex-col">
                                                    <label htmlFor="">วันที่เอกสาร</label>
                                                    <div className="text-sm font-thin">
                                                        {toShortTHDate(requisition.pr_date)}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={3} className="pb-1">
                                                <label>ประเภท (ซื้อ/จ้าง)</label>
                                                <div className="text-sm font-thin">
                                                    {requisition.order_type_id === 1 ? 'ซื้อ' : 'จ้าง'}
                                                </div>
                                            </Col>
                                            <Col md={3} className="pb-1">
                                                <label htmlFor="">ประเภทสินค้า</label>
                                                <div className="text-sm font-thin">
                                                    {requisition.category?.name}
                                                </div>
                                            </Col>
                                        </Row>

                                        {requisition.order_type_id === 2 && (
                                            <Row>
                                                <Col className="pb-1">
                                                    <label htmlFor="">รายละเอียดการจ้าง</label>
                                                    <div className="text-sm font-thin">
                                                        {requisition.contract_desc}
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}

                                        <Row>
                                            <Col md={9} className="pb-1">
                                                <label htmlFor="">เรื่อง</label>
                                                <div className="text-sm font-thin">
                                                    {requisition.topic} จำนวน {requisition.item_count} รายการ
                                                </div>
                                            </Col>
                                            <Col className="pb-1">
                                                <label htmlFor="">ปีงบประมาณ</label>
                                                <div className="text-sm font-thin">
                                                    {requisition.year && requisition.year + 543}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6} className="pb-1">
                                                <label htmlFor="">โครงการ (ถ้ามี)</label>
                                                <div className="text-sm font-thin">
                                                    {requisition.project_name ? requisition.project_name : '-'}
                                                </div>
                                            </Col>
                                            <Col className="pb-1">
                                                <label htmlFor="">เหตุผลที่ขอ</label>
                                                <div className="text-sm font-thin">{requisition.reason}</div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col className="pl-1">
                                    <div className="flex flex-col items-center border rounded-md p-3 mt-2 min-h-[225px]">
                                        <div className={`border-4 border-gray-200 rounded-full w-[60px] h-[60px] overflow-hidden object-cover object-center mb-2`}>
                                            {requisition.requester?.avatar_url
                                                ? <img src={`${process.env.REACT_APP_API_URL}/uploads/${requisition.requester?.avatar_url}`} alt="requester-pic" />
                                                : <img src="/img/avatar-heroes.png" alt="requester-pic" className="avatar-img" />}
                                        </div>
                                        <div className="flex flex-col items-start w-full text-sm">
                                            <div className="w-full mb-1">
                                                <label htmlFor="">ผู้ขอ/เจ้าของโครงการ</label>
                                                <div className="input-group">
                                                    <div className="text-xs font-thin">
                                                        {requisition.requester?.prefix?.name}{requisition.requester?.firstname} {requisition.requester?.lastname}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full mb-1">
                                                <label htmlFor="">ตำแหน่ง</label>
                                                <div className="input-group">
                                                    <div className="text-xs font-thin">
                                                        {requisition.requester?.position?.name}{requisition.requester?.level?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full mb-1">
                                                <label htmlFor="">หน่วยงาน</label>
                                                <div className="text-xs font-thin">
                                                    {requisition.division ? requisition.division?.name : requisition.department?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col>
                                    <div className="flex flex-col border p-2 rounded-md">
                                        <h1 className="font-bold text-lg mb-1">งบประมาณ</h1>

                                        <BudgetList budgets={requisition?.budgets} showButtons={false} />

                                        <div className="flex flex-row justify-end items-center">
                                            <div className="mr-2">งบประมาณทั้งสิ้น</div>
                                            <div className="w-[15%]">
                                                <div className="form-control font-bold float-right text-right text-green-500">
                                                    {currency.format(requisition?.budget_total)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col>
                                    <div className="flex flex-col border p-2 rounded-md">
                                        <h1 className="font-bold text-lg mb-1">รายการสินค้า</h1>
                                        <ItemList
                                            items={requisition.details}
                                            showButtons={false}
                                        />

                                        <Row>
                                            <Col md={4}>
                                                <div className="flex flex-row justify-start items-center gap-1 ml-4">
                                                    <label className="text-right pr-1">วันที่ต้องการใช้ :</label>
                                                    <div className="w-[50%] py-1">
                                                        {toShortTHDate(requisition.desired_date)}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={8}>
                                                <div className="flex flex-row justify-end items-center gap-1">
                                                    <div>รวมเป็นเงินทั้งสิ้น :</div>
                                                    <div className="w-[23%]">
                                                        <div className="text-right form-control font-bold py-1">
                                                            {currency.format(requisition.net_total)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={12} lg={8} className="lg:pr-1">
                                    <div className="border w-full pt-2 pb-4 px-2 rounded-md">
                                        <h3 className="font-bold text-lg mb-1">ผู้ตรวจรับพัสดุ</h3>
                                        {requisition.committees.length > 0 && requisition.committees.map((committee, index) => (
                                            <div className="min-w-[50%] flex flex-row font-thin text-sm ml-4" key={committee.id}>
                                                <span className="min-w-[45%]">
                                                    {index + 1}. {committee.employee?.prefix.name}{committee.employee?.firstname} {committee.employee?.lastname}
                                                </span>
                                                <span>
                                                    <b>ตำแหน่ง</b> {committee.employee?.position?.name}{committee.employee?.level && committee.employee?.level?.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                                <Col className="max-[990px]:mt-2 lg:pl-1">
                                    <div className="border w-full pt-2 pb-4 px-2 rounded-md">
                                        <h3 className="font-bold text-lg mb-1">
                                            ผู้อนุมัติแทน ผอ. <span className="text-red-500 font-normal">(ถ้ามี)</span>
                                        </h3>
                                        <div className="min-w-[50%] flex flex-row font-thin text-sm ml-4">
                                            {requisition.deputy ? (
                                                <>
                                                    <span>{requisition.deputy.prefix.name}{requisition.deputy.firstname} {requisition.deputy.lastname}</span>
                                                    {/* <span>
                                                        <b>ตำแหน่ง</b> {requisition.deputy.position?.name}{requisition.deputy.level && requisition.deputy.level?.name}
                                                    </span> */}
                                                </>
                                            ) : '-'}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* รายงานขอซื้อ/จ้าง (Report and directive) */}
                            <div className="border w-full py-2 px-2 mb-2 rounded-md relative">
                                <div className="flex flex-row justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg">รายงานขอซื้อ/จ้าง</h3>

                                    {[1, 3].includes(loggedInUser?.permissions[0]?.role_id)
                                        && (requisition.requisition_type_id === 2 || (requisition.requisition_type_id === 1 && requisition.approvals.length === 0)) && (
                                            <button type="button" className="btn btn-outline-primary btn-sm mr-1" onClick={() => setShowApprovalForm(true)}>
                                                <i className="fas fa-plus-square mr-1"></i>
                                                สร้างรายงานขอซื้อ/จ้าง
                                            </button>
                                        )}
                                </div>

                                <table className="table table-sm table-bordered mb-2">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: '5%' }}>ลำดับ</th>
                                            <th className="text-center">รายงานขอซื้อ/จ้าง</th>
                                            <th className="text-center" style={{ width: '50%' }}>รายงานผลการพิจารณา</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!requisition.approvals || requisition.approvals.length === 0) && (
                                            <tr>
                                                <td className="text-sm text-center font-thin py-2" colSpan={3}>
                                                    <span className='text-red-500'>-- ยังไม่มีรายการ --</span>
                                                </td>
                                            </tr>
                                        )}

                                        {requisition.approvals && requisition.approvals.map((approval, index) => (
                                            <tr key={approval.id}>
                                                <td className="text-sm font-thin text-center">{index + 1}</td>
                                                <td className="text-sm font-thin">
                                                    <div className="flex flex-row justify-between w-full px-2">
                                                        <div className='w-1/2'>
                                                            <p>วิธีการจัดหา</p>
                                                            <p className="font-semibold">{approval.procuring?.name}</p>
                                                            <p className='mt-2'>รายงานขอซื้อ/จ้าง</p>
                                                            <p className='space-x-2'>
                                                                <span>เลขที่ <span className='font-semibold'>{approval.report_no}</span></span>
                                                                <span> วันที่ <span className='font-semibold'>{toShortTHDate(approval.report_date)}</span></span>
                                                            </p>
                                                        </div>
                                                        <div className='w-1/2'>
                                                            <p>คำสั่งแต่งตั้งผู้ตรวจรับ</p>
                                                            <p className='space-x-2'>
                                                                <span>เลขที่ <span className='font-semibold'>{approval.directive_no}</span></span>
                                                                <span> วันที่ <span className='font-semibold'>{toShortTHDate(approval.directive_date)}</span></span>
                                                            </p>
                                                            <p className='mt-2'>วันที่กำหนดส่งมอบ</p>
                                                            <p><span className='font-semibold'>{toShortTHDate(requisition.approvals[0].deliver_date)}</span></p>
                                                        </div>
                                                        <div className='w-[5%]'>
                                                            <button type="button" className="btn btn-light">
                                                                <FaEdit className="text-warning" onClick={() => setShowApprovalForm(true)} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {requisition.requisition_type_id === 2 && (
                                                        <div className='flex flex-row gap-1 px-2 my-2'>
                                                            <DropdownButton title="รายงานขอซื้อ/จ้าง" btnColor="primary" cssClass="mr-1">
                                                                <DropdownItem>
                                                                    <Link to={`/preview/requisition/${id}/report?approvalId=${approval.id}`} target="_blank" className="text-success">
                                                                        <i className="fas fa-print mr-1"></i>
                                                                        พิมพ์รายงาน
                                                                    </Link>
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/report`} target="_blank" className="text-primary">
                                                                        <i className="far fa-file-word mr-1"></i>
                                                                        ดาวน์โหลดรายงาน
                                                                    </a>
                                                                </DropdownItem>
                                                            </DropdownButton>

                                                            <DropdownButton title="คำสั่งแต่งตั้ง" btnColor="primary" cssClass="mr-1">
                                                                <DropdownItem>
                                                                    <Link to={`/preview/requisition/${id}/committee?approvalId=${approval.id}`} target="_blank" className="text-success">
                                                                        <i className="fas fa-print mr-1"></i>
                                                                        พิมพ์คำสั่ง
                                                                    </Link>
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/directive`} target="_blank" className="text-primary">
                                                                        <i className="far fa-file-word mr-1"></i>
                                                                        ดาวน์โหลดคำสั่ง
                                                                    </a>
                                                                </DropdownItem>
                                                            </DropdownButton>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-sm font-thin">
                                                    <div className="flex flex-row justify-end w-full px-2">
                                                        <div>
                                                            {approval.consider_no ? !showConsiderForm ? <ConsiderationDetail approval={approval} /> : (
                                                                <div className="p-3">
                                                                    <ConsiderationForm
                                                                        approval={(approval.consider_no && approval.consider_no !== '') ? approval : null}
                                                                        requisition={requisition}
                                                                        onSubmitted={() => setShowConsiderForm(false)}
                                                                        onCancel={() => setShowConsiderForm(false)}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="p-3">
                                                                    <ConsiderationForm
                                                                        approval={(approval.consider_no && approval.consider_no !== '') ? approval : null}
                                                                        requisition={requisition}
                                                                        onSubmitted={() => setShowConsiderForm(false)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className='w-[5%]'>
                                                            {approval.consider_no && (
                                                                <button type="button" className="btn btn-light">
                                                                    <FaEdit className="text-warning" onClick={() => setShowConsiderForm(true)} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(requisition.requisition_type_id === 2 && approval.consider_no && !showConsiderForm) && (
                                                        <div className='flex flex-row gap-1 px-2 my-2'>
                                                            <DropdownButton title="รายงานผลการพิจารณา" btnColor="primary" cssClass="mr-1">
                                                                <DropdownItem>
                                                                    <Link to={`/preview/requisition/${id}/consider?approvalId=${approval.id}`} target="_blank" className="text-success">
                                                                        <i className="fas fa-print mr-1"></i>
                                                                        พิมพ์รายงาน
                                                                    </Link>
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/consider`} target="_blank" className="text-primary">
                                                                        <i className="far fa-file-word mr-1"></i>
                                                                        ดาวน์โหลดรายงาน
                                                                    </a>
                                                                </DropdownItem>
                                                            </DropdownButton>
                                                            <DropdownButton title="ประกาศผลผู้ชนะ" btnColor="primary" cssClass="mr-1">
                                                                <DropdownItem>
                                                                    <Link to={`/preview/requisition/${id}/notice?approvalId=${approval.id}`} target="_blank" className="text-success">
                                                                        <i className="fas fa-print mr-1"></i>
                                                                        พิมพ์ประกาศ
                                                                    </Link>
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/notice`} target="_blank" className="text-primary">
                                                                        <i className="far fa-file-word mr-1"></i>
                                                                        ดาวน์โหลดประกาศ
                                                                    </a>
                                                                </DropdownItem>
                                                            </DropdownButton>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Actions */}
                            <Row className="mt-3">
                                <Col>
                                    <div className="flex flex-row justify-center">
                                        <DropdownButton title="ใบขอซื้อ/จ้าง" btnColor="primary" cssClass="mr-1">
                                            <DropdownItem>
                                                <Link to={`/preview/requisition/${id}`} target="_blank" className="text-success">
                                                    <i className="fas fa-print mr-1"></i>
                                                    พิมพ์ใบขอซื้อ/จ้าง
                                                </Link>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/document`} target="_blank" className="text-primary">
                                                    <i className="far fa-file-word mr-1"></i>
                                                    ดาวน์โหลดใบขอซื้อ/จ้าง
                                                </a>
                                            </DropdownItem>
                                        </DropdownButton>

                                        {[1, 3].includes(loggedInUser?.permissions[0]?.role_id) && (
                                            <>
                                                {(requisition.requisition_type_id === 1 && requisition.approvals && requisition.approvals.length > 0) && (
                                                    <>
                                                        <DropdownButton title="รายงานขอซื้อ/จ้าง" btnColor="primary" cssClass="mr-1">
                                                            <DropdownItem>
                                                                <Link to={`/preview/requisition/${id}/report?approvalId=${requisition.approvals[0].id}`} target="_blank" className="text-success">
                                                                    <i className="fas fa-print mr-1"></i>
                                                                    พิมพ์รายงาน
                                                                </Link>
                                                            </DropdownItem>
                                                            <DropdownItem>
                                                                <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/report`} target="_blank" className="text-primary">
                                                                    <i className="far fa-file-word mr-1"></i>
                                                                    ดาวน์โหลดรายงาน
                                                                </a>
                                                            </DropdownItem>
                                                        </DropdownButton>

                                                        <DropdownButton title="คำสั่งแต่งตั้ง" btnColor="primary" cssClass="mr-1">
                                                            <DropdownItem>
                                                                <Link to={`/preview/requisition/${id}/committee?approvalId=${requisition.approvals[0].id}`} target="_blank" className="text-success">
                                                                    <i className="fas fa-print mr-1"></i>
                                                                    พิมพ์คำสั่ง
                                                                </Link>
                                                            </DropdownItem>
                                                            <DropdownItem>
                                                                <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/directive`} target="_blank" className="text-primary">
                                                                    <i className="far fa-file-word mr-1"></i>
                                                                    ดาวน์โหลดคำสั่ง
                                                                </a>
                                                            </DropdownItem>
                                                        </DropdownButton>

                                                        {(requisition.approvals[0].consider_no && requisition.approvals[0].consider_no !== '') && (
                                                            <>
                                                                <DropdownButton title="รายงานผลการพิจารณา" btnColor="primary" cssClass="mr-1">
                                                                    <DropdownItem>
                                                                        <Link to={`/preview/requisition/${id}/consider?approvalId=${requisition.approvals[0].id}`} target="_blank" className="text-success">
                                                                            <i className="fas fa-print mr-1"></i>
                                                                            พิมพ์รายงาน
                                                                        </Link>
                                                                    </DropdownItem>
                                                                    <DropdownItem>
                                                                        <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/consider`} target="_blank" className="text-primary">
                                                                            <i className="far fa-file-word mr-1"></i>
                                                                            ดาวน์โหลดรายงาน
                                                                        </a>
                                                                    </DropdownItem>
                                                                </DropdownButton>
                                                                <DropdownButton title="ประกาศผลผู้ชนะ" btnColor="primary" cssClass="mr-1">
                                                                    <DropdownItem>
                                                                        <Link to={`/preview/requisition/${id}/notice?approvalId=${requisition.approvals[0].id}`} target="_blank" className="text-success">
                                                                            <i className="fas fa-print mr-1"></i>
                                                                            พิมพ์ประกาศ
                                                                        </Link>
                                                                    </DropdownItem>
                                                                    <DropdownItem>
                                                                        <a href={`${process.env.REACT_APP_API_URL}/requisitions/${id}/notice`} target="_blank" className="text-primary">
                                                                            <i className="far fa-file-word mr-1"></i>
                                                                            ดาวน์โหลดประกาศ
                                                                        </a>
                                                                    </DropdownItem>
                                                                </DropdownButton>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RequisitionDetail
