import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { store, update } from '../../features/slices/asset-category/assetCategorySlice'
import { useGetInitialFormDataQuery } from '../../features/services/asset-category/assetCategoryApi'
import Loading from '../../components/ui/Loading'

const assetCategorySchema = Yup.object().shape({
    name: Yup.string().required(),
    department_id: Yup.string().required(),
});

const AssetCategoryForm = ({ assetCategory, handleCancel }: any) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: any) => state.assetCategory);
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

    const handleSubmit = (values, props) => {
        if (assetCategory) {
            dispatch(update({ id: assetCategory.id, data: values }));

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
                    name: assetCategory ? assetCategory.name : '',
                    asset_type_id: assetCategory ? assetCategory.asset_type_id : '',
                    status: assetCategory ? (assetCategory.status === 1 ? true : false) : false,
                }}
                validationSchema={assetCategorySchema}
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
                                        placeholder="ชนิดพัสดุ"
                                    />
                                    {(formik.errors.name && formik.touched.name) && (
                                        <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                    )}
                                </div>
                                <div className="w-4/12">
                                    <select
                                        name="asset_type_id"
                                        className="form-control w-full"
                                        value={formik.values.asset_type_id}
                                        onChange={formik.handleChange}
                                    >
                                        <option>-- เลือกประเภทพัสดุ --</option>
                                        {formData && formData.types.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    {(formik.errors.asset_type_id && formik.touched.asset_type_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.asset_type_id as string}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="status"
                                    /> ใช้งานอยู่
                                </div>
                                <div className="flex gap-1">
                                    <button type="submit" className={`btn ${assetCategory ? 'btn-outline-warning' : 'btn-outline-primary'}`}>
                                        {loading && <Loading />}
                                        {assetCategory ? 'แก้ไขชนิดพัสดุ' : 'เพิ่มชนิดพัสดุ'}
                                    </button>
                                    {assetCategory && (
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

export default AssetCategoryForm
