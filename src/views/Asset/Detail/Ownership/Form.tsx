import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Col, FormGroup, Modal, Row, Form as BsForm } from 'react-bootstrap'
import moment from 'moment'
import OverWriteMomentBE from '../../../../utils/OverwriteMomentBE'
import api from '../../../../api'
import { store, update } from '../../../../features/slices/asset-ownership/assetOwnershipSlice';
import Autocomplete from '../../../../components/FormControls/Autocomplete';

const ownershipSchema = Yup.object().shape({
    owned_at: Yup.string().required(),
    owner_id: Yup.string().required(),
    condition: Yup.string().required(),
    status: Yup.string().required(),
});

const OwnershipForm = ({ isOpen, handleHide, assetId, ownership }: any) => {
    const dispatch = useDispatch<any>();
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = async () => {
        try {
            const res = await api.get('/api/employees');

            setEmployees(res.data.map(emp => ({ id: emp.id, name: `${emp.prefix.name}${emp.firstname} ${emp.lastname}`})));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (values, props) => {
        if (ownership) {
            dispatch(update({ id: ownership.id, data: values }));
        } else {
            dispatch(store(values));
        }

        handleHide();
    };

    return (
        <Modal show={isOpen} onHide={handleHide} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    เพิ่มผู้รับผิดชอบ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        asset_id: assetId,
                        owned_at: '',
                        owner_id: '',
                        condition: '',
                        status: '',
                        remark: '',
                    }}
                    validationSchema={ownershipSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <FormGroup>
                                            <label>ผู้รับผิดชอบ</label>
                                            <Autocomplete
                                                inputName="owner_id"
                                                items={employees}
                                                onSelect={(item) => {
                                                    formik.setFieldTouched('owner_id', true);

                                                    if (item) {
                                                        formik.setFieldValue('owner_id', item.id);
                                                    } else {
                                                        formik.setFieldValue('owner_id', '');
                                                    }
                                                }} 
                                            />
                                            {(formik.errors.owner_id && formik.touched.owner_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.owner_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="flex flex-col">
                                                <label>วันที่รับ</label>
                                                <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        value={selectedDate}
                                                        onChange={(date) => {
                                                            setSelectedDate(date);
                                                            formik.setFieldValue('owned_at', date.format('YYYY-MM-DD'));
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                                {/* <BsForm.Control
                                                    type="date"
                                                    name="owned_at"
                                                    onChange={formik.handleChange}
                                                    className="form-control"
                                                /> */}
                                                {(formik.errors.owned_at && formik.touched.owned_at) && (
                                                    <span className="text-red-500 text-sm">{formik.errors.owned_at as string}</span>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <FormGroup>
                                            <label>สภาพพัสดุ</label>
                                            <select
                                                name="condition"
                                                value={formik.values.condition}
                                                onChange={formik.handleChange}
                                                className="form-control"
                                            >
                                                <option value="">-- เลือกสภาพพัสดุ --</option>
                                                <option value="1">สมบูรณ์</option>
                                                <option value="2">เสียหายบางส่วน</option>
                                                <option value="3">เสียหายใช้งานไม่ได้</option>
                                            </select>
                                            {(formik.errors.condition && formik.touched.condition) && (
                                                <span className="text-red-500 text-sm">{formik.errors.condition as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <label>สถานะ</label>
                                            <select
                                                name="status"
                                                value={formik.values.status}
                                                onChange={formik.handleChange}
                                                className="form-control"
                                            >
                                                <option value="">-- เลือกสถานะ --</option>
                                                <option value="1">ครอบครองอยู่</option>
                                                <option value="2">คืนความเป็นเจ้าของแล้ว</option>
                                                <option value="3">สูญหายระหว่างการดูแล</option>
                                                <option value="4">เสียหายระหว่างการดูแล</option>
                                            </select>
                                            {(formik.errors.status && formik.touched.status) && (
                                                <span className="text-red-500 text-sm">{formik.errors.status as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={12}>
                                        <FormGroup>
                                            <label>หมายเหตุ</label>
                                            <textarea
                                                rows={3}
                                                name="remark"
                                                value={formik.values.remark}
                                                onChange={formik.handleChange}
                                                className="form-control"
                                            ></textarea>
                                            {(formik.errors.owner_id && formik.touched.owner_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.owner_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <button
                                            type="submit"
                                            className="btn btn-outline-primary float-right"
                                            disabled={formik.isSubmitting}
                                        >
                                            บันทึก
                                        </button>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default OwnershipForm