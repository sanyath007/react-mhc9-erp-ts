import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormGroup } from 'react-bootstrap'
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa'
import { v4 as uuid } from 'uuid'
import ModalBudgetList from '../Modals/BudgetList'
import BudgetTypeBadge from './BudgetTypeBadge'

const budgetSchema = Yup.object().shape({
    budget_id: Yup.string().required('กรุณาระบุรายการงบประมาณ'),
    total: Yup.string().required('กรุณาระบุจำนวนเงิน'),
});

const AddBudget = ({ data, formData, onAddBudget }: any) => {
    const [budget, setBudget] = useState(null);
    const [showBudgetModal, setShowBudgetModal] = useState(false);

    const handleSubmit = (values, formik) => {
        if (data) {
            // onUpdateItem(values.item_id, { ...values, item })
        } else {
            onAddBudget({ ...values, id: uuid() });
        }

        formik.resetForm();
        setBudget(null);
    };

    return (
        <Formik
            initialValues={{
                id: '',
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
                        <ModalBudgetList
                            isShow={showBudgetModal}
                            onHide={() => setShowBudgetModal(false)}
                            onSelect={(budget) => {
                                setBudget(budget);
                                formik.setFieldValue('budget_id', budget.id);
                                formik.setFieldValue('budget', budget);
                            }}
                        />

                        <div className="flex flex-row gap-2 mb-2">
                            <FormGroup className="w-[75%]">
                                <div className="input-group">
                                    <div className={`form-control min-h-[34px] bg-gray-100 ${(formik.errors.budget_id && formik.touched.budget_id) && 'border-red-500'}`}>
                                        {budget && (
                                            <p className="text-sm">
                                                {budget?.activity?.name}
                                                <BudgetTypeBadge type={budget.type} />
                                            </p>
                                        )}
                                    </div>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowBudgetModal(true)}>
                                        <FaSearch />
                                    </button>
                                </div>
                                {(formik.errors.budget_id && formik.touched.budget_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.budget_id as string}</span>
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