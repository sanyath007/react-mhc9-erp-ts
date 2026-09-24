import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FormGroup } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import { calculateTotalFromDescription, getPatternOfExpense, getFormDataItem } from '../../../utils'
// import ModalAddItemDesc from '../Modals/AddItemDesc'

const orderSchema = Yup.object().shape({
    expense_id: Yup.string().required(),
    total: Yup.string().required('กรุณาระบุรวมเป็นเงินก่อน'),
});

const AddOrder = ({ data, formData, onAdd, onUpdate, onClear }: any) => {
    const [order, setItem] = useState(null);

    useEffect(() => {
        if (data) {
            setItem(data);
        }
    }, [data]);

    const handleClear = (formik) => {
        formik.resetForm();
        setItem(null);
        onClear(null);
    };

    const handleSubmit = (values, formik) => {
        if (data) {
            onUpdate(values.id, values);
        } else {
            onAdd({ ...values, id: uuid() });
        }

        formik.resetForm();
        setItem(null);
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: order ? order.id : '',
                loan_id: order ? order.loan_id : '',
                course_id: order ? order.course_id : '',
                expense_id: order ? order.expense_id : '',
                expense: order ? order.expense : null,
                expense_group: order ? order.expense_group : 2,
                description: (order && order.description) ? order.description : '',
                total: order ? order.total : '',
            }}
            validationSchema={orderSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <>
                        <div className="flex flex-row gap-2 mb-2">
                            <FormGroup className="w-[35%]">
                                <select
                                    name="expense_id"
                                    value={formik.values.expense_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue('expense', getFormDataItem({ expenses: formData }, 'expenses', parseInt(e.target.value, 10)));
                                    }}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- รายการ --</option>
                                    {formData && formData.map(exp => (
                                        <option value={exp.id} key={exp.id}>
                                            {exp.name} {exp.pattern}
                                        </option>
                                    ))}
                                </select>
                                {(formik.errors.expense_id && formik.touched.expense_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.expense_id as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[40%]">
                                <input
                                    type="text"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={(e) => {
                                        formik.setFieldValue(
                                            'total',
                                            (getPatternOfExpense(formData, formik.values.expense_id) && e.target.value !== '') ? calculateTotalFromDescription(e.target.value) : ''
                                        )
                                    }}
                                    className="form-control text-sm"
                                    placeholder="รายละเอียด (ถ้ามี)"
                                />
                                {(formik.errors.description && formik.touched.description) && (
                                    <span className="text-red-500 text-sm">{formik.errors.description as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[15%]">
                                <input
                                    type="text"
                                    name="total"
                                    value={formik.values.total}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm text-right"
                                    placeholder="รวมเป็นเงิน"
                                />
                                {(formik.errors.total && formik.touched.total) && (
                                    <span className="text-red-500 text-sm">{formik.errors.total as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[10%]">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button
                                        type="button"
                                        className={`btn btn-outline-primary text-sm min-[992px]:px-2 max-[992px]:px-1`}
                                        onClick={formik.submitForm}
                                    >
                                        {/* <FaPlus /> */}
                                        {data ? 'ตกลง' : 'เพิ่ม'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger text-xs min-[1285px]:text-sm  max-[1285px]:px-1 min-[1285px]:px-2"
                                        onClick={() => handleClear(formik)}
                                    >
                                        {/* <FaTimes /> */}
                                        {data ? 'ยกเลิก' : 'เคลียร์'}
                                    </button>
                                </div>
                            </FormGroup>
                        </div>
                    </>
                )
            }}
        </Formik>
    )
}

export default AddOrder
