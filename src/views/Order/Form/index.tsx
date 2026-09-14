import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Col, Row } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import {
    currency,
    currencyToNumber,
    calculateNetTotal,
    calculateVat,
    toShortTHDate,
    setFieldTouched
} from '../../../utils';
import { store, update } from '../../../features/slices/order/orderSlice';
import { useStyles } from '../../../hooks/useStyles';
import OrderItems from './OrderItems';
import ModalRequisitionList from '../../../components/Modals/Requisition';
import ModalSupplierList from '../../../components/Modals/Supplier';

const orderSchema = Yup.object().shape({
    po_no: Yup.string().required('กรุณาระุบเลขที่ใบสั่งซื้อ'),
    po_date: Yup.string().required('กรุณาเลือกวันที่ใบสั่งซื้อ'),
    requisition_id: Yup.string().required('กรุณาเลือกรายการคำขอ'),
    year: Yup.string().required('กรุณาเลือกปีงบประมาณ'),
    total: Yup.string().required('กรุณาระบุยอดรวมเป็นเงิน'),
    vat_rate: Yup.string().required('กรุณาระุบอัตราภาษีฯ'),
    vat: Yup.string().required('กรุณาระุบยอดภาษีฯ'),
    net_total: Yup.string().required('กรุณาระุบยอดยอดสุทธิ'),
    items: Yup.mixed().test('Items Count', 'ไม่พบการรายการสินค้า/บริการ', (val: any) => val.filter(item => !item.removed).length > 0),
});

