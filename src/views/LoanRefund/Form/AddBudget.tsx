import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormGroup } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'

const budgetSchema = Yup.object().shape({
    budget_id: Yup.string().required('กรุณาระบุรายการงบประมาณ'),
    total: Yup.string().required('กรุณาระบุจำนวนเงิน'),
});

const AddBudget = ({ data, items, onAdd }: any) => {
    const [budget, setBudget] = useState(null);

    const handleSelectBudget = (formik, id) => {
        const selected = items.find(item => item.id === parseInt(id, 10));

        formik.setFieldValue('budget_id', selected?.budget_id);
        formik.setFieldValue('budget', selected?.budget);
    };

    const handleSubmit = (values, formik) => {
        if (data) {
            // onUpdate(values.item_id, { ...values, item })
        } else {
            onAdd({ ...values, id: uuid() });
        }

        formik.resetForm();
        setBudget(null);
    };

    return (
        <Formik
            initialValues={{
                id: '',
                loan_budget_id: '',
                budget_id: '',
                budget: null,
                total: '',
            }}
            validationSchema={budgetSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <>
                        <div className="flex flex-row gap-2 mb-2">
                            <FormGroup className="w-[75%]">
                                <select
                                    name="loan_budget_id"
                                    value={formik.values.loan_budget_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleSelectBudget(formik, e.target.value);
                                    }}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- เลือก --</option>
                                    {items && items.map(item => (
                                        <option value={item.id} key={item.id}>
                                            {item.budget?.activity?.name}
                                        </option>
                                    ))}
                                </select>
                                {(formik.errors.loan_budget_id && formik.touched.loan_budget_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.loan_budget_id as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[15%]">
                                <input
                                    type="text"
                                    name="total"
                                    value={formik.values.total}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm text-right ${(formik.errors.total && formik.touched.total) && 'border-red-500'}`}
                                    placeholder="จำนวนเงิน"
                                />
                                {(formik.errors.total && formik.touched.total) && (
                                    <span className="text-red-500 text-xs">{formik.errors.total as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[10%]">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button
                                        type="button"
                                        className={`btn ${data ? 'btn-outline-warning' : 'btn-outline-primary'} text-sm min-[992px]:px-2 max-[992px]:px-1`}
                                        onClick={formik.submitForm}
                                    >
                                        {/* <FaPlus /> */}
                                        เพิ่ม
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger text-xs min-[1285px]:text-sm  max-[1285px]:px-1 min-[1285px]:px-2"
                                        onClick={() => {
                                            formik.resetForm();
                                            setBudget(null);
                                        }}
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

export default AddBudget