import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { FaEdit } from "react-icons/fa";
import { DatePicker } from '@material-ui/pickers';
import { v4 as uuid } from 'uuid'
import { Form, Formik } from 'formik'
import * as Yup from 'yup' 
import { getFormDataItem } from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'
import { useGetInitialFormDataQuery } from '../../../features/services/comset/comsetApi'
import RadioButtonGroup from '../../FormControls/RadioButtonGroup';
import moment from 'moment';

const licenseSchema = Yup.object().shape({
    description: Yup.string().required(),
    purchased_date: Yup.string().required(),
    license_no: Yup.string().required(),
});

const ModalLicenseForm = ({ isShow, onHide, onSubmit, data }: any) => {
    const classes = useStyles();
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [selectedPurchasedDate, setSelectedPurchasedDate] = useState(moment())
    const [selectedRegisteredDate, setSelectedRegisteredDate] = useState(moment())

    const handleSubmit = (values, formik) => {
        onSubmit(values);

        formik.resetForm();
        onHide();
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='lg'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title className="text-xl">
                    <div className="flex flex-row items-center gap-1">
                        <FaEdit />{data ? 'แก้ไขไลเซนส์' : 'เพิ่มไลเซนส์'}
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        ...data,
                        id: data ? data.id : uuid(),
                        description: (data && data.description) ? data.description : '',
                        purchased_date: data ? data.purchased_date : '',
                        registered_date: data ? data.registered_date : '',
                        registered_email: data ? data.registered_email : '',
                        license_no: data ? data.license_no : '',
                        price: (data && data.price) ? data.price : '',
                        status: data ? data.status : '1',
                    }}
                    validationSchema={licenseSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form>
                                <Row>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-start">
                                            <label className="w-[25%]">รายละเอียด</label>
                                            <textarea
                                                rows={4}
                                                name="description"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            ></textarea>
                                        </div>
                                        {(formik.errors.description && formik.touched.description) && (
                                            <span className="text-red-500 text-sm">{formik.errors.description as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">วันที่ซื้อ</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedPurchasedDate}
                                                onChange={(date) => {
                                                    setSelectedPurchasedDate(date);
                                                    formik.setFieldValue('purchased_date', date.format('YYYY-MM-DD'));
                                                }}
                                                className={classes.muiTextFieldInput}
                                            />
                                        </div>
                                        {(formik.errors.purchased_date && formik.touched.purchased_date) && (
                                            <span className="text-red-500 text-sm">{formik.errors.purchased_date as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">วันที่ลงทะเบียน</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedRegisteredDate}
                                                onChange={(date) => {
                                                    setSelectedRegisteredDate(date);
                                                    formik.setFieldValue('registered_date', date.format('YYYY-MM-DD'));
                                                }}
                                                className={classes.muiTextFieldInput}
                                            />
                                        </div>
                                        {(formik.errors.registered_date && formik.touched.registered_date) && (
                                            <span className="text-red-500 text-sm">{formik.errors.registered_date as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">อีเมลลงทะเบียน</label>
                                            <input
                                                type="text"
                                                name="registered_email"
                                                value={formik.values.registered_email}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                        </div>
                                        {(formik.errors.registered_email && formik.touched.registered_email) && (
                                            <span className="text-red-500 text-sm">{formik.errors.registered_email as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">ไลเซนส์</label>
                                            <input
                                                type="text"
                                                name="license_no"
                                                value={formik.values.license_no}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                        </div>
                                        {(formik.errors.license_no && formik.touched.license_no) && (
                                            <span className="text-red-500 text-sm">{formik.errors.license_no as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">ราคา (บาท)</label>
                                            <input
                                                type="text"
                                                name="price"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                        </div>
                                        {(formik.errors.price && formik.touched.price) && (
                                            <span className="text-red-500 text-sm">{formik.errors.price as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-start">
                                            <label className="w-[20%]">การติดตั้ง</label>
                                            <RadioButtonGroup
                                                items={[
                                                    { label: 'ใช้งานอยู่', value: 1 },
                                                    { label: 'หมดอายุ', value: 2 },
                                                ]}
                                                defaultValue={1}
                                                selected={formik.values.status}
                                                onChange={(val) => {
                                                    console.log(val);
                                                    formik.setFieldValue('status', val);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="flex flex-row items-start">
                                            <label className="w-[20%]"></label>
                                            <button type="submit" className="btn btn-outline-primary text-sm">
                                                บันทึก
                                            </button>
                                        </div>
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

export default ModalLicenseForm
