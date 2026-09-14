import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { store, update } from '../../features/slices/asset-type/assetTypeSlice'
import Loading from '../../components/ui/Loading'

const assetTypeSchema = Yup.object().shape({
    name: Yup.string().required(),
    department_id: Yup.string().required(),
});

const AssetTypeForm = ({ assetType, handleCancel }: any) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: any) => state.assetType);

    const handleSubmit = (values, props) => {
        if (assetType) {
            dispatch(update({ id: assetType.id, data: values }));

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
                    name: assetType ? assetType.name : '',
                    department_id: assetType ? assetType.department_id : '',
                    status: assetType ? (assetType.status === 1 ? true : false) : false,
                }}
                validationSchema={assetTypeSchema}
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
                                        placeholder="ประเภทพัสดุ"
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
                                    <button type="submit" className={`btn ${assetType ? 'btn-outline-warning' : 'btn-outline-primary'}`}>
                                        {loading && <Loading />}
                                        {assetType ? 'แก้ไขประเภทพัสดุ' : 'เพิ่มประเภทพัสดุ'}
                                    </button>
                                    {assetType && (
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

export default AssetTypeForm
