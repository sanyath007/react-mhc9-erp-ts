import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Col, FormGroup, Modal, Row } from 'react-bootstrap'
import moment from 'moment'
// import { useGetInitialFormDataQuery } from '../../../features/services/place/placeApi'
import { store, resetSuccess } from '../../../features/slices/agency/agencySlice'
import { filterAmphursByChangwat, filterTambonsByAmphur } from '../../../utils'

const agencySchema = Yup.object().shape({
    name: Yup.string().required(),
});

const ModalAgencyForm = ({ isShow, onHide, onSubmit }: any) => {
    const dispatch = useDispatch<any>()
    const { agency, isSuccess } = useSelector((state: any) => state.agency);
    // const { data: formData, isLoading } = useGetInitialFormDataQuery();
    // const [filteredAmphurs, setFilteredAmphurs] = useState([]);
    // const [filteredTambons, setFilteredTambons] = useState([]);

    /** On mounted */
    // useEffect(() => {
    //     if (formData) {
    //         // TODO: initial form data
    //     }
    // }, [formData]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetSuccess());

            onSubmit(agency);
            onHide();
        }
    }, [isSuccess]);

    const handleSubmit = (values, formik) => {
        const data = {
            name: values.name,
            is_dmh: values.is_dmh.length === 0 ? '2' : values.is_dmh[0],
            is_moph: values.is_moph.length === 0 ? '2' : values.is_moph[0],
            status: values.status,
        };

        dispatch(store(data));
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='lg'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>เพิ่มหน่วยรับงบประมาณ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: '',
                        is_dmh: [],
                        is_moph: [],
                        status: '1',
                        // place_type_id: '',
                        // address_no: '',
                        // road: '',
                        // moo: '',
                        // tambon_id: '',
                        // amphur_id: '',
                        // changwat_id: '',
                        // zipcode: '',
                        // tel: '',
                    }}
                    validationSchema={agencySchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form className="p-3">
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">ชื่อหน่วยงาน</label>
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
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <div className="flex justify-start min-h-[34px] ml-1">
                                            <label className="flex items-center gap-2">
                                                <Field
                                                    type="checkbox"
                                                    name="is_dmh"
                                                    value="1"
                                                    checked={parseInt(formik.values.is_dmh, 10) === 1}
                                                />
                                                <label>เป็นหน่วยภายในกรมฯ</label>
                                            </label>
                                        </div>
                                        {(formik.errors.is_dmh && formik.touched.is_dmh) && (
                                            <span className="text-red-500 text-sm">{formik.errors.is_dmh as string}</span>
                                        )}
                                    </Col>
                                    <Col>
                                        <div className="flex justify-start min-h-[34px] ml-1">
                                            <label className="flex items-center gap-2">
                                                <Field
                                                    type="checkbox"
                                                    name="is_moph"
                                                    value="1"
                                                    checked={parseInt(formik.values.is_moph, 10) === 1}
                                                />
                                                <label>เป็นหน่วยกระทรวง สธ.</label>
                                            </label>
                                        </div>
                                        {(formik.errors.is_moph && formik.touched.is_moph) && (
                                            <span className="text-red-500 text-sm">{formik.errors.is_moph as string}</span>
                                        )}
                                    </Col>
                                </Row>
                                {/* <Row className="mb-2">
                                    <Col md={4}>
                                        <label htmlFor="">ประเภทสถานที่</label>
                                        <select
                                            name="place_type_id"
                                            value={formik.values.place_type_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- ประเภทสถานที่ --</option>
                                            <option value="1">โรงแรม</option>
                                            <option value="2">โรงเรียน/มหาวิทยาลัย</option>
                                            <option value="3">หน่วยงานสาธารณสุข</option>
                                            <option value="4">หน่วยงานท้องถิ่น</option>
                                            <option value="5">หน่วยงานราชการอื่นๆ</option>
                                            <option value="6">บริษัท/เอกชน</option>
                                            <option value="99">อื่นๆ</option>
                                        </select>
                                        {(formik.errors.place_type_id && formik.touched.place_type_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.place_type_id as string}</span>
                                        )}
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>ที่อยู่เลขที่</label>
                                            <input
                                                type="text"
                                                name="address_no"
                                                value={formik.values.address_no}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.address_no && formik.touched.address_no) && (
                                                <span className="text-red-500 text-sm">{formik.errors.address_no as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col md={3}>
                                        <FormGroup>
                                            <label>หมู่ที่</label>
                                            <input
                                                type="text"
                                                name="moo"
                                                value={formik.values.moo}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.moo && formik.touched.moo) && (
                                                <span className="text-red-500 text-sm">{formik.errors.moo as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>ถนน</label>
                                            <input
                                                type="text"
                                                name="road"
                                                value={formik.values.road}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.road && formik.touched.road) && (
                                                <span className="text-red-500 text-sm">{formik.errors.road as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <FormGroup>
                                            <label>จังหวัด</label>
                                            <select
                                                name="changwat_id"
                                                value={formik.values.changwat_id}
                                                onChange={(e) => {
                                                    setFilteredAmphurs(filterAmphursByChangwat(e.target.value, formData.amphurs));
                                                    formik.setFieldValue('changwat_id', e.target.value)
                                                }}
                                                className="form-control text-sm"
                                            >
                                                <option value="">-- จังหวัด --</option>
                                                {formData && formData.changwats.map(changwat => (
                                                    <option value={changwat.id} key={changwat.id}>
                                                        {changwat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {(formik.errors.changwat_id && formik.touched.changwat_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.changwat_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>อำเภอ</label>
                                            <select
                                                name="amphur_id"
                                                value={formik.values.amphur_id}
                                                onChange={(e) => {
                                                    setFilteredTambons(filterTambonsByAmphur(e.target.value, formData.tambons));
                                                    formik.setFieldValue('amphur_id', e.target.value)
                                                }}
                                                className="form-control text-sm"
                                            >
                                                <option value="">-- อำเภอ --</option>
                                                {filteredAmphurs.map(amphur => (
                                                    <option value={amphur.id} key={amphur.id}>
                                                        {amphur.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {(formik.errors.amphur_id && formik.touched.amphur_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.amphur_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>ตำบล</label>
                                            <select
                                                name="tambon_id"
                                                value={formik.values.tambon_id}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            >
                                                <option value="">-- ตำบล --</option>
                                                {filteredTambons.map(tambon => (
                                                    <option value={tambon.id} key={tambon.id}>
                                                        {tambon.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {(formik.errors.tambon_id && formik.touched.tambon_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.tambon_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <FormGroup>
                                            <label>รหัสไปรษณีย์</label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                value={formik.values.zipcode}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.zipcode && formik.touched.zipcode) && (
                                                <span className="text-red-500 text-sm">{formik.errors.zipcode as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>ละติจูด</label>
                                            <input
                                                type="text"
                                                name="latitude"
                                                value={formik.values.latitude}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.latitude && formik.touched.latitude) && (
                                                <span className="text-red-500 text-sm">{formik.errors.latitude as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>ลองติจูด</label>
                                            <input
                                                type="text"
                                                name="longitude"
                                                value={formik.values.longitude}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm"
                                            />
                                            {(formik.errors.longitude && formik.touched.longitude) && (
                                                <span className="text-red-500 text-sm">{formik.errors.longitude as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row> */}
                                <Row>
                                    <Col>
                                        <button type="submit" className="btn btn-outline-primary float-right">
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

export default ModalAgencyForm
