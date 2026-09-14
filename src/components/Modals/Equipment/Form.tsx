import React from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup' 
import { Col, Modal, Row } from 'react-bootstrap'
import { FaEdit } from "react-icons/fa";
import { v4 as uuid } from 'uuid'
import { getFormDataItem } from '../../../utils'
import { useGetInitialFormDataQuery } from '../../../features/services/comset/comsetApi'
import RadioButtonGroup from '../../FormControls/RadioButtonGroup';

const equipmentSchema = Yup.object().shape({
    equipment_type_id: Yup.string().required(),
    brand_id: Yup.string().required(),
});

const ModalEquipmentForm = ({ isShow, onHide, onSubmit, data }: any) => {
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

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
                        <FaEdit />{data ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์'}
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        ...data,
                        id: data ? data.id : uuid(),
                        equipment_type_id: data ? data.equipment_type_id : '',
                        brand_id: data ? data.brand_id : '',
                        model: data ? data.model : '',
                        capacity: data ? data.capacity : '',
                        description: (data && data.description) ? data.description : '',
                        price: (data && data.price) ? data.price : '',
                        status: data ? data.status : '',
                        type: (data && data.type) ? data.type : null,
                        brand: (data && data.brand) ? data.brand : null
                    }}
                    validationSchema={equipmentSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form>
                                <Row>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">ประเภทอุปกรณ์</label>
                                            <select
                                                name="equipment_type_id"
                                                value={formik.values.equipment_type_id}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    formik.setFieldValue('type', getFormDataItem(formData, 'types', parseInt(e.target.value, 10)));
                                                }}
                                                className="form-control text-sm"
                                            >
                                                <option value="">-- เลือกประเภทอุปกรณ์ --</option>
                                                {(formData && formData.types) && formData.types.map(type => (
                                                    <option value={type.id} key={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {(formik.errors.equipment_type_id && formik.touched.equipment_type_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.equipment_type_id as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">ยี่ห้อ</label>
                                            <select
                                                name="brand_id"
                                                value={formik.values.brand_id}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    formik.setFieldValue('brand', getFormDataItem(formData, 'brands', parseInt(e.target.value, 10)));
                                                }}
                                                className="form-control text-sm"
                                            >
                                                <option value="">-- เลือกยี่ห้อ --</option>
                                                {(formData && formData.brands) && formData.brands.map(brand => (
                                                    <option value={brand.id} key={brand.id}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {(formik.errors.brand_id && formik.touched.brand_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.brand_id as string}</span>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">รุ่น</label>
                                            <input
                                                type="text"
                                                name="model"
                                                value={formik.values.model}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-center">
                                            <label className="w-[25%]">ขนาด/ความจุ</label>
                                            <input
                                                type="text"
                                                name="capacity"
                                                value={formik.values.capacity}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                        </div>
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
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-start">
                                            <label className="w-[25%]">รายละเอียด</label>
                                            <textarea
                                                name="description"
                                                rows={4}
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            ></textarea>
                                        </div>
                                    </Col>
                                    <Col md={12} className="mb-2">
                                        <div className="flex flex-row items-start">
                                            <label className="w-[20%]">การติดตั้ง</label>
                                            <RadioButtonGroup
                                                items={[
                                                    { label: 'มาพร้อมเครื่อง', value: 1 },
                                                    { label: 'ติดตั้งเพิ่ม', value: 2 },
                                                    { label: 'เปลี่ยนอะไหล่', value: 3 },
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

export default ModalEquipmentForm
