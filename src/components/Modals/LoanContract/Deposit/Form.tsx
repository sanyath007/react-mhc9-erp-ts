import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { DatePicker } from '@material-ui/pickers'
import { Col, Modal, Row } from 'react-bootstrap'
import moment from 'moment'
import { deposit } from '../../../../features/slices/loan-contract/loanContractSlice'

const depositSchema = Yup.object().shape({
    contract_id: Yup.string().required(),
    deposited_date: Yup.string().required(),
    refund_date: Yup.string().required()
});

const ModalDepositForm = ({ isShow, onHide, onSubmit, contract }: any) => {
    const dispatch = useDispatch<any>()
    const [selectedDepositDate, setSelectedDepositDate] = useState(moment());
    const [selectedRefundDate, setSelectedRefundDate] = useState(moment());

    const handleSubmit = (values, formik) => {
        dispatch(deposit({ id: contract?.id, data: values }));

        onHide();
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            // size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>บันทึกเงินเข้า</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        contract_id: contract ? contract.id : '',
                        deposited_date: '',
                        refund_date: '',
                    }}
                    validationSchema={depositSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form className="p-3">
                                <Row className="mb-2">
                                    <Col md={6} className="text-lg text-blue-700">เลขที่สัญญา: {contract.contract_no}</Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <div className="flex flex-col">
                                            <label htmlFor="">วันที่เงินเข้า</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedDepositDate}
                                                onChange={(date) => {
                                                    setSelectedDepositDate(date);
                                                    formik.setFieldValue('deposited_date', date.format('YYYY-MM-DD'));

                                                    /** คำนวณวันที่กำหนดคืนเงินจาก contract.refund_days */
                                                    let refundDate = moment();
                                                    if (contract.loan?.loan_type_id === 1) {
                                                        /** กรณีเงินยืมโครงการ นับจากวันที่เงินเข้าเป็นวันที่ 1 */
                                                        refundDate = moment(date).add(contract.refund_days - 1, "days");
                                                    } else {
                                                        /** กรณียืมเงินไปราชการ นับจากวันที่กลับมากจากราชการเป็นวันที่ 1 */
                                                        const backedDate = moment(contract.loan?.project_edate).add(1, "days");

                                                        refundDate = backedDate.add(contract.refund_days - 1, "days");
                                                    }

                                                    setSelectedRefundDate(refundDate);
                                                    formik.setFieldValue('refund_date', refundDate.format('YYYY-MM-DD'));
                                                }}
                                            />
                                        </div>
                                        {(formik.errors.deposited_date && formik.touched.deposited_date) && (
                                            <span className="text-red-500 text-xs">{formik.errors.deposited_date as string}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <div className="flex flex-col">
                                            <label htmlFor="">วันที่กำหนดคืนเงิน</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedRefundDate}
                                                onChange={(date) => {
                                                    setSelectedRefundDate(date);
                                                    formik.setFieldValue('refund_date', date.format('YYYY-MM-DD'));
                                                }}
                                            />
                                        </div>
                                        {(formik.errors.refund_date && formik.touched.refund_date) && (
                                            <span className="text-red-500 text-xs">{formik.errors.refund_date as string}</span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <button type="submit" className="btn btn-outline-primary float-right">
                                            บันทึก
                                        </button>
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

export default ModalDepositForm
