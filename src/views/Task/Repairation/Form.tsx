import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Col, Row, Modal } from 'react-bootstrap';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import moment from 'moment'
import { store } from '../../../features/slices/repairation/repairationSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/repairation/repairationApi'
import Loading from '../../../components/ui/Loading';
import Autocomplete from '../../../components/FormControls/Autocomplete'

const repairationSchema = Yup.object().shape({
    request_date: Yup.string().required(),
    request_time: Yup.string().required(),
    deliver_date: Yup.string().required(),
    task_id: Yup.string().required(),
    // asset_id: Yup.string().required(),
    requester_id: Yup.string().required(),
});

const RequestForm = ({ isShow, onHide, task }: any) => {
    const dispatch = useDispatch<any>();
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [selectedRequestDate, setSelectedRequestDate] = useState(moment());
    const [selectedRequestTime, setSelectedRequestTime] = useState(moment());
    const [selectedDeliverDate, setSelectedDeliverDate] = useState(moment());
    const [employees, setEmployees] = useState([]);

    /** On mounted */
    useEffect(() => {
        if (formData) {
            const newEmployees = formData.employees.map(emp => ({ id: emp.id, name: `${emp.prefix.name}${emp.firstname} ${emp.lastname}` }));
            setEmployees(newEmployees);
        }
    }, [formData]);

    const handleSubmit = (values, formik) => {
        dispatch(store(values));

        formik.resetForm();
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='lg'
        >
            <Modal.Header className="py-1" closeButton>
                <Modal.Title>บันทึกการส่งซ่อม</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        request_date: moment().format('YYYY-MM-DD'),
                        request_time: moment().format('hh:mm'),
                        deliver_date: moment().format('YYYY-MM-DD'),
                        requester_id: '',
                        task_id: task ? task.id : '',
                        asset_id: task ? task.assets[0]?.asset_id : '',
                    }}
                    validationSchema={repairationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => (
                        <Form>
                            <Row className="mb-2">
                                <Col>
                                    <div className="flex flex-col">
                                        <label>วันที่ส่งซ่อม</label>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            value={selectedRequestDate}
                                            onChange={(date) => {
                                                setSelectedRequestDate(date);
                                                formik.setFieldValue('request_date', date.format('YYYY-MM-DD'));
                                            }}
                                            inputVariant="outlined"
                                        />
                                        {(formik.errors.request_date && formik.touched.request_date) && (
                                            <span className="text-red-500 text-sm">{formik.errors.request_date as string}</span>
                                        )}
                                    </div>
                                </Col>
                                <Col>
                                    <div className="flex flex-col">
                                        <label>เวลาที่ส่งซ่อม</label>
                                        <TimePicker
                                            format="HH:mm"
                                            ampm={false}
                                            value={selectedRequestTime}
                                            onChange={(time) => {
                                                const dateStr = moment(selectedRequestDate).format('YYYY-MM-DD');
                                                const timeStr = moment(time).format('HH:mm');

                                                /** Create newTime from selectedRequestDate and selected time from input */
                                                const newTime = moment(`${dateStr}T${timeStr}`);

                                                /** Set newTime to selectedRequestTime state and request_time field */
                                                setSelectedRequestTime(newTime);
                                                /** Set newTime to selectedRequestTime state and request_time field */
                                                formik.setFieldValue('request_time', newTime.format('HH:mm'));
                                            }}
                                            inputVariant="outlined"
                                        />
                                        {(formik.errors.request_time && formik.touched.request_time) && (
                                            <span className="text-red-500 text-sm">{formik.errors.request_time as string}</span>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <div className="flex flex-col">
                                        <label>กำหนดส่งมอบ</label>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            value={selectedDeliverDate}
                                            onChange={(date) => {
                                                setSelectedDeliverDate(date);
                                                formik.setFieldValue('deliver_date', date.format('YYYY-MM-DD'));
                                            }}
                                            inputVariant="outlined"
                                        />
                                        {(formik.errors.deliver_date && formik.touched.deliver_date) && (
                                            <span className="text-red-500 text-sm">{formik.errors.deliver_date as string}</span>
                                        )}
                                    </div>
                                </Col>
                                <Col>
                                    <label htmlFor="">ผู้ส่งซ่อม</label>
                                    {isLoading && <div className="form-control text-center text-sm"><Loading /></div>}
                                    {!isLoading && (
                                        <Autocomplete
                                            inputName="requester_id"
                                            items={employees}
                                            onSelect={(employee) => {
                                                formik.setFieldTouched('requester_id', true);

                                                if (employee) {
                                                    formik.setFieldValue('requester_id', employee.id);
                                                } else {
                                                    formik.setFieldValue('requester_id', '');
                                                }
                                            }}
                                        />
                                    )}
                                    {(formik.errors.requester_id && formik.touched.requester_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.requester_id as string}</span>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label>หมายเหตุ</label>
                                    <textarea
                                        rows={3}
                                        name="handling"
                                        value={formik.values.handling}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                    ></textarea>
                                    {(formik.errors.handling && formik.touched.handling) && (
                                        <span className="text-red-500 text-sm">{formik.errors.handling as string}</span>
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
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default RequestForm
