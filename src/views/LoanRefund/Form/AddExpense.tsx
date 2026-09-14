import React, { Fragment, useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FormGroup } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import {
    calculateTotalFromDescription,
    currency,
    replaceExpensePatternFromDesc,
    toShortTHDate
} from '../../../utils'

const itemSchema = Yup.object().shape({
    contract_detail_id: Yup.string().required('กรุณาเลือกรายการค่าใช้จ่าย'),
    description: Yup.string().when('has_pattern', {
        is: true,
        then: (schema) => schema.required('กรุณาระบุรายละเอียดค่าใช้จ่าย (ตามรูปแบบในวงเล็บ)'),
    }),
    total: Yup.string().required('กรุณาระบุยอดค่าใช้จ่ายจริง'),
});

const AddExpense = ({ data, expenses, courses, refundType, onAddItem, onUpdateItem, onClear }: any) => {
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (data) {
            setItem(data);
        }
    }, [data]);

    const handleClear = (formik) => {
        formik.resetForm();
        onClear(null);
    };

    const handleSubmit = (values, formik) => {
        if (data) {
            onUpdateItem(values.item_id, { ...values, item })
        } else {
            const detail = expenses.find(cd => cd.id === parseInt(values.contract_detail_id, 10));

            onAddItem({ ...values, id: uuid(), contract_detail: detail });
        }

        formik.resetForm();
        setItem(null);
    };

    const getPatternOfExpenseFromLoanDetails = (details, id) => {
        return details?.find(detail => detail.id === parseInt(id, 10))?.expense?.pattern;
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: '',
                contract_detail_id: item ? item.contract_detail_id : '',
                has_pattern: false,
                contract_detail: null,
                description: item ? item.description : '',
                total: item ? item.total : '',
            }}
            validationSchema={itemSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <>
                        <div className="flex flex-row gap-2 mb-2">
                            <FormGroup className="w-[40%]">
                                <select
                                    name="contract_detail_id"
                                    value={formik.values.contract_detail_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);

                                        /** เซตค่าฟิลด์ has_pattern โดยเช็คค่า pattern จาก expense ของ expenses prop */
                                        const pattern = !!expenses.find(item => item.id === parseInt(e.target.value, 10))?.expense?.pattern;
                                        formik.setFieldValue('has_pattern', pattern);
                                    }}
                                    className={`form-control text-sm ${(formik.errors.contract_detail_id && formik.touched.contract_detail_id) && 'border-red-500'}`}
                                >
                                    <option value="">-- ค่าใช้จ่าย --</option>
                                    {(courses && courses.length > 1) ? courses.map(course => {
                                        let index = 0;

                                        return (
                                            <optgroup key={course.id} label={`วันที่ ${toShortTHDate(course.course_date)} ณ ${course?.place?.name} จ.${course?.place?.changwat?.name}`}>
                                                {expenses && expenses.map(data => (
                                                    <Fragment key={data.id}>
                                                        {data.loan_detail.course_id === course.id && (
                                                            <option value={data.id}>
                                                                {++index}. <>{data.expense?.name}</>&nbsp;
                                                                {(data.description && data.expense?.pattern)
                                                                    ? <>{replaceExpensePatternFromDesc(data.expense?.pattern, data.description)}</>
                                                                    : <>{data.description && <>({data.description})</>}</>
                                                                }
                                                                &nbsp;งบประมาณ <>{currency.format(data.total)} บาท</>
                                                            </option>
                                                        )}
                                                    </Fragment>
                                                ))}
                                            </optgroup>
                                        )
                                    }) : (
                                        <>
                                            {expenses && expenses.map((data, index) => (
                                                <option value={data.id} key={data.id}>
                                                    {++index}. <>{data.expense?.name}</>&nbsp;
                                                    {(data.description && data.expense?.pattern)
                                                        ? <>{replaceExpensePatternFromDesc(data.expense?.pattern, data.description)}</>
                                                        : <>{data.description && <>({data.description})</>}</>
                                                    }
                                                    &nbsp;งบประมาณ <>{currency.format(data.total)} บาท</>
                                                </option>
                                            ))}
                                        </>
                                    )}

                                </select>
                                {(formik.errors.contract_detail_id && formik.touched.contract_detail_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.contract_detail_id as string}</span>
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
                                            (getPatternOfExpenseFromLoanDetails(expenses, formik.values.contract_detail_id) && e.target.value !== '')
                                                ? calculateTotalFromDescription(e.target.value)
                                                : ''
                                        )
                                    }}
                                    className={`form-control text-sm ${(formik.errors.description && formik.touched.description) && 'border-red-500'}`}
                                    placeholder={`${formik.values.has_pattern ? 'สูตรการคำนวณ' : 'รายละเอียดเพิ่มเติม'}`}
                                />
                                {(formik.errors.description && formik.touched.description) && (
                                    <span className="text-red-500 text-xs">{formik.errors.description as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[20%]">
                                <input
                                    type="text"
                                    name="total"
                                    value={formik.values.total}
                                    onChange={formik.handleChange}
                                    className={`form-control text-sm text-right ${(formik.errors.total && formik.touched.total) && 'border-red-500'}`}
                                    placeholder="ยอดใช้จริง"
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
                                        {data ? 'แก้ไข' : 'เพิ่ม'}
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
                );
            }}
        </Formik>
    )
}

export default AddExpense
