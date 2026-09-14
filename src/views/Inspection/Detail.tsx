import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { getInspection } from '../../features/slices/inspection/inspectionSlice'
import { currency, toShortTHDate } from '../../utils'
import ItemList from './ItemList'
import Loading from '../../components/ui/Loading'
import DropdownButton from '../../components/FormControls/DropdownButton'
import DropdownItem from '../../components/FormControls/DropdownButton/DropdownItem'

const InspectionDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { inspection, isLoading } = useSelector((state: any) => state.inspection);

    useEffect(() => {
        if (id) dispatch(getInspection(id));
    }, [dispatch, id]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/inspection' }}>รายการตรวจรับพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดการตรวจรับพัสดุ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายละเอียดการตรวจรับพัสดุ</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && (
                        <div className="text-center"><Loading /></div>
                    )}

                    {!isLoading && inspection && (
                        <>
                            <Row className="mb-2">
                                <Col md={8}>
                                    <Row className="mb-2">
                                        <Col md={5}>
                                            <label htmlFor="">เลขที่ใบส่งของ</label>
                                            <div className="form-control font-thin text-sm cursor-not-allowed">
                                                {inspection.deliver_no}
                                            </div>
                                        </Col>
                                        <Col md={5}>
                                            <label htmlFor="">วันที่ใบส่งของ</label>
                                            <div className="form-control font-thin text-sm cursor-not-allowed">
                                                {toShortTHDate(inspection.deliver_date)}
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <span className="mr-2">ปีงบ</span>
                                            <div className="form-control font-thin text-sm cursor-not-allowed">
                                                {inspection.year + 543}
                                            </div>
                                        </Col>
                                    </Row>
                                    {/* รายละเอียดคำขอซื้อ */}
                                    <Row>
                                        <Col className="lg:pr-1 md:pr-1">
                                            <div className="form-control min-h-[150px] text-sm font-thin bg-[#D8E2DC] p-3">
                                                <p>
                                                    <b className="mr-1">เลขที่ใบสั่งซื้อ/จ้าง</b>
                                                    <span className="mr-2">{inspection.order?.po_no}</span>
                                                    <b className="mr-1">วันที่</b>
                                                    <span>{toShortTHDate(inspection.order?.po_date)}</span>
                                                </p>
                                                <p>
                                                    <span>
                                                        <b className="mr-1">ผู้ขอ</b>
                                                        {inspection.order?.requisition.requester?.prefix?.name}{inspection.order?.requisition.requester?.firstname} {inspection.order?.requisition.requester?.lastname}
                                                    </span>
                                                    <span className="ml-1">
                                                        <b className="mr-1">ตำแหน่ง</b>
                                                        {inspection.order?.requisition.requester?.position?.name}
                                                        {inspection.order?.requisition.requester?.level ? inspection.order?.requisition.requester?.level?.name : ''}
                                                    </span>
                                                </p>
                                                <p>
                                                    <b className="mr-1">เรื่อง</b>
                                                    <span className="mr-2">{inspection.order?.requisition?.topic}</span>
                                                    <b className="mr-1">จำนวน</b>
                                                    <span className="mr-2">{currency.format(inspection.order?.item_count)} รายการ</span>
                                                    <b className="mr-1">เป็นเงินทั้งสิ้น</b>
                                                    <span className="mr-2">{currency.format(inspection.order?.net_total)} บาท</span>
                                                </p>
                                                <p className="text-sm">
                                                    <b className="mr-1">ตาม</b>
                                                    {inspection.order?.requisition?.budgets?.map(data => (
                                                        <span key={data.id} className="text-blue-600">
                                                            {data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <Row className="mb-2">
                                        <Col>
                                            <label htmlFor="">ประเภทสินค้า</label>
                                            <div className="form-control font-thin text-sm cursor-not-allowed">
                                                {inspection.order.requisition?.category?.name}
                                            </div>
                                        </Col>
                                    </Row>
                                    {/* รายละเอียดผู้จัดจำหน่าย */}
                                    <Row>
                                        <Col className="lg:pl-1 md:pl-1">
                                            <div className="form-control min-h-[150px] text-sm font-thin bg-[#EAD9D5] p-3">
                                                <p className="font-bold text-lg mr-1">{inspection.supplier?.name}</p>
                                                <p><b className="mr-1">เลขประจำตัวผู้เสียภาษี</b>{inspection.supplier?.tax_no}</p>
                                                <p>
                                                    <b className="mr-1">ที่อยู่</b>
                                                    {inspection.supplier?.address} {inspection.supplier?.moo ? ' หมู่' + inspection.supplier?.moo : ' หมู่ -'}
                                                    {inspection.supplier?.road ? ' ถนน' + inspection.supplier?.road : ' ถนน -'}
                                                </p>
                                                <p>
                                                    ต.{inspection.supplier?.tambon?.name} อ.{inspection.supplier?.amphur?.name}{' '}
                                                    จ.{inspection.supplier?.changwat?.name} {inspection.supplier?.zipcode}
                                                </p>
                                                <p>
                                                    <b className="mr-1">โทร.</b>{inspection.supplier?.tel} <b className="mx-1">Fax.</b>{inspection.supplier?.fax}
                                                </p>
                                                {/* <p><b className="mr-1">เลขที่บัญชีธนาคาร</b>{inspection.supplier?.bank_acc_no ? inspection.supplier?.bank_acc_no : '-'}</p>
                                                <p>
                                                    <b className="mr-1">ธนาคาร</b>{inspection.supplier?.bank ? inspection.supplier?.bank?.name : '-'}
                                                    <b className="mx-1">สาขา</b>{inspection.supplier?.bank_acc_branch ? inspection.supplier?.bank_acc_branch : '-'}
                                                </p> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="flex flex-col">
                                        <label htmlFor="">วันที่ตรวจรับ</label>
                                        <div className="form-control font-thin text-sm cursor-not-allowed">
                                            {toShortTHDate(inspection.inspect_date)}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label htmlFor="">ครบกำหนดวันที่</label>
                                    <div className="form-control font-thin text-sm cursor-not-allowed">
                                        {toShortTHDate(inspection.order?.deliver_date)}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label htmlFor="">เลขที่รายงานผล</label>
                                    <div className="form-control font-thin text-sm cursor-not-allowed">
                                        {inspection.report_no}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="flex flex-col">
                                        <label htmlFor="">วันที่รายงานผล</label>
                                        <div className="form-control font-thin text-sm cursor-not-allowed">
                                            {toShortTHDate(inspection.report_date)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-3 mb-2">
                                <Col>
                                    <div className="flex flex-col border p-2 rounded-md">
                                        <h1 className="font-bold text-lg mb-1">รายการสินค้า</h1>
                                        <ItemList
                                            items={inspection.details}
                                            showButtons={false}
                                        />

                                        <div className="flex flex-row justify-end items-center mb-2">
                                            <span className="font-bold mr-2">รวมเป็นเงิน</span>
                                            <div className="w-[12%]">
                                                <div className="form-control text-sm text-right font-bold">
                                                    {currency.format(inspection.total)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-end items-center mb-2">
                                            <span className="font-bold mr-2">ภาษีมูลค่าเพิ่ม</span>
                                            <div className="form-control text-sm text-right w-10 mr-1">
                                                {currency.format(inspection.vat_rate)}%
                                            </div>
                                            <div className="w-[12%]">
                                                <div className="form-control text-sm text-right font-bold">
                                                    {currency.format(inspection.vat)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-end items-center">
                                            <span className="text-lg font-bold mr-2">ยอดสุทธิ</span>
                                            <div className="w-[12%]">
                                                <div className="form-control text-right text-lg text-green-700 font-bold">
                                                    {currency.format(inspection.net_total)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    {/* <div className="border w-full pt-2 pb-4 px-2 rounded-md">
                                        <h3 className="font-bold text-lg mb-1">ผู้ตรวจรับ</h3>
                                        {order.requisition?.committees.length > 0 && order.requisition?.committees.map((committee, index) => (
                                            <div className="min-w-[50%] flex flex-row font-thin text-sm" key={committee.id}>
                                                <span className="min-w-[45%]">
                                                    {index+1}. {committee.employee?.prefix.name}{committee.employee?.firstname} {committee.employee?.lastname}
                                                </span>
                                                <span>
                                                    <b>ตำแหน่ง</b> {committee.employee?.position?.name}{committee.employee?.level && committee.employee?.level?.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div> */}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ textAlign: 'center' }}>
                                    <div className="flex flex-row justify-center">
                                        <DropdownButton title="ใบตรวจรับ" btnColor="primary" cssClass="mr-1">
                                            <DropdownItem>
                                                <Link to={`/preview/inspection/${id}`} target="_blank" className="text-success">
                                                    <i className="fas fa-print mr-1"></i>
                                                    พิมพ์ใบตรวจรับ
                                                </Link>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <a href={`${process.env.REACT_APP_API_URL}/inspections/${id}/form`} target="_blank" className="text-primary">
                                                    <i className="far fa-file-word mr-1"></i>
                                                    ดาวน์โหลดใบตรวจรับ
                                                </a>
                                            </DropdownItem>
                                        </DropdownButton>

                                        <DropdownButton title="รายงานผลการตรวจรับ" btnColor="primary" cssClass="mr-1">
                                            <DropdownItem>
                                                <Link to={`/preview/inspection/${id}/report`} target="_blank" className="text-success">
                                                    <i className="fas fa-print mr-1"></i>
                                                    พิมพ์รายงาน
                                                </Link>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <a href={`${process.env.REACT_APP_API_URL}/inspections/${id}/report`} target="_blank" className="text-primary">
                                                    <i className="far fa-file-word mr-1"></i>
                                                    ดาวน์โหลดรายงาน
                                                </a>
                                            </DropdownItem>
                                        </DropdownButton>
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

export default InspectionDetail
