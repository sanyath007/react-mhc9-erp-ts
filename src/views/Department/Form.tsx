import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import Loading from '../../components/ui/Loading'
import { store, update } from '../../features/slices/department/departmentSlice'

const departmentSchema = Yup.object().shape({
    name: Yup.string().required()
});

const DepartmentForm = ({ department, handleCancel }: any) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: any) => state.department);

    const handleSubmit = (values, props) => {
        if (department) {
            dispatch(update({ id: department.id, data: values }));

            handleCancel()
        } else {
            dispatch(store(values));
        }

        props.resetForm();
    };

    return (
        <div className="my-2">
            <Formik
                enableReinitialize
                initialValues={{
                    name: department ? department.name : '',
                    status: department ? (department.status === 1 ? true : false) : false,
                }}
                validationSchema={departmentSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => {
                    return (
                        <Form className="form-inline">
                            <div className="flex flex-row items-center gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className="form-control w-1/2"
                                    placeholder="ชื่อกลุ่มงาน"
                                />
                                <div className="flex items-center justify-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="status"
                                    /> ใช้งานอยู่
                                </div>
                                <div className="flex gap-1">
                                    <button type="submit" className={`btn ${department ? 'btn-outline-warning' : 'btn-outline-primary'}`}>
                                        {loading && <Loading />}
                                        {department ? 'แก้ไขกลุ่มงาน' : 'เพิ่มกลุ่มงาน'}
                                    </button>
                                    {department && (
                                        <button type="button" className="btn btn-outline-danger" onClick={handleCancel}>
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

export default DepartmentForm
