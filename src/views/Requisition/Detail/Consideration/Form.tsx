import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
import { Col, Row } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { consider } from '../../../../features/slices/approval/approvalSlice'
import ModalSupplierList from '../../../../components/Modals/Supplier'
import DatePicker from '../../../../components/ui/Forms/DatePicker'

const approvalSchema = Yup.object().shape({
    consider_no: Yup.string().required('กรุณาระบุเลขที่รายงาน'),
    consider_date: Yup.string().required('กรุณาเลือกวันที่รายงาน'),
    notice_date: Yup.string().required('กรุณาเลือกวันที่ประกาศผู้ชนะ'),
    supplier_id: Yup.string().required('กรุณาเลือกผู้ขาย/ผู้จัดจำหน่าย')
});

const ConsiderationForm = ({ approval, requisition, onSubmitted, onCancel }: any) => {
    const dispatch = useDispatch<any>();
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        if (approval && approval.consider_no !== '') {
            setSelectedSupplier(approval.supplier);
        }
    }, [approval]);

    const handleSubmit = (values, formik) => {
        dispatch(consider({
            id: approval ? approval.id : requisition.approvals[0].id,
            data: values
        }));

        onSubmitted();
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                requisition_id: requisition.id,
                consider_no: (approval && approval.consider_no) ? approval.consider_no : '',
                consider_date: (approval && approval.consider_date) ? approval.consider_date : '',
                notice_date: (approval && approval.notice_date) ? approval.notice_date : '',
                supplier_id: (approval && approval.supplier_id) ? approval.supplier_id : '',
                supplier: (approval && approval.supplier) ? approval.supplier : null,
            }}
            validationSchema={approvalSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <ModalSupplierList
                            isShow={showSupplierModal}
                            onHide={() => setShowSupplierModal(false)}
                            onSelect={(supplier) => {
                                setSelectedSupplier(supplier);
                                formik.setFieldValue('supplier_id', supplier.id);
                                formik.setFieldValue('supplier', supplier);
                            }}
                        />

                        <Row>
                            <Col md={4}>
                                <label htmlFor="">เลขที่รายงาน</label>
                                <input
                                    type="text"
                                    name="consider_no"
                                    value={formik.values.consider_no}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                />
                                {(formik.errors.consider_no && formik.touched.consider_no) && (
                                    <span className="text-red-500 text-sm">{formik.errors.consider_no as string}</span>
                                )}
                            </Col>
                            <Col md={4}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่รายงาน</label>
                                    <DatePicker
                                        value={formik.values.consider_date}
                                        onChange={(date: string) => {
                                            formik.setFieldValue('consider_date', date);
                                        }}
                                        inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !text-sm w-full ${formik.errors.consider_date && formik.touched.consider_date ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                        error={formik.errors.consider_date && formik.touched.consider_date ? (formik.errors.consider_date as string) : undefined}
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="flex flex-col">
                                    <label htmlFor="">วันที่ประกาศผู้ชนะ</label>
                                    <DatePicker
                                        value={formik.values.notice_date}
                                        onChange={(date: string) => {
                                            formik.setFieldValue('notice_date', date);
                                        }}
                                        inputCss={`!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !text-sm w-full ${formik.errors.notice_date && formik.touched.notice_date ? '!border-red-500' : '!border-[#dee2e6]'}`}
                                        error={formik.errors.notice_date && formik.touched.notice_date ? (formik.errors.notice_date as string) : undefined}
                                    />
                                </div>
                            </Col>
                            <Col className="mt-2">
                                <label htmlFor="">ผู้ขาย/ผู้จัดจำหน่าย</label>
                                <div className="input-group">
                                    <div className="min-h-[34px] form-control font-thin text-sm bg-gray-100">
                                        {selectedSupplier && selectedSupplier.tax_no + ' ' + selectedSupplier.name}
                                    </div>
                                    <input
                                        type="hidden"
                                        name="supplier_id"
                                        value={formik.values.supplier_id}
                                        onChange={formik.handleChange}
                                    />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowSupplierModal(true)}>
                                        <FaSearch />
                                    </button>
                                </div>
                                {(formik.errors.supplier_id && formik.touched.supplier_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.supplier_id as string}</span>
                                )}
                            </Col>
                            <Col md={12} className="text-center mt-3">
                                <button type="submit" className="btn btn-outline-primary btn-sm">
                                    <i className="fas fa-save mr-1"></i>
                                    บันทึก
                                </button>
                                {approval?.consider_no && (
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={onCancel}>
                                        <i className="fas fa-times mr-1"></i>
                                        ยกเลิก
                                    </button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ConsiderationForm