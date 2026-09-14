import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { getOrder } from '../../features/slices/order/orderSlice'
import { currency, toShortTHDate } from '../../utils'
import ItemList from './ItemList'
import Loading from '../../components/ui/Loading'

const OrderDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { order, isLoading } = useSelector((state: any) => state.order);

    useEffect(() => {
        if (id) dispatch(getOrder(id));
    }, [dispatch, id]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>จัดซื้อจัดจ้าง</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/order' }}>รายการใบสั่งซื้อ/จ้าง</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดใบสั่งซื้อ/จ้าง</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายละเอียดใบสั่งซื้อ/จ้าง</h2>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && (
                        <div className="text-center"><Loading /></div>
                    )}

                    {!isLoading && order && (
                        <>
                            <Row className="mb-2">
                                <Col md={3}>
                                    <label htmlFor="">เลขที่ใบสั่ง{order.requisition?.order_type_id === 1 ? 'ซื้อ' : 'จ้าง'}</label>
                                    <div className="form-control text-sm font-thin bg-gray-100">{order.po_no}</div>
                                </Col>
                                <Col md={3}>
                                    <div className="flex flex-col">
                                        <label htmlFor="">วันที่ใบสั่ง{order.requisition?.order_type_id === 1 ? 'ซื้อ' : 'จ้าง'}</label>
                                        <div className="form-control text-sm font-thin bg-gray-100">
                                            {toShortTHDate(order.po_date)}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <label htmlFor="">ประเภทสินค้า</label>
                                    <div className="form-control min-h-[34px] text-sm font-thin bg-gray-100">
                                        {order.requisition?.category?.name}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={8}>
                                    {/* รายละเอียดคำขอซื้อ */}
                                    <Row>
                                        <Col>
                                            <div className="form-control min-h-[140px] text-sm font-thin bg-gray-100">
                                                <h4 className="font-bold underline mb-1">รายละเอียดคำขอซื้อ</h4>
                                                <p>
                                                    <label className="font-bold mr-1">เลขที่คำขอ</label>
                                                    <span className="mr-2">{order.requisition?.pr_no}</span>
                                                    <label className="font-bold mr-1">วันที่</label>
                                                    <span>{toShortTHDate(order.requisition?.pr_date)}</span>
                                                </p>
                                                <p>
                                                    <label className="font-bold mr-1">เรื่อง</label>
                                                    <span className="mr-2">{order.requisition?.topic}</span>
                                                    <label className="font-bold mr-1">ปีงบ</label>
                                                    <span>{order.requisition?.year}</span>
                                                </p>
                                                <p>
                                                    <label className="font-bold mr-1">งบประมาณ</label>
                                                    <span>{order.requisition?.budget?.name}</span>
                                                </p>
                                                <p>
                                                    <label className="font-bold mr-1">โครงการ</label>
                                                    <span className="mr-2">
                                                        {order.requisition?.project ? order.requisition?.project?.name : '-'}
                                                    </span>
                                                </p>
                                                <p>
                                                    <label className="font-bold mr-1">ผู้ขอ/เจ้าของโครงการ</label>
                                                    <span className="mr-2">
                                                        {order.requisition?.requester?.firstname} {order.requisition?.requester?.lastname}
                                                    </span>
                                                    <label className="font-bold mr-1">หน่วยงาน</label>
                                                    <span>{order.requisition?.division?.name}</span>
                                                </p>
                                                <p>
                                                    <label className="font-bold mr-1">เหตุผลที่ขอ</label>
                                                    <span>{order.requisition?.reason}</span>
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    {/* รายละเอียดผู้จัดจำหน่าย */}
                                    <Row>
                                        <Col>
                                            <div className="form-control min-h-[140px] text-sm font-thin bg-green-300">
                                                <h4 className="font-bold underline mb-1">ผู้จัดจำหน่าย</h4>
                                                <p>{order.supplier?.name}</p>
                                                <p>
                                                    <b className="mr-1">ที่อยู่</b>
                                                    {order.supplier?.address} {order.supplier?.moo ? ' หมู่' + order.supplier?.moo : ' หมู่ -'}
                                                    {order.supplier?.road ? ' ถนน' + order.supplier?.road : ' ถนน -'}
                                                </p>
                                                <p>
                                                    ต.{order.supplier?.tambon?.name} อ.{order.supplier?.amphur?.name}{' '}
                                                    จ.{order.supplier?.changwat?.name} {order.supplier?.zipcode}
                                                </p>
                                                <p>
                                                    <b className="mr-1">โทร.</b>{order.supplier?.tel} <b className="mx-1">Fax.</b>{order.supplier?.fax}
                                                </p>
                                                <p><b className="mr-1">เลขประจำตัวผู้เสียภาษี</b>{order.supplier?.tax_no}</p>
                                                <p><b className="mr-1">เลขที่บัญชีธนาคาร</b>{order.supplier?.bank_acc_no ? order.supplier?.bank_acc_no : '-'}</p>
                                                <p>
                                                    <b className="mr-1">ธนาคาร</b>{order.supplier?.bank ? order.supplier?.bank?.name : '-'}
                                                    <b className="mx-1">สาขา</b>{order.supplier?.bank_acc_branch ? order.supplier?.bank_acc_branch : '-'}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <div className="flex flex-col border p-2 rounded-md">
                                        <h1 className="font-bold text-lg mb-1">รายการสินค้า</h1>
                                        <ItemList
                                            items={order.details}
                                            showButtons={false}
                                        />

                                        <Row>
                                            <Col md={4}>
                                                <div className="flex flex-row justify-end items-center mb-2">
                                                    <span className="mr-2">ปีงบประมาณ</span>
                                                    <div className="w-[40%]">
                                                        <div className="form-control text-sm float-right text-center bg-gray-100">
                                                            {order.year ? order.year + 543 : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-end items-center mb-2">
                                                    <span className="mr-2">กำหนดส่งมอบ</span>
                                                    <div className="w-[40%]">
                                                        <div className="form-control text-sm min-h-[34px] float-right text-center bg-gray-100">
                                                            {currency.format(order.deliver_days)} วัน
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-end items-center mb-2">
                                                    <span className="mr-2">ครบกำหนดวันที่</span>
                                                    <div className="w-[40%]">
                                                        <div className="form-control text-sm min-h-[34px] float-right text-center bg-gray-100">
                                                            {toShortTHDate(order.deliver_date)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={8}>
                                                <div className="flex flex-row justify-end items-center mb-2">
                                                    <span className="mr-2 text-sm font-bold">รวมเป็นเงิน</span>
                                                    <div className="w-[18%]">
                                                        <div className="form-control font-bold float-right text-sm text-right bg-gray-100">
                                                            {currency.format(order.total)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-end items-center mb-2">
                                                    <span className="mr-2">ภาษีมูลค่าเพิ่ม</span>
                                                    <div className="form-control text-sm float-right text-right w-10 mr-1 bg-gray-100">
                                                        {currency.format(order.vat_rate)}%
                                                    </div>
                                                    <div className="w-[18%]">
                                                        <div className="form-control text-sm float-right text-right bg-gray-100">
                                                            {currency.format(order.vat)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-end items-center">
                                                    <span className="mr-2 text-lg font-bold">ยอดสุทธิ</span>
                                                    <div className="w-[18%]">
                                                        <div className="form-control font-bold text-lg text-green-600 text-right float-right bg-gray-100">
                                                            {currency.format(order.net_total)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
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
                            <Row className="mb-2">
                                <Col style={{ textAlign: 'center' }}>
                                    <Link to={`/preview/${id}`} className="btn btn-success">
                                        พิมพ์ใบขอซื้อ
                                    </Link>
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
