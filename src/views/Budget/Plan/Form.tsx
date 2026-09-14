import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import { store, update } from '../../../features/slices/budget-plan/budgetPlanSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/budget-plan/budgetPlanApi'

const budgetPlanSchema = Yup.object().shape({
    plan_no: Yup.string().required('กรุณาระบุเลขที่แผนงาน'),
    name: Yup.string().required('กรุณาระบุชื่อแผนงาน'),
    year: Yup.string().required('กรุณาเลือกปีงบประมาณ'),
    plan_type_id: Yup.string().required('กรุณาเลือกประเภทแผนงาน'),
});

const BudgetPlanForm = ({ plan }: any) => {
    const [cookies] = useCookies();
    const dispatch = useDispatch<any>();
    const [selectedYear, setSelectedYear] = useState(moment(`${cookies.budgetYear}-01-01`));
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

    const handleSubmit = (values, formik) => {
        if (plan) {
            dispatch(update({ id: plan.id, data: values }));
        } else {
            dispatch(store(values));
        }

        console.log(values);
    };

    return (
        <Formik
            initialValues={{
                plan_no: plan ? plan.plan_no : '',
                name: plan ? plan.name : '',
                year: plan ? plan.year : moment().format('YYYY'),
                plan_type_id: plan ? plan.plan_type_id : ''
            }}
            validationSchema={budgetPlanSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">ปีงบประมาณ :</label>
                            <div className="col-6">
                                <div className="flex flex-col w-[40%]">
                                    <DatePicker
                                        format="YYYY"
                                        views={['year']}
                                        value={selectedYear}
                                        onChange={(date) => {
                                            setSelectedYear(date);
                                            formik.setFieldValue('year', date.year());
                                        }}
                                        TextFieldComponent={(props) => (
                                            <input {...(props as any)} className="form-control text-sm text-center w-[100%]" />
                                        )}
                                    />
                                    {(formik.errors.year && formik.touched.year) && (
                                        <span className="text-red-500 text-sm">{formik.errors.year as string}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">ประเภทแผนงาน :</label>
                            <div className="col-6">
                                <select
                                    name="plan_type_id"
                                    value={formik.values.plan_type_id}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- เลือกประเภท --</option>
                                    {formData && formData.types.map(type => (
                                        <option value={type.id} key={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                {(formik.errors.plan_type_id && formik.touched.plan_type_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.plan_type_id as string}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">เลขที่แผนงาน :</label>
                            <div className="col-6">
                                <input
                                    type="text"
                                    name="plan_no"
                                    value={formik.values.plan_no}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm w-[40%]"
                                />
                                {(formik.errors.plan_no && formik.touched.plan_no) && (
                                    <span className="text-red-500 text-sm">{formik.errors.plan_no as string}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label htmlFor="" className="col-3 text-right">ชื่อแผนงาน :</label>
                            <div className="col-6">
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm"
                                />
                                {(formik.errors.name && formik.touched.name) && (
                                    <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="offset-3">
                                <button type="submit" className={`btn ${plan ? 'btn-outline-secondary' : 'btn-outline-primary'} btn-sm`}>
                                    {plan ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default BudgetPlanForm