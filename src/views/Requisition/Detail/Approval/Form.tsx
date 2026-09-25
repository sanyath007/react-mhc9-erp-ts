import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Col, Modal, Row } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup'
import { toast } from 'react-toastify';
import DatePicker from '../../../../components/ui/Forms/DatePicker'
import { useGetInitialFormDataQuery } from '../../../../features/services/approval/approvalApi'
import { store, update } from '../../../../features/slices/approval/approvalSlice'
import ErrorMessage from '../../../../components/ui/Forms/ErrorMessage';

const approvalSchema = Yup.object().shape({
    procuring_id: Yup.string().required('กรุณาเลือกวิธีการจัดหา'),
    report_no: Yup.string().required('กรุณาระบุเลขที่รายงาน'),
    report_date: Yup.string().required('กรุณาเลือกวันที่รายงาน'),
    directive_no: Yup.string().required('กรุณาระบุเลขที่คำสั่ง'),
    directive_date: Yup.string().required('กรุณาเลือกวันที่คำสั่ง'),
    deliver_date: Yup.string().required('กรุณาเลือกวันที่ส่งมอบ'),
});

const ModalApprovalForm = ({ isShow, onHide, approval, requisition }: any) => {
    const dispatch = useDispatch<any>();
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

    console.log(approval);

    const handleSubmit = (values, formik) => {
        if (approval) {
            dispatch(update({ id: approval.id, data: values }));
        } else {
            dispatch(store(values));
        }

        formik.resetForm();
        onHide();
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}

        >
            <Formik
                enableReinitialize
                initialValues={{
                    requisition_id: requisition.id,
                    procuring_id: approval ? approval.procuring_id : '1',
                    report_no: approval ? approval.report_no : '',
                    report_date: approval ? approval.report_date : '',
                    directive_no: approval ? approval.directive_no : '',
                    directive_date: approval ? approval.directive_date : '',
                    deliver_date: approval ? approval.deliver_date : '',
                    deliver_days: (approval && approval.deliver_days) ? approval.deliver_days : ''
                }}
                validationSchema={approvalSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => {
                    return (
                        <Form>
                            <Modal.Header className="border py-1 px-2">
                                <Modal.Title className="text-xl">บันทึกรายงานขอซื้อ/จ้าง</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="px-4">
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">วิธีการจัดหา</label>
                                        <select
                                            name="procuring_id"
                                            value={formik.values.procuring_id}
                                            onChange={formik.handleChange}
                                            className={`form-control text-sm ${formik.errors.procuring_id && formik.touched.procuring_id ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">-- เลือก --</option>
                                            {formData && formData.procurings.map(proc => (
                                                <option value={proc.id} key={proc.id}>{proc.name}</option>
                                            ))}
                                        </select>
                                        {(formik.errors.procuring_id && formik.touched.procuring_id) && (
                                            <ErrorMessage className='mt-1' message={formik.errors.procuring_id as string} />
                                        )}
                                    </Col>
                                    <Col className="mt-2">
                                        <div className="flex flex-col">
                                            <label htmlFor="">วันที่ส่งมอบ</label>
                                            <DatePicker
                                                value={formik.values.deliver_date}
                                                onChange={(date: string) => {
                                                    formik.setFieldValue('deliver_date', date);
                                                    setTimeout(() => formik.setFieldTouched('deliver_date', true), 300);
                                                }}
                                                inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !text-sm w-full ${formik.errors.deliver_date && formik.touched.deliver_date ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                                error={formik.errors.deliver_date && formik.touched.deliver_date ? (formik.errors.deliver_date as string) : undefined}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">เลขที่รายงาน</label>
                                        <input
                                            name="report_no"
                                            value={formik.values.report_no}
                                            onChange={formik.handleChange}
                                            className={`form-control text-sm ${formik.errors.report_no && formik.touched.report_no ? 'is-invalid' : ''}`}
                                        />
                                        {(formik.errors.report_no && formik.touched.report_no) && (
                                            <ErrorMessage className='mt-1' message={formik.errors.report_no as string} />
                                        )}
                                    </Col>
                                    <Col>
                                        <div className="flex flex-col">
                                            <label htmlFor="">วันที่รายงาน</label>
                                            <DatePicker
                                                value={formik.values.report_date}
                                                onChange={(date: string) => {
                                                    formik.setFieldValue('report_date', date);
                                                }}
                                                inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !text-sm w-full ${formik.errors.report_date && formik.touched.report_date ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                                error={formik.errors.report_date && formik.touched.report_date ? (formik.errors.report_date as string) : undefined}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">เลขที่คำสั่ง</label>
                                        <input
                                            name="directive_no"
                                            value={formik.values.directive_no}
                                            onChange={formik.handleChange}
                                            className={`form-control text-sm ${formik.errors.directive_no && formik.touched.directive_no ? 'is-invalid' : ''}`}
                                        />
                                        {(formik.errors.directive_no && formik.touched.directive_no) && (
                                            <ErrorMessage className='mt-1' message={formik.errors.directive_no as string} />
                                        )}
                                    </Col>
                                    <Col>
                                        <div className="flex flex-col">
                                            <label htmlFor="">วันที่คำสั่ง</label>
                                            <DatePicker
                                                value={formik.values.directive_date}
                                                onChange={(date: string) => {
                                                    formik.setFieldValue('directive_date', date);
                                                }}
                                                inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !text-sm w-full ${formik.errors.directive_date && formik.touched.directive_date ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                                error={formik.errors.directive_date && formik.touched.directive_date ? (formik.errors.directive_date as string) : undefined}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                {/* <Row className="mb-2">
                                    <Col className="mt-2">
                                        <label htmlFor="">ส่งมอบภายใน</label>
                                        <div className="form-control min-h-[34px] text-sm text-center bg-gray-100">
                                            {formik.values.deliver_days} วัน
                                        </div>
                                        {(formik.errors.deliver_days && formik.touched.deliver_days) && (
                                            <span className="text-red-500 text-sm">{formik.errors.deliver_days as string}</span>
                                        )}
                                    </Col>
                                </Row> */}
                            </Modal.Body>
                            <Modal.Footer className="py-1">
                                <button type="submit" className="btn btn-outline-primary btn-sm">
                                    บันทึก
                                </button>
                            </Modal.Footer>
                        </Form>
                    )
                }}
            </Formik>
        </Modal>
    )
}

export default ModalApprovalForm