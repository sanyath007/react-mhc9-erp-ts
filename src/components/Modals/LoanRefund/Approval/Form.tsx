import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { DatePicker } from '@material-ui/pickers'
import { Col, Modal, Row } from 'react-bootstrap'
import moment from 'moment'
import { approve } from '../../../../features/slices/loan-refund/loanRefundSlice'
import { useGetLatestBillNoQuery } from '../../../../features/services/loan-refund/loanRefundApi'

const approvalSchema = Yup.object().shape({
    contract_id: Yup.string().required(),
    approved_date: Yup.string().required('กรุณาเลือกวันที่เคลียร์'),
    bill_no: Yup.string().required('กรุณาระบุเลขที่ใบรับใบสำคัญ'),
    bill_date: Yup.string().required('กรุณาระบุวันที่ใบรับใบสำคัญ'),
});

const ModalApprovalForm = ({ isShow, onHide, refund }: any) => {
    const dispatch = useDispatch<any>();
    const [selectedApprovedDate, setSelectedApprovedDate] = useState(moment());
    const [selectedBillDate, setSelectedBillDate] = useState(moment());
    const [billNo, setBillNo] = useState('');
    const { data, isLoading } = useGetLatestBillNoQuery();

    // Generate bill no from latest bill no
    useEffect(() => {
        if (data) {
            const latestBillNo = data[0].toString().split('/');
            const nextBillNo = latestBillNo[0] ? String(Number(latestBillNo[0]) + 1).padStart(2, '0') : '01';

            setBillNo(`${nextBillNo}/${latestBillNo[1]}`);
        }
    }, [data]);

    const handleSubmit = (values, formik) => {
        dispatch(approve({ id: refund?.id, data: values }));

        onHide();
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            // size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>บันทึกเคลียร์เงินยืม</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        contract_id: refund ? refund?.contract?.id : '',
                        approved_date: '',
                        bill_no: billNo,
                        bill_date: '',
                    }}
                    validationSchema={approvalSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form className="px-3 pt-3">
                                <Row className="mb-3">
                                    <Col md={12} className="text-lg text-blue-700">
                                        <div className="flex flex-row items-center">
                                            <label htmlFor="" className="w-[45%]">เลขที่สัญญา :</label>
                                            <div className="w-3/6 text-center">
                                                {refund?.contract?.contract_no}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <div className="flex flex-row items-center">
                                            <label htmlFor="" className="w-[45%]">วันที่เคลียร์ (ผอ.อนุมัติ) :</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedApprovedDate}
                                                onChange={(date) => {
                                                    setSelectedApprovedDate(date);
                                                    formik.setFieldValue('approved_date', date.format('YYYY-MM-DD'));
                                                }}
                                                TextFieldComponent={(props: any) => (
                                                    <input {...props} className="form-control text-sm text-center w-[50%]" />
                                                )}
                                            />
                                        </div>
                                        {(formik.errors.approved_date && formik.touched.approved_date) && (
                                            <span className="text-red-500 text-xs">{formik.errors.approved_date as string}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <div className="flex flex-row items-center">
                                            <label htmlFor="" className="w-[45%]">เลขที่ใบรับใบสำคัญ :</label>
                                            <input
                                                name="bill_no"
                                                value={formik.values.bill_no}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm text-center w-[50%]"
                                                placeholder="ระบุเลขที่ใบสำคัญ"
                                            />
                                        </div>
                                        {(formik.errors.bill_no && formik.touched.bill_no) && (
                                            <span className="text-red-500 text-xs">{formik.errors.bill_no as string}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <div className="flex flex-row items-center">
                                            <label htmlFor="" className="w-[45%]">วันที่ใบรับใบสำคัญ :</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedBillDate}
                                                onChange={(date) => {
                                                    setSelectedBillDate(date);
                                                    formik.setFieldValue('bill_date', date.format('YYYY-MM-DD'));
                                                }}
                                                TextFieldComponent={(props: any) => (
                                                    <input {...props} className="form-control text-sm text-center w-[50%]" />
                                                )}
                                            />
                                        </div>
                                        {(formik.errors.bill_date && formik.touched.bill_date) && (
                                            <span className="text-red-500 text-xs">{formik.errors.bill_date as string}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="flex flex-row items-center">
                                            <p className="w-[45%]"></p>
                                            <button
                                                type="submit"
                                                className="btn btn-outline-primary float-right"
                                                disabled={isLoading}
                                            >
                                                บันทึก
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default ModalApprovalForm
