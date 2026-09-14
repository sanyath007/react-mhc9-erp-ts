import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { store, update } from '../../features/slices/division/divisionSlice'
import api from '../../api';

const divisionSchema = Yup.object().shape({
    name: Yup.string().required(),
    department_id: Yup.string().required(),
});

const DivisionForm = ({ division, onCancel, onSuccess }: any) => {
    const dispatch = useDispatch<any>();
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        getDepartments();
    }, [])

    const getDepartments = async () => {
        try {
            const res = await api.get(`/api/divisions/init/form`);

            setDepartments(res.data.departments);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (values, props) => {
        if (division) {
            dispatch(update({ id: division.id, data: values }));

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
                    name: division ? division.name : '',
                    department_id: division ? division.department_id : '',
                    status: division ? (division.status === 1 ? true : false) : false,
                }}
                validationSchema={divisionSchema}
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
                                        placeholder="ชื่องาน"
                                    />
                                    {(formik.errors.name && formik.touched.name) && (
                                        <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                    )}
                                </div>
                                <div className="w-4/12">
                                    <select
                                        name="department_id"
                                        className="form-control w-full"
                                        value={formik.values.department_id}
                                        onChange={formik.handleChange}
                                    >
                                        <option>-- เลือกกลุ่มงาน --</option>
                                        {departments && departments.map(dep => (
                                            <option key={dep.id} value={dep.id}>
                                                {dep.name}
                                            </option>
                                        ))}
                                    </select>
                                    {(formik.errors.department_id && formik.touched.department_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.department_id as string}</span>
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
                                        className={`btn ${division ? 'btn-outline-warning' : 'btn-outline-primary'}`}
                                        disabled={formik.isSubmitting}
                                    >
                                        {division ? 'แก้ไขงาน' : 'เพิ่มงาน'}
                                    </button>
                                    {division && (
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

export default DivisionForm
