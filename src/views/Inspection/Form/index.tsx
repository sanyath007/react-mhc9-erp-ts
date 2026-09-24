import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { DatePicker } from '@material-ui/pickers';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import {
    currency,
    currencyToNumber,
    calculateNetTotal,
    calculateVat,
    toShortTHDate,
    setFieldTouched
} from '../../../utils';
import { useStyles } from '../../../hooks/useStyles';
import { store, update } from '../../../features/slices/inspection/inspectionSlice';
import OrderItems from './OrderItems';
import ModalOrderList from '../../../components/Modals/Order';

const inspectionSchema = Yup.object().shape({
    order_id: Yup.string().required('กรุณาเลือกใบสั่งซื้อ/จ้าง'),
    deliver_no: Yup.string().required('กรุณาระบุเลขที่ใบส่งสินค้า'),
    deliver_date: Yup.string().required('กรุณาเลือกวันที่ใบส่งสินค้า'),
    inspect_date: Yup.string().required('กรุณาเลือกวันที่ตรวจรับ'),
    report_no: Yup.string().required('กรุณาระบุเลขที่รายงานผล'),
    report_date: Yup.string().required('กรุณาเลือกวันที่รายงานผล'),
    total: Yup.string().required('กรุณาระบุรวมเป็นเงิน'),
    vat_rate: Yup.string().required('กรุณาระบุอัตราภาษีมูลค่าเพิ่ม'),
    vat: Yup.string().required('กรุณาระบุภาษีมูลค่าเพิ่ม'),
    net_total: Yup.string().required('กรุณาระบุยอดสิทธิ'),
});

