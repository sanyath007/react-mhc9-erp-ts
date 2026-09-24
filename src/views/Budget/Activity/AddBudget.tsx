import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid'
import { useGetInitialFormDataQuery } from '../../../features/services/budget/budgetApi'

const AddBudgetType = ({ isShow, hide, data, onSubmit }: any) => {
    const { data: formData, isLoading } = useGetInitialFormDataQuery({ year: '' });

    const getBudgetType = (id) => {
        return formData ? formData.types.find(type => type.id === parseInt(id, 10)) : null; 
    };

    const handleSubmit = (values, formik) => {
        onSubmit(values)

        hide()
    };

    return (
        <Modal
            show={isShow}
            onHide={hide}
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>{data ? 'แก้ไขประเภทงบประมาณ' : 'เพิ่มประเภทงบประมาณ'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <Formik
                    initialValues={{
                        id: data ? data.id : uuid(),
                        activity_id: data ? data.activity_id : '',
                        budget_type_id: data ? data.budget_type_id : '',
                        total: data ? data.total : '',
                        type: (data && data.type) ? data.type : null,
                    }}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Row className="mb-2">
                                <label htmlFor="" className="col-4">ประเภทงบประมาณ :</label>
                                <Col md={6} className="mb-2">
                                        <select
                                            name="budget_type_id"
                                            value={formik?.values.budget_type_id}
                                            onChange={(e) => {
                                                formik?.handleChange(e);
                                                formik.setFieldValue('type', getBudgetType(e.target.value));
                                            }}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- ประเภทงบประมาณ --</option>
                                            {formData && formData?.types.map(type => (
                                                <option value={type.id} key={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {(formik?.errors.budget_type_id && formik?.touched.budget_type_id) && (
                                            <span className="text-red-500 text-sm">{formik?.errors.budget_type_id as string}</span>
                                        )}
                                </Col>

                                <label htmlFor="" className="col-4">ยอดจัดสรร (บาท) :</label>
                                <Col md={6} className="mb-2">
                                        <input
                                            type="text"
                                            name="total"
                                            value={formik?.values.total}
                                            onChange={formik?.handleChange}
                                            className="form-control text-sm"
                                            placeholder="ยอดจัดสรร"
                                        />
                                        {(formik?.errors.total && formik?.touched.total) && (
                                            <span className="text-red-500 text-sm">{formik?.errors.total as string}</span>
                                        )}
                                </Col>
                                <div className="offset-md-4">
                                    <button type="button" className={`btn ${data ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-sm`} onClick={formik.submitForm}>
                                        บันทึก
                                    </button>
                                </div>
                            </Row>
                        )
                    }}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default AddBudgetType