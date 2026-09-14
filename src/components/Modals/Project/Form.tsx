import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { Col, FormGroup, Modal, Row } from 'react-bootstrap'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { useGetInitialFormDataQuery } from '../../../features/services/project/projectApi'
import { store } from '../../../features/slices/project/projectSlice'
import Autocomplete from '../../../components/FormControls/Autocomplete'

const ModalProjectForm = ({ isShow, onHide, onSubmit }: any) => {
    const dispatch = useDispatch<any>()
    const [selectedYear, setSelectedYear] = useState(moment());
    const [selectedFromDate, setSelectedFromDate] = useState(moment());
    const [selectedToDate, setSelectedToDate] = useState(moment());
    const [employees, setEmployees] = useState([]);
    const { data: formData, isLoading } = useGetInitialFormDataQuery();

    /** On mounted */
    useEffect(() => {
        if (formData) {
            const newEmployees = formData.employees.map(emp => ({ id: emp.id, name: `${emp.prefix?.name}${emp.firstname} ${emp.lastname}` }));
            setEmployees(newEmployees);
        }
    }, [formData]);

    const handleSubmit = (values, formik) => {
        dispatch(store(values));

        // onSubmit();
        onHide();
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='lg'
        >
            <Modal.Header closeButton>
                <Modal.Title>เพิ่มโครงการ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: '',
                        year: '',
                        project_type_id: '',
                        owner_id: '',
                        place_id: '',
                        from_date: '',
                        to_date: '',
                    }}
                    onSubmit={handleSubmit}
                >
                    {(formik) => {
                        return (
                            <Form className="p-3">
                                <Row className="mb-2">
                                    <Col md={3}>
                                        <label htmlFor="">ประเภทโครงการ</label>
                                        <select
                                            name="project_type_id"
                                            value={formik.values.project_type_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- ประเภทโครงการ --</option>
                                            <option value="1">โครงการ</option>
                                        </select>
                                    </Col>
                                    <Col md={2}>
                                        <label htmlFor="">ปีงบ</label>
                                        <DatePicker
                                            format="YYYY"
                                            views={['year']}
                                            value={selectedYear}
                                            onChange={(date) => {
                                                setSelectedYear(date);
                                                formik.setFieldValue('year', date.year() + 543);
                                            }}
                                        />
                                        {(formik.errors.year && formik.touched.year) && (
                                            <span className="text-red-500 text-sm">{formik.errors.year as string}</span>
                                        )}
                                    </Col>
                                    <Col>
                                        <label htmlFor="">เจ้าของโครงการ</label>
                                        <Autocomplete
                                            inputName="owner_id"
                                            items={employees}
                                            onSelect={(employee) => {
                                                formik.setFieldTouched('owner_id', true);

                                                if (employee) {
                                                    formik.setFieldValue('owner_id', employee.id);
                                                } else {
                                                    formik.setFieldValue('owner_id', '');
                                                }
                                            }} 
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">ชื่อโครงการ</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                            placeholder="ระบุชื่อโครงการ"
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="">สถานที่</label>
                                        <select
                                            name="place_id"
                                            value={formik.values.place_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm"
                                        >
                                            <option value="">-- ประเภทโครงการ --</option>
                                            {formData && formData?.places.map(place => (
                                                <option value={place.id} key={place.id}>
                                                    {place.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <div className="flex flex-col">
                                            <label htmlFor="">จากวันที่</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedFromDate}
                                                onChange={(date) => {
                                                    setSelectedFromDate(date);
                                                    formik.setFieldValue('from_date', date.format('YYYY-MM-DD'));
                                                }}
                                                inputVariant="outlined"
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="flex flex-col">
                                            <label htmlFor="">ถึงวันที่</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedToDate}
                                                onChange={(date) => {
                                                    setSelectedToDate(date);
                                                    formik.setFieldValue('to_date', date.format('YYYY-MM-DD'));
                                                }}
                                                inputVariant="outlined"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col>
                                        <FormGroup>
                                            <label>ที่อยู่ เลขที่</label>
                                            <input
                                                type="text"
                                                name="address_no"
                                                value={formik.values.address_no}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm text-sm"
                                            />
                                            {(formik.errors.address_no && formik.touched.address_no) && (
                                                <span className="text-red-500 text-sm">{formik.errors.address_no as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                        <FormGroup>
                                            <label>หมู่ที่</label>
                                            <input
                                                type="text"
                                                name="moo"
                                                value={formik.values.moo}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm text-sm"
                                            />
                                            {(formik.errors.moo && formik.touched.moo) && (
                                                <span className="text-red-500 text-sm">{formik.errors.moo as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col> */}
                                    {/* <Col>
                                        <FormGroup>
                                            <label>ถนน</label>
                                            <input
                                                type="text"
                                                name="road"
                                                value={formik.values.road}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm text-sm"
                                            />
                                            {(formik.errors.road && formik.touched.road) && (
                                                <span className="text-red-500 text-sm">{formik.errors.road as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>รหัสไปรษณีย์</label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                value={formik.values.zipcode}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm text-sm"
                                            />
                                            {(formik.errors.zipcode && formik.touched.zipcode) && (
                                                <span className="text-red-500 text-sm">{formik.errors.zipcode as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row> */}
                                {/* <Row className="mb-3">
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
                                                className="form-control text-sm text-sm"
                                            >
                                                <option value=""></option>
                                                {formData && formData.changewats.map(changewat => (
                                                    <option value={changewat.id} key={changewat.id}>
                                                        {changewat.name}
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
                                                className="form-control text-sm text-sm"
                                            >
                                                <option value=""></option>
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
                                                className="form-control text-sm text-sm"
                                            >
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

export default ModalProjectForm
