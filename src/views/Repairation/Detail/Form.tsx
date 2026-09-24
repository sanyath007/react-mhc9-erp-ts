import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Col, Row } from 'react-bootstrap';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { toast } from 'react-toastify';
import moment from 'moment'
import { calculateNetTotal, isExisted } from '../../../utils'
import OverWriteMomentBE from '../../../utils/OverwriteMomentBE'
import { repair } from '../../../features/slices/repairation/repairationSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/repairation/repairationApi'
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Loading from '../../../components/ui/Loading';
import Autocomplete from '../../../components/FormControls/Autocomplete'

const repairationSchema = Yup.object().shape({
    repair_date: Yup.string().required(),
    repair_time: Yup.string().required(),
    solution: Yup.string().required(),
    repair_method_id: Yup.string().required(),
    repair_type_id: Yup.string().required(),
    staff_id: Yup.string().required(),
});

const RepairationForm = ({ repairation }: any) => {
    const dispatch = useDispatch<any>();
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [selectedRepairDate, setSelectedRepairDate] = useState(moment());
    const [selectedRepairTime, setSelectedRepairTime] = useState(moment());
    const [employees, setEmployees] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    /** On mounted */
    useEffect(() => {
        if (formData) {
            const newEmployees = formData.employees.map(emp => ({ id: emp.id, name: `${emp.prefix.name}${emp.firstname} ${emp.lastname}` }));
            setEmployees(newEmployees);

            const newSuppliers = formData.suppliers.map(sup => ({ id: sup.id, name: sup.name }));
            setSuppliers(newSuppliers);
        }
    }, [formData]);

    const handleSubmit = (values, formik) => {
        dispatch(repair({ id: repairation.id, data: values }));

        formik.resetForm();
    };

    const handleAddExpense = (formik, expense) => {
        if (isExisted(formik.values.expenses, 'id', expense.id)) {
            toast.error('พบรายค่าใช้จ่ายที่คุณเลือกมีอยู่แล้ว!!');
            return;
        }

        const newExpenses = [...formik.values.expenses, expense];

        formik.setFieldValue('expenses', newExpenses);
        formik.setFieldValue('total_cost', calculateNetTotal(newExpenses));
    };

    const handleDeleteExpense = (formik, id) => {
        const updatedExpenses = formik.values.expenses.filter(exp => exp.id !== id);

        formik.setFieldValue('expenses', updatedExpenses);
        formik.setFieldValue('total_cost', calculateNetTotal(updatedExpenses));
    };

    return (
        <Formik
            initialValues={{
                repair_date: moment().format('YYYY-MM-DD'),
                repair_time: moment().format('hh:mm'),
                repair_failure_id: '',
                repair_method_id: '',
                root_cause: '',
                solution: '',
                repair_type_id: '1',
                supplier_id: '',
                total_cost: 0,
                overall_time: 0,
                staff_id: '',
                expenses: []
            }}
            validationSchema={repairationSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-col">
                                    <label>วันที่ซ่อม</label>
                                    <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            value={selectedRepairDate}
                                            onChange={(date) => {
                                                setSelectedRepairDate(date);
                                                formik.setFieldValue('repair_date', date.format('YYYY-MM-DD'));
                                            }}
                                            inputVariant="outlined"
                                        />
                                    </MuiPickersUtilsProvider>
                                    {(formik.errors.repair_date && formik.touched.repair_date) && (
                                        <span className="text-red-500 text-sm">{formik.errors.repair_date as string}</span>
                                    )}
                                </div>
                            </Col>
                            <Col>
                                <div className="flex flex-col">
                                    <label>เวลาที่ซ่อม</label>
                                    <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                        <TimePicker
                                            format="HH:mm"
                                            ampm={false}
                                            value={selectedRepairTime}
                                            onChange={(time) => {
                                                const dateStr = moment(selectedRepairDate).format('YYYY-MM-DD');
                                                const timeStr = moment(time).format('HH:mm');

                                                /** Create newTime from selectedRepairDate and selected time from input */
                                                const newTime = moment(`${dateStr}T${timeStr}`);

                                                /** Set newTime to selectedRepairTime state and repair_time field */
                                                setSelectedRepairTime(newTime);
                                                formik.setFieldValue('repair_time', newTime.format('HH:mm'));
                                            }}
                                            inputVariant="outlined"
                                        />
                                    </MuiPickersUtilsProvider>
                                    {(formik.errors.repair_time && formik.touched.repair_time) && (
                                        <span className="text-red-500 text-sm">{formik.errors.repair_time as string}</span>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <label htmlFor="">กลุ่มอาการเสีย</label>
                                {isLoading && <div className="form-control text-center"><Loading /></div>}
                                {!isLoading && (
                                    <select
                                        name="repair_failure_id"
                                        value={formik.values.repair_failure_id}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin mr-1"
                                    >
                                        <option>-- เลือก --</option>
                                        {formData && formData.failures.map((failure, index) => (
                                            <option value={failure.id} key={failure.id}>
                                                {failure.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {(formik.errors.repair_failure_id && formik.touched.repair_failure_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.repair_failure_id as string}</span>
                                )}
                            </Col>
                            <Col>
                                <label htmlFor="">วิธีการซ่อม</label>
                                {isLoading && <div className="form-control text-center"><Loading /></div>}
                                {!isLoading && (
                                    <select
                                        name="repair_method_id"
                                        value={formik.values.repair_method_id}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin mr-1"
                                    >
                                        <option>-- เลือก --</option>
                                        {formData && formData.methods.map((method, index) => (
                                            <option value={method.id} key={method.id}>
                                                {method.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {(formik.errors.repair_method_id && formik.touched.repair_method_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.repair_method_id as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <label>สาเหตุของอาการเสีย</label>
                                <textarea
                                    rows={3}
                                    name="root_cause"
                                    value={formik.values.root_cause}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm font-thin"
                                ></textarea>
                                {(formik.errors.root_cause && formik.touched.root_cause) && (
                                    <span className="text-red-500 text-sm">{formik.errors.root_cause as string}</span>
                                )}
                            </Col>
                            <Col>
                                <label>รายละเอียดการซ่อม</label>
                                <textarea
                                    rows={3}
                                    name="solution"
                                    value={formik.values.solution}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm font-thin"
                                ></textarea>
                                {(formik.errors.solution && formik.touched.solution) && (
                                    <span className="text-red-500 text-sm">{formik.errors.solution as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <label htmlFor="">ประเภทการซ่อม</label>
                                {isLoading && <div className="form-control text-sm text-center"><Loading /></div>}
                                {!isLoading && (
                                    <div className="form-control text-sm font-thin flex flex-row">
                                        {formData.types.map((type) => (
                                            <label key={type.id}>
                                                <Field
                                                    type="radio"
                                                    name="repair_type_id"
                                                    value={type.id}
                                                />
                                                <span className="ml-1 mr-4">{type.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {(formik.errors.repair_type_id && formik.touched.repair_type_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.repair_type_id as string}</span>
                                )}
                            </Col>
                            <Col>
                                <label htmlFor="">ร้านซ่อม (กรณีส่งภายนอก)</label>
                                {isLoading && <div className="form-control text-center text-sm"><Loading /></div>}
                                {!isLoading && (
                                    <Autocomplete
                                        inputName="supplier_id"
                                        items={suppliers}
                                        onSelect={(supplier) => {
                                            formik.setFieldTouched('supplier_id', true);

                                            if (supplier) {
                                                formik.setFieldValue('supplier_id', supplier.id);
                                            } else {
                                                formik.setFieldValue('supplier_id', '');
                                            }
                                        }}
                                    />
                                )}
                                {(formik.errors.supplier_id && formik.touched.supplier_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.supplier_id as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="border rounded-md p-2">
                                    <h3 className="mb-1">รายการค่าใช้จ่าย (ถ้ามี)</h3>

                                    <ExpenseForm onAdd={(expense) => handleAddExpense(formik, expense)} />

                                    <ExpenseList expenses={formik.values.expenses} onDelete={(id) => handleDeleteExpense(formik, id)} />

                                    <div className="flex flex-row justify-end items-center">
                                        <label htmlFor="" className="mr-2">ค่าใช้จ่ายรวม (บาท): </label>
                                        <div className="w-[25%]">
                                            <div className="form-control text-sm text-center font-thin min-h-[34px] bg-gray-100 mr-1">
                                                {formik.values.total_cost}
                                            </div>
                                            {(formik.errors.total_cost && formik.touched.total_cost) && (
                                                <span className="text-red-500 text-sm">{formik.errors.total_cost as string}</span>
                                            )}
                                        </div>
                                        <div className="w-[10%] pl-1">บาท</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <label htmlFor="">ใช้เวลาในการซ่อม (นาที)</label>
                                {isLoading && <div className="form-control text-center text-sm"><Loading /></div>}
                                {!isLoading && (
                                    <input
                                        type="text"
                                        name="overall_time"
                                        value={formik.values.overall_time}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                    />
                                )}
                                {(formik.errors.overall_time && formik.touched.overall_time) && (
                                    <span className="text-red-500 text-sm">{formik.errors.overall_time as string}</span>
                                )}
                            </Col>
                            <Col>
                                <label htmlFor="">ผู้ดำเนินการ</label>
                                {isLoading && <div className="form-control text-center text-sm"><Loading /></div>}
                                {!isLoading && (
                                    <Autocomplete
                                        inputName="staff_id"
                                        items={employees}
                                        onSelect={(employee) => {
                                            formik.setFieldTouched('staff_id', true);

                                            if (employee) {
                                                formik.setFieldValue('staff_id', employee.id);
                                            } else {
                                                formik.setFieldValue('staff_id', '');
                                            }
                                        }}
                                    />
                                )}
                                {(formik.errors.staff_id && formik.touched.staff_id) && (
                                    <span className="text-red-500 text-sm">{formik.errors.staff_id as string}</span>
                                )}
                            </Col>
                            <Col md={3}>
                                <label htmlFor="">สถานะ</label>
                                {isLoading && <div className="form-control text-center"><Loading /></div>}
                                {!isLoading && (
                                    <select
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin mr-1"
                                    >
                                        <option>-- เลือก --</option>
                                        {formData && formData.statuses.map((status, index) => (
                                            <option value={status.id} key={status.id}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {(formik.errors.status && formik.touched.status) && (
                                    <span className="text-red-500 text-sm">{formik.errors.status as string}</span>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button
                                    type="submit"
                                    className={`btn btn-outline-primary mt-2 float-right`}
                                >
                                    บันทึก
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default RepairationForm
