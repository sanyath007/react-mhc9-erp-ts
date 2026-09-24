import React from 'react'
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { store, update } from '../../features/slices/unit/unitSlice'

const unitSchema = Yup.object().shape({
    name: Yup.string().required(),
});

const UnitForm = ({ unit, onCancel, onSuccess }: any) => {
    const dispatch = useDispatch<any>();

    const handleSubmit = (values, props) => {
        if (unit) {
            dispatch(update({ id: unit.id, data: values }));

            onCancel();
        } else {
            dispatch(store(values));
        }

        props.resetForm();
        onSuccess();
    };

    return (
        <div className="my-2">
            <Formik
                enableReinitialize
                initialValues={{
                    name: unit ? unit.name : '',
                    status: unit ? (unit.status === 1 ? true : false) : false,
                }}
                validationSchema={unitSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => {
                    return (
                        <Form className="form-inline">
                            <div className="flex flex-row items-center gap-4">
                                <div className="w-4/12">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="form-control w-full"
                                        placeholder="ชื่อหน่วยนับ"
                                    />
                                    {(formik.errors.name && formik.touched.name) && (
                                        <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="status"
                                    /> ใช้งานอยู่
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        type="submit"
                                        className={`btn ${unit ? 'btn-outline-warning' : 'btn-outline-primary'}`}
                                        disabled={formik.isSubmitting}
                                    >
                                        {unit ? 'แก้ไขหน่วยนับ' : 'เพิ่มหน่วยนับ'}
                                    </button>
                                    {unit && (
                                        <button type="button" className="btn btn-outline-danger" onClick={onCancel}>
                                            ยกเลิก
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default UnitForm
