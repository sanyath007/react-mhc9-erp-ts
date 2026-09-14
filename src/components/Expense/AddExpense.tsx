import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FormGroup } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import { calculateTotalFromDescription, getPatternOfExpense, toLongTHDateRange, getFormDataItem } from '../../utils'
// import ModalAddItemDesc from '../Modals/AddItemDesc'

const itemSchema = Yup.object().shape({
    course_id: Yup.string().required('กรุณาเลือกรุ่นโครงการก่อน'),
    expense_id: Yup.string().required('กรุณาเลือกค่าใช้จ่ายก่อน'),
    description: Yup.string().when('expense', {
        is: (expense) => expense?.pattern,
        then: (schema) => schema.required('กรุณาระบุรายละเอียดค่าใช้จ่าย (ตามรูปแบบในวงเล็บ)'),
    }),
    total: Yup.string().required('กรุณาระบุรวมเป็นเงินก่อน'),
});

const AddExpense = ({ data, formData, courses, onAddItem, onUpdateItem, onClear }: any) => {
    const [item, setItem] = useState(null);

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
            onUpdateItem(values.id, values);
        } else {
            onAddItem({ ...values, id: uuid() });
        }

        formik.resetForm();
        setItem(null);
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: item ? item.id : '',
                loan_id: item ? item.loan_id : '',
                course_id: item ? item.course_id : '',
                expense_id: item ? item.expense_id : '',
                expense: item ? item.expense : null,
                expense_group: item ? item.expense_group : 1,
                description: (item && item.description) ? item.description : '',
                total: item ? item.total : '',
            }}
            validationSchema={itemSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <>
                        <div className="flex flex-row gap-2 mb-2">
                            <FormGroup className="w-[15%]">
                                <select
                                    name="course_id"
                                    value={formik.values.course_id}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm ${(formik.errors.course_id && formik.touched.course_id) && 'border-red-500'}`}
                                >
                                    <option value="">-- รุ่น --</option>
                                    {courses && courses.map(course => (
                                        <option value={course.id} key={course.id}>
                                            {/* รุ่นที่ {course.seq_no} */}
                                            {course?.course_date && <>วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</>} 
                                            ณ {course?.place?.name} จ.{course?.place?.changwat?.name}
                                        </option>
                                    ))}
                                </select>
                                {(formik.errors.course_id && formik.touched.course_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.course_id as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[30%]">
                                <select
                                    name="expense_id"
                                    value={formik.values.expense_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue('expense', getFormDataItem({ expenses: formData }, 'expenses', parseInt(e.target.value, 10)));
                                    }}
                                    className={`form-control text-sm ${(formik.errors.expense_id && formik.touched.expense_id) && 'border-red-500'}`}
                                >
                                    <option value="">-- ค่าใช้จ่าย --</option>
                                    {formData && formData.map(exp => (
                                        <option value={exp.id} key={exp.id}>
                                            {exp.name} {exp.pattern}
                                        </option>
                                    ))}
                                </select>
                                {(formik.errors.expense_id && formik.touched.expense_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.expense_id as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[30%]">
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
                                    className={`form-control text-sm ${(formik.errors.description && formik.touched.description) && 'border-red-500'}`}
                                    placeholder="รายละเอียด"
                                />
                                {(formik.errors.description && formik.touched.description) && (
                                    <span className="text-red-500 text-xs">{formik.errors.description as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[15%]">
                                <input
                                    type="text"
                                    name="total"
                                    value={formik.values.total}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm text-right ${(formik.errors.total && formik.touched.total) && 'border-red-500'}`}
                                    placeholder="รวมเป็นเงิน"
                                />
                                {(formik.errors.total && formik.touched.total) && (
                                    <span className="text-red-500 text-xs">{formik.errors.total as string}</span>
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
                                        className="btn btn-outline-danger text-sm min-[1285px]:text-sm  max-[1285px]:px-1 min-[1285px]:px-2"
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

export default AddExpense