const OrderForm = ({ id, order }: any) => {
    const classes = useStyles();
    const [cookie] = useCookies();
    const dispatch = useDispatch<any>();
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedYear, setSelectedYear] = useState(moment(`${cookie.budgetYear}-01-01`));
    const [showRequisitionModal, setShowRequisitionModal] = useState(false);
    const [selectedRequisition, setSelectedRequisition] = useState(null);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        if (order) {
            setSelectedRequisition(order.requisition);
            setSelectedSupplier(order.supplier);
        }
    }, [order]);

    const handleSelectRequisition = (formik, requisition) => {
        setSelectedRequisition(requisition);
        formik.setFieldValue('requisition_id', requisition.id);
        formik.setFieldValue('items', requisition.details);
        formik.setFieldValue('item_count', requisition.details.length);

        setFieldTouched(formik, 'requisition_id');

        /** คำนวณยอดสุทธิ */
        let netTotal = calculateNetTotal(requisition.details);
        formik.setFieldValue('net_total', currency.format(netTotal));

        /** คำนวณฐานภาษีและภาษีมูลค่าเพิ่ม */
        calcTotal(formik, netTotal, parseInt(formik.values.vat_rate, 10));

        /** เซต supplier_id และ selectedSupplier local state จากข้อมูล requisition */
        setSelectedSupplier(requisition.approvals[0].supplier);
        formik.setFieldValue('supplier_id', requisition.approvals[0].supplier_id);
    };

    const handleSelectSupplier = (formik, supplier) => {
        setSelectedSupplier(supplier);
        formik.setFieldValue('supplier_id', supplier.id);
    };

    const calcTotal = (formik, netTotal, vatRate) => {
        let _netTotal = currencyToNumber(netTotal);
        let vat = calculateVat(_netTotal, parseInt(vatRate, 10));

        formik.setFieldValue('vat', currency.format(vat));
        formik.setFieldValue('total', currency.format(_netTotal - vat));
    };

    const calcDeliverDate = (formik, fromDate, days) => {
        let deliverDate = moment(fromDate).add(days, "days").format('YYYY-MM-DD');

        formik.setFieldValue('deliver_date', toShortTHDate(deliverDate));
    };

    const handleSubmit = (values, formik) => {
        if (order) {
            dispatch(update({ id, data: values }));
        } else {
            dispatch(store(values));
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                po_no: order ? order.po_no : '',
                po_date: order ? order.po_date : '',
                requisition_id: order ? order.requisition_id : '',
                supplier_id: order ? order.supplier_id : '',
                item_count: order ? order.item_count : '',
                total: order ? order.total : '',
                vat_rate: order ? order.vat_rate : '7',
                vat: order ? order.vat : '',
                net_total: order ? order.net_total : '',
                deliver_days: order ? order.deliver_days : '30',
                deliver_date: order ? order.deliver_date : '',
                year: order ? order.year : cookie.budgetYear,
                items: order ? order.details : []
            }}
            validationSchema={orderSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <ModalRequisitionList
                            isShow={showRequisitionModal}
                            onHide={() => setShowRequisitionModal(false)}
                            onSelect={(requisition) => handleSelectRequisition(formik, requisition)}
                        />

                        <ModalSupplierList
                            isShow={showSupplierModal}
                            onHide={() => setShowSupplierModal(false)}
                            onSelect={(supplier) => handleSelectSupplier(formik, supplier)}
                        />

                        <Row className="mb-2">
                            <Col md={6}>
                                <label htmlFor="">เลขที่คำขอ <span className="text-red-500">*</span></label>
                                <div className="input-group">
                                    <div className="min-h-[34px] form-control font-thin text-sm bg-gray-100">
                                        {selectedRequisition && <p><b>เลขที่</b> {selectedRequisition.pr_no}<b className="ml-2">วันที่</b> {toShortTHDate(selectedRequisition.pr_date)}</p>}
                                    </div>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowRequisitionModal(true)}>
                                        <FaSearch />
                                    </button>
                                </div>
                                {(formik.errors.requisition_id && formik.touched.requisition_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.requisition_id as string}</span>
                                )}
                            </Col>
                            <Col md={3}>
                                <label htmlFor="">เลขที่ใบสั่งซื้อ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="po_no"
                                    value={formik.values.po_no}
                                    onChange={formik.handleChange}
                                    className="form-control font-thin text-sm"
                                />
                                {(formik.errors.po_no && formik.touched.po_no) && (
                                    <span className="text-red-500 text-sm">{formik.errors.po_no as string}</span>
                                )}
                            </Col>
                            <Col md={3}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่ใบสั่งซื้อ <span className="text-red-500">*</span></label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date);
                                            formik.setFieldValue('po_date', date.format('YYYY-MM-DD'));
                                            setTimeout(() => formik.setFieldTouched('po_date', true), 600);

                                            calcDeliverDate(formik, date.format('YYYY-MM-DD'), formik.values.deliver_days);
                                        }}
                                        className={classes.muiTextFieldInput}
                                    />
                                </div>
                                {(formik.errors.po_date && formik.touched.po_date) && (
                                    <span className="text-red-500 text-sm">{formik.errors.po_date as string}</span>
                                )}
                            </Col>
                        </Row>

                        {selectedRequisition && (
                            <Row className="mb-2">
                                <Col>
                                    <Row>
                                        <Col md={8} className="pr-2">
                                            <div className="border rounded-md text-sm font-thin px-3 py-2 bg-orange-200 min-h-[160px]">
                                                <h4 className="font-bold underline mb-1">รายละเอียดคำขอซื้อ</h4>
                                                <p>
                                                    <b>เรื่อง</b> {selectedRequisition.topic}
                                                </p>
                                                <p>
                                                    <b>จำนวน</b> {currency.format(selectedRequisition.item_count)} รายการ
                                                    <b className="ml-2">รวมเป็นเงิน</b> {currency.format(selectedRequisition.net_total)} บาท
                                                </p>
                                                <p>
                                                    <b>ผู้ขอ</b> {selectedRequisition.requester?.prefix?.name}{selectedRequisition.requester?.firstname} {selectedRequisition.requester?.lastname}
                                                    <b className="ml-2">ตำแหน่ง</b> {selectedRequisition.requester?.position?.name}{selectedRequisition.requester?.level && selectedRequisition.requester?.level?.name}
                                                    <b className="ml-2">หน่วยงาน</b> {selectedRequisition.division?.name}
                                                </p>
                                                <p>
                                                    <span><b>เหตุผลที่ขอ</b> {selectedRequisition.reason}</span>
                                                    <span className="text-sm text-blue-600 ml-1">ตาม
                                                        {selectedRequisition.budgets.map(data => (
                                                            <>
                                                                <span>{data.budget?.activity?.project?.plan?.name}</span>
                                                                <span className="ml-1">{data.budget?.activity?.project?.name}</span>
                                                                <span className="ml-1">{data.budget?.activity?.name}</span>
                                                            </>
                                                        ))}
                                                    </span>
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={4} className="pl-2">
                                            <div className="border rounded-md text-sm font-thin px-3 py-2 bg-green-300 min-h-[160px]">
                                                <h4 className="font-bold underline mb-1">ผู้จัดจำหน่าย</h4>
                                                {selectedSupplier && (
                                                    <div className="mb-1">
                                                        {selectedSupplier.name}
                                                        <p><b>เลขประจำตัวผู้เสียภาษี</b> {selectedSupplier.tax_no}</p>
                                                        <p><b>โทร.</b> {selectedSupplier.tel}</p>
                                                        <p>
                                                            <b>ที่อยู่</b> {selectedSupplier.address}
                                                            <span className="ml-1">หมู่ {selectedSupplier.moo ? selectedSupplier.moo : '-'}</span>
                                                            <span className="ml-1">ถนน {selectedSupplier.road ? selectedSupplier.road : '-'}</span>
                                                            <span className="ml-1">
                                                                <span className="ml-1">ต. {selectedSupplier.tambon ? selectedSupplier.tambon.name : '-'}</span>
                                                                <span className="ml-1">อ. {selectedSupplier.amphur ? selectedSupplier.amphur.name : '-'}</span>
                                                                <span className="ml-1">จ. {selectedSupplier.changwat ? selectedSupplier.changwat.name : '-'}</span>
                                                            </span>
                                                            <span className="ml-1">{selectedSupplier.zipcode ? selectedSupplier.zipcode : '-'}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )}

                        <Row className="mb-2 text-sm">
                            <Col>
                                <div className="flex flex-col border p-2 rounded-md">
                                    <h1 className="font-bold text-lg mb-1">รายการสินค้า/บริการ <span className="text-red-500">*</span></h1>

                                    <OrderItems items={formik.values.items} />

                                    {(formik.errors.items && formik.touched.items) && (
                                        <span className="text-red-500 text-sm">{formik.errors.items as string}</span>
                                    )}

                                    {/* Summary */}
                                    <Row className="mb-3">
                                        <Col md={4}>
                                            <div className="flex items-center justify-end p-0 mt-1">
                                                <label htmlFor="" className="mr-2">ปีงบประมาณ</label>
                                                <div className="w-[40%]">
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
                                            </div>
                                            <div className="flex items-center justify-end p-0 mt-1">
                                                <label htmlFor="" className="mr-2">กำหนดส่งมอบ</label>
                                                <div className="flex justify-center items-center gap-2 w-[40%]">
                                                    <input
                                                        type="number"
                                                        name="deliver_days"
                                                        value={formik.values.deliver_days}
                                                        onChange={(e) => {
                                                            formik.handleChange(e);
                                                            formik.values.po_date && calcDeliverDate(formik, formik.values.po_date, e.target.value);
                                                        }}
                                                        className="form-control text-sm text-center min-h-[34px]"
                                                    />
                                                    <span>วัน</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end p-0 mt-1">
                                                <label htmlFor="" className="mr-2">ครบกำหนดวันที่</label>
                                                <div className="w-[40%]">
                                                    <div className="form-control text-sm text-center min-h-[34px] bg-gray-100">
                                                        {formik.values.deliver_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div className="flex items-center justify-end p-0 mt-1">
                                                <span className="mr-2 font-bold">รวมเป็นเงิน</span>
                                                <input
                                                    type="text"
                                                    name="total"
                                                    value={formik.values.total}
                                                    onChange={formik.handleChange}
                                                    className="form-control font-bold text-sm w-[18%] text-right"
                                                />
                                                {/* <div className="w-[11%]"></div> */}
                                            </div>
                                            <div className="flex items-center justify-end p-0 mt-1">
                                                <span className="mr-2">ภาษีมูลค่าเพิ่ม</span>
                                                <select
                                                    name="vat_rate"
                                                    value={formik.values.vat_rate}
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        calcTotal(formik, formik.values.net_total, e.target.value)
                                                    }}
                                                    className="form-control font-thin text-sm w-[8%] text-center mr-1"
                                                >
                                                    <option value="1">1%</option>
                                                    <option value="7">7%</option>
                                                    <option value="10">10%</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    name="vat"
                                                    value={formik.values.vat}
                                                    onChange={formik.handleChange}
                                                    className="form-control font-thin text-sm w-[18%] text-right"
                                                />
                                                {/* <div className="w-[11%]"></div> */}
                                            </div>
                                            <div className="flex items-center justify-end p-0 mt-1">
                                                <span className="mr-2 text-lg font-bold">ยอดสิทธิ</span>
                                                <input
                                                    type="text"
                                                    name="net_total"
                                                    value={formik.values.net_total}
                                                    onChange={formik.handleChange}
                                                    className="form-control text-green-600 text-lg font-bold w-[18%] text-right"
                                                />
                                                {/* <div className="w-[11%]"></div> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center">
                                <button type="submit" className={`btn ${order ? 'btn-outline-dark' : 'btn-outline-primary'} text-sm`}>
                                    {order ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default OrderForm