const InspectionForm = ({ id, inspection }: { id?: any, inspection?: any }) => {
    const [cookies] = useCookies();
    const classes = useStyles();
    const dispatch = useDispatch<any>();
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedYear, setSelectedYear] = useState(moment());
    const [selectedDeliverDate, setSelectedDeliverDate] = useState(moment());
    const [selectedInspectDate, setSelectedInspectDate] = useState(moment());
    const [selectedReportDate, setSelectedReportDate] = useState(moment());
    const [supplier, setSupplier] = useState(null);

    useEffect(() => {
        if (inspection) {
            setSelectedOrder(inspection.order);
            setSelectedYear(moment(`${inspection.year}-09-01`));
            setSelectedDeliverDate(moment(inspection.deliver_date));
            setSelectedInspectDate(moment(inspection.inspect_date));
            setSelectedReportDate(moment(inspection.report_date));
            setSupplier(inspection.supplier);
        }
    }, [inspection]);
    
    const handleSelectOrder = (formik, order) => {
        setSelectedOrder(order);
        setSupplier(order.supplier);

        /** Set values to related order's fields */
        formik.setFieldValue('order_id', order.id);
        formik.setFieldValue('supplier_id', order.supplier_id);
        formik.setFieldValue('item_count', order.details.length);
        formik.setFieldValue('item_received', order.details.length);
        formik.setFieldValue('items', order.details);

        setFieldTouched(formik, 'order_id');

        /** คำนวณยอดสุทธิ */
        let netTotal = calculateNetTotal(order.details);
        formik.setFieldValue('net_total', currency.format(netTotal));
        
        /** คำนวณฐานภาษีและภาษีมูลค่าเพิ่ม */
        calcTotal(formik, netTotal, parseInt(formik.values.vat_rate, 10));
    };

    const calcTotal = (formik, netTotal, vatRate) => {
        let _netTotal = currencyToNumber(netTotal);
        let vat = calculateVat(_netTotal, parseInt(vatRate, 10));

        formik.setFieldValue('vat', currency.format(vat));
        formik.setFieldValue('total', currency.format(_netTotal - vat));
    };

    const handleReceive = (formik, id, received) => {
        /** Get received item from items property of formik */
        const receivedItem = formik.values.items.find(item => item.id === id);

        /** Create newItems by replacing item that have same id with receivedItem */
        const newItem = formik.values.items.map(item => {
            if (item.id === id) {
                return inspection
                            ? { ...receivedItem, is_received: received ? 1 : 0, updated: true }
                            : { ...receivedItem, is_received: received ? 1 : 0 };
            }

            return item;
        });

        /** Update items and item_received properties of formik */
        formik.setFieldValue('items', newItem);
        formik.setFieldValue('item_received', countReceivedItem(newItem));
    };

    const countReceivedItem = (items = []) => {
        return items.reduce((sum, item) => sum = item.is_received === 1 ? sum + 1 : sum + 0, 0);
    };

    const handleSubmit = (values, formik) => {
        if (inspection) {
            dispatch(update({ id, data: values }))
        } else {
            dispatch(store(values));
        }
    };

    return (
        <Formik
            initialValues={{
                order_id: inspection ? inspection.order_id : '',
                deliver_no: inspection ? inspection.deliver_no : '',
                deliver_date: inspection ? inspection.deliver_date : '',
                inspect_date: inspection ? inspection.inspect_date : '',
                report_no: inspection ? inspection.report_no : '',
                report_date: inspection ? inspection.report_date : '',
                supplier_id: inspection ? inspection.supplier_id : '',
                year: inspection ? inspection.year : cookies.budgetYear,
                item_count: inspection ? inspection.item_count : '',
                item_received: inspection ? inspection.item_received : '',
                total: inspection ? inspection.total : '',
                vat_rate: inspection ? inspection.vat_rate : '7',
                vat: inspection ? inspection.vat : '',
                net_total: inspection ? inspection.net_total : '',
                status: inspection ? inspection.status : '1',
                items: inspection ? inspection.details : []
            }}
            validationSchema={inspectionSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <ModalOrderList
                            isShow={showOrderModal}
                            onHide={() => setShowOrderModal(false)}
                            onSelect={(order) => handleSelectOrder(formik, order)}
                        />

                        <Row className="mb-2">
                            <Col md={5}>
                                <label htmlFor="">ใบสั่งซื้อ/จ้าง</label>
                                <div className="input-group">
                                    <div className={`min-h-[34px] form-control font-thin text-sm bg-gray-100 ${inspection ? 'cursor-not-allowed' : ''}`}>
                                        {selectedOrder && (
                                            <p>
                                                เลขที่ <b className="mr-2">{selectedOrder.po_no}</b>
                                                วันที่ <b>{toShortTHDate(selectedOrder.po_date)}</b>
                                            </p>
                                        )}
                                    </div>
                                    {!inspection && (
                                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowOrderModal(true)}>
                                            <FaSearch />
                                        </button>
                                    )}
                                </div>
                                {(formik.errors.order_id && formik.touched.order_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.order_id as string}</span>
                                )}
                            </Col>
                            <Col md={2}>
                                <label htmlFor="">ปีงบ</label>
                                <DatePicker
                                    format="YYYY"
                                    views={['year']}
                                    value={selectedYear}
                                    onChange={(date) => {
                                        setSelectedYear(date);

                                        formik.setFieldValue('year', moment(date).year())
                                    }}
                                    className={classes.muiTextFieldInput}
                                />
                                {(formik.errors.year && formik.touched.year) && (
                                    <span className="text-red-500 text-sm">{formik.errors.year as string}</span>
                                )}
                            </Col>
                            <Col md={3}>
                                <label htmlFor="">เลขที่ใบส่งสินค้า</label>
                                <input
                                    type="text"
                                    name="deliver_no"
                                    value={formik.values.deliver_no}
                                    onChange={formik.handleChange}
                                    className="form-control font-thin text-sm"
                                />
                                {(formik.errors.deliver_no && formik.touched.deliver_no) && (
                                    <span className="text-red-500 text-sm">{formik.errors.deliver_no as string}</span>
                                )}
                            </Col>
                            <Col md={2}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่ส่งสินค้า</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={selectedDeliverDate}
                                        onChange={(date) => {
                                            setSelectedDeliverDate(date);
                                            formik.setFieldValue('deliver_date', date.format('YYYY-MM-DD'));
                                        }}
                                        className={classes.muiTextFieldInput}
                                    />
                                </div>
                                {(formik.errors.deliver_date && formik.touched.deliver_date) && (
                                    <span className="text-red-500 text-sm">{formik.errors.deliver_date as string}</span>
                                )}
                            </Col>
                        </Row>

                        {selectedOrder && (
                            <Row className="mb-2">
                                <Col md={8} className="lg:pr-1 md:pr-1">
                                    <div className="min-h-[180px] border rounded-md text-sm font-thin px-3 py-2 bg-[#D8E2DC]">
                                        <h4 className="font-bold underline my-1">รายละเอียดคำขอซื้อ</h4>
                                        <p>
                                            <span>
                                                <b>ผู้ขอ</b> {selectedOrder.requisition.requester?.prefix?.name}{selectedOrder.requisition.requester?.firstname} {selectedOrder.requisition.requester?.lastname}
                                            </span>
                                            <span className="ml-1">
                                                <b>ตำแหน่ง</b> {selectedOrder.requisition.requester?.position?.name}
                                                {selectedOrder.requisition.requester?.level ? selectedOrder.requisition.requester?.level?.name : ''}
                                            </span>
                                        </p>
                                        <p>
                                            <span>
                                                <b>เรื่อง</b> {selectedOrder.requisition.topic} จำนวน {currency.format(selectedOrder.item_count)} รายการ 
                                                รวมเป็นเงินทั้งสิ้น {currency.format(selectedOrder.net_total)} บาท
                                            </span>
                                        </p>
                                        <p className="text-sm">
                                            <b className="mr-1">ตาม</b>
                                            {selectedOrder?.requisition?.budgets?.map(data => (
                                                <span key={data.id} className="text-blue-600">
                                                    {data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4} className="lg:pl-1 md:pl-1">
                                    <div className="min-h-[180px] border rounded-md text-sm font-thin px-3 py-2 bg-[#EAD9D5]">
                                        <h4 className="font-bold underline my-1">ผู้จัดจำหน่าย</h4>
                                        {supplier && (
                                            <div className="font-thin text-sm">
                                                <b className="font-bold">{supplier.name}</b>
                                                <p><b className="mr-1">เลขประจำตัวผู้เสียภาษี</b>{supplier.tax_no}</p>
                                                <p>
                                                    <b className="mr-1">ที่อยู่</b>
                                                    <span>{supplier.address}</span>
                                                    <span><span className="mx-1">หมู่</span>{supplier.moo ? supplier.moo : '-'}</span>
                                                    <span><span className="mx-1">ถนน</span>{supplier.raod ? supplier.raod : '-'}</span>
                                                </p>
                                                <p>
                                                    <span><span className="mr-1">ต.</span>{supplier.tambon?.name}</span>
                                                    <span><span className="mx-1">อ.</span>{supplier.amphur?.name}</span>
                                                    <span><span className="mx-1">จ.</span>{supplier.changwat?.name}</span>
                                                    <span className="ml-1">{supplier.zipcode}</span>
                                                </p>
                                                <p>
                                                    <b className="mr-1">โทร.</b>{supplier.tel}
                                                    <b className="mx-1 max-[768px]:hidden">Fax.</b>{supplier.fax}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        )}

                        <Row className="mb-3">
                            <Col md={3}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่ตรวจรับ</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={selectedInspectDate}
                                        onChange={(date) => {
                                            setSelectedInspectDate(date);
                                            formik.setFieldValue('inspect_date', date.format('YYYY-MM-DD'));
                                        }}
                                        className={classes.muiTextFieldInput}
                                    />
                                </div>
                                {(formik.errors.inspect_date && formik.touched.inspect_date) && (
                                    <span className="text-red-500 text-sm">{formik.errors.inspect_date as string}</span>
                                )}
                            </Col>
                            <Col md={3}>
                                <label htmlFor="">ครบกำหนดวันที่</label>
                                <div className="form-control text-sm text-center min-h-[34px] bg-gray-100 cursor-not-allowed">
                                    {toShortTHDate(selectedOrder?.deliver_date)}
                                </div>
                            </Col>
                            <Col md={3}>
                                <label htmlFor="">เลขที่รายงานผล</label>
                                <input
                                    type="text"
                                    name="report_no"
                                    value={formik.values.report_no}
                                    onChange={formik.handleChange}
                                    className="form-control font-thin text-sm"
                                />
                                {(formik.errors.report_no && formik.touched.report_no) && (
                                    <span className="text-red-500 text-sm">{formik.errors.report_no as string}</span>
                                )}
                            </Col>
                            <Col md={3}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่รายงานผล</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={selectedReportDate}
                                        onChange={(date) => {
                                            setSelectedReportDate(date);
                                            formik.setFieldValue('report_date', date.format('YYYY-MM-DD'));
                                        }}
                                        className={classes.muiTextFieldInput}
                                    />
                                </div>
                                {(formik.errors.report_date && formik.touched.report_date) && (
                                    <span className="text-red-500 text-sm">{formik.errors.report_date as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2 text-sm">
                            <Col>
                                <div className="flex flex-col border p-2 rounded-md">
                                    <h4 className="font-bold text-lg mb-1">รายการสินค้า</h4>

                                    <OrderItems
                                        items={formik.values.items}
                                        onReceiveItem={(id, received) => handleReceive(formik, id, received)}
                                    />

                                    <div className="flex items-center justify-end p-0 mt-1">
                                        <span className="font-bold mr-2">รวมเป็นเงิน</span>
                                        <input
                                            type="text"
                                            name="total"
                                            value={formik.values.total}
                                            onChange={formik.handleChange}
                                            className="form-control font-bold text-sm w-[12%] text-right"
                                        />
                                        <div className="w-[8%]"></div>
                                    </div>
                                    <div className="flex items-center justify-end p-0 mt-1">
                                        <span className="font-bold mr-2">ภาษีมูลค่าเพิ่ม</span>
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
                                            className="form-control font-bold text-sm w-[12%] text-right"
                                        />
                                        <div className="w-[8%]"></div>
                                    </div>
                                    <div className="flex items-center justify-end p-0 mt-1">
                                        <span className="text-lg font-bold mr-2">ยอดสิทธิ</span>
                                        <input
                                            type="text"
                                            name="net_total"
                                            value={formik.values.net_total}
                                            onChange={formik.handleChange}
                                            className="form-control w-[12%] text-right text-lg text-green-700 font-bold"
                                        />
                                        <div className="w-[8%]"></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center">
                                <button type="submit" className={`btn ${inspection ? 'btn-outline-dark' : 'btn-outline-primary'} text-sm`}>
                                    {inspection ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default InspectionForm
