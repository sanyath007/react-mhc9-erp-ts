import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { FormGroup, Col, Row } from 'react-bootstrap'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import OverWriteMomentBE from '../../../utils/OverwriteMomentBE'
import { filterAmphursByChangwat, filterTambonsByAmphur } from '../../../utils'
import { store, update, upload } from '../../../features/slices/employee/employeeSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/employee/employeeApi'
import './Form.css'
import Loading from '../../../components/ui/Loading'

const employeeSchema = Yup.object().shape({
    prefix_id: Yup.string().required(),
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    cid: Yup.string().min(13).required(),
    sex: Yup.string().required(),
    // birthdate: Yup.string().required(),
    changwat_id: Yup.string().required(),
    position_id: Yup.string().required(),
    // started_at: Yup.string().required(),
});

const initialFormData = {
    prefixes: [],
    positions: [],
    levels: [],
    changewats: [],
    amphurs: [],
    tambons: [],
}

const EmployeeForm = ({ employee }: any) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: any) => state.employee);
    const [filteredLevels, setFilteredLevels] = useState([]);
    const [filteredAmphurs, setFilteredAmphurs] = useState([]);
    const [filteredTambons, setFilteredTambons] = useState([]);
    const [selectedBirthdate, setSelectedBirthdate] = useState(moment());
    const [selectedAssignedAt, setSelectedAssignedAt] = useState(moment());
    const [selectedStartedAt, setSelectedStartedAt] = useState(moment());
    const [selectedImage, setSelectedImage] = useState(null);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (employee) {
            employee.birthdate && setSelectedBirthdate(moment(employee.birthdate));
            employee.assigned_at && setSelectedAssignedAt(moment(employee.assigned_at));
            employee.started_at && setSelectedStartedAt(moment(employee.started_at));

            formData && setFilteredLevels(formData.levels);
            formData && setFilteredAmphurs(filterAmphursByChangwat(employee.changwat_id.toString(), formData.amphurs));
            formData && setFilteredTambons(filterTambonsByAmphur(employee.amphur_id.toString(), formData.tambons));
        }
    }, [employee]);

    const handlePositionSelected = (id) => {
        const position = formData && formData.positions.find(pos => pos.id === parseInt(id, 10));
        const newLevels = formData && formData.levels.filter(level => level.position_type_id === position.position_type_id);

        setFilteredLevels(newLevels);
    };

    const handleSubmit = (values, props) => {
        if (employee) {
            dispatch(update({ id: values.id, data: values }))
        } else {
            let data = new FormData();
            data.append('avatar_url', selectedImage);

            for (const [key, val] of Object.entries(values)) {
                data.append(key, val as any);
            }

            dispatch(store(data));
        }

        props.resetForm();

        /** Clear all values of local related form states */
        setSelectedImage(null);
        setSelectedBirthdate(moment());
        setSelectedAssignedAt(moment());
        setSelectedStartedAt(moment());
    };

    const handleUpload = () => {
        let data = new FormData();

        data.append('avatar_url', selectedImage);

        dispatch(upload({ id: employee.id, data }))
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: employee ? employee.id : '',
                employee_no: (employee && employee.employee_no) ? employee.employee_no : '',
                prefix_id: employee ? employee.prefix_id : '',
                firstname: employee ? employee.firstname : '',
                lastname: employee ? employee.lastname : '',
                cid: employee ? employee.cid : '',
                sex: employee ? employee.sex : 1,
                birthdate: employee ? employee.birthdate : '',
                address_no: (employee && employee.address_no) ? employee.address_no : '',
                moo: (employee && employee.moo) ? employee.moo : '',
                road: (employee && employee.road) ? employee.road : '',
                changwat_id: (employee && employee.changwat_id) ? employee.changwat_id : '',
                amphur_id: (employee && employee.amphur_id) ? employee.amphur_id : '',
                tambon_id: (employee && employee.tambon_id) ? employee.tambon_id : '',
                zipcode: (employee && employee.zipcode) ? employee.zipcode : '',
                tel: employee ? employee.tel : '',
                email: (employee && employee.email) ? employee.email : '',
                line_id: (employee && employee.line_id) ? employee.line_id : '',
                position_id: employee ? employee.position_id : '',
                level_id: (employee && employee.level_id) ? employee.level_id : '',
                assigned_at: (employee && employee.assigned_at) ? employee.assigned_at : '',
                started_at: (employee && employee.started_at) ? employee.started_at : '',
                remark: (employee && employee.remark) ? employee.remark : ''
            }}
            validationSchema={employeeSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <Row className="mb-4">
                            <Col md={12} className="flex flex-col justify-center items-center">
                                {employee?.avatar_url ? (
                                    <div className="rounded-full w-[120px] h-[120px] overflow-hidden">
                                        <img src={`${process.env.REACT_APP_API_URL}/uploads/${employee?.avatar_url}`} alt="employee-pic" className="avatar-img" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="avatar">
                                            <label className="hover:cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="mt-2"
                                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                                />
                                                <figure>
                                                    {selectedImage
                                                        ? <img src={URL.createObjectURL(selectedImage)} alt="employee-pic" className="avatar-img" />
                                                        : <img src="/img/avatar-heroes.png" alt="employee-pic" className="avatar-img" />
                                                    }

                                                    <figcaption className="avatar-caption">
                                                        <img src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
                                                        <span className="text-white">{selectedImage ? 'แก้ไขรูป' : 'เพิ่มรูป'}</span>
                                                    </figcaption>
                                                </figure>
                                            </label>
                                        </div>

                                        {selectedImage && (
                                            <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => handleUpload()}>
                                                อัพโหลดรูป
                                            </button>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>เลขที่พนักงาน</label>
                                    <input
                                        type="text"
                                        name="employee_no"
                                        value={formik.values.employee_no}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.employee_no && formik.touched.employee_no) && (
                                        <span className="text-red-500 text-sm">{formik.errors.employee_no as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>เลขบัตรประชาชน</label>
                                    <input
                                        type="text"
                                        name="cid"
                                        value={formik.values.cid}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.cid && formik.touched.cid) && (
                                        <span className="text-red-500 text-sm">{formik.errors.cid as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>เพศ</label>
                                    <Field component="div" name="sex" className="form-control text-sm flex items-center">
                                        <input
                                            type="radio"
                                            name="sex"
                                            value="1"
                                            defaultChecked={formik.values.sex === 1}
                                        />
                                        <label htmlFor="male" className="ml-1 mr-5">ชาย</label>

                                        <input
                                            type="radio"
                                            name="sex"
                                            value="2"
                                            defaultChecked={formik.values.sex === 2}
                                        />
                                        <label htmlFor="famale" className="ml-1">หญิง</label>
                                    </Field>
                                    {(formik.errors.sex && formik.touched.sex) && (
                                        <span className="text-red-500 text-sm">{formik.errors.sex as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={2}>
                                <FormGroup>
                                    <label>คำนำหน้า</label>
                                    <select
                                        name="prefix_id"
                                        value={formik.values.prefix_id}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    >
                                        <option value="">-- คำนำหน้า --</option>
                                        {formData && formData.prefixes && formData.prefixes.map(prefix => (
                                            <option value={prefix.id} key={prefix.id}>
                                                {prefix.name}
                                            </option>
                                        ))}
                                    </select>
                                    {(formik.errors.prefix_id && formik.touched.prefix_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.prefix_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>ชื่อ</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formik.values.firstname}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.firstname && formik.touched.firstname) && (
                                        <span className="text-red-500 text-sm">{formik.errors.firstname as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>สกุล</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.lastname && formik.touched.lastname) && (
                                        <span className="text-red-500 text-sm">{formik.errors.lastname as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <div className="flex flex-col">
                                        <label>วันเกิด</label>
                                        <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedBirthdate}
                                                onChange={(date) => {
                                                    setSelectedBirthdate(date);
                                                    formik.setFieldValue('birthdate', date.format('YYYY-MM-DD'));
                                                }}
                                                inputVariant="outlined"
                                            />
                                        </MuiPickersUtilsProvider>
                                        {(formik.errors.birthdate && formik.touched.birthdate) && (
                                            <span className="text-red-500 text-sm">{formik.errors.birthdate as string}</span>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>ที่อยู่ เลขที่</label>
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
                            <Col md={2}>
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
                        </Row>
                        <Row className="mb-2">
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
                        </Row>
                        <Row className="mb-2">
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
                                        className="form-control text-sm"
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
                                        className="form-control text-sm"
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
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>โทรศัพท์</label>
                                    <input
                                        type="text"
                                        name="tel"
                                        value={formik.values.tel}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.tel && formik.touched.tel) && (
                                        <span className="text-red-500 text-sm">{formik.errors.tel as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>อีเมล</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.email && formik.touched.email) && (
                                        <span className="text-red-500 text-sm">{formik.errors.email as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>LINE ID</label>
                                    <input
                                        type="text"
                                        name="line_id"
                                        value={formik.values.line_id}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.line_id && formik.touched.line_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.line_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>ตำแหน่ง</label>
                                    <select
                                        name="position_id"
                                        value={formik.values.position_id}
                                        className="form-control text-sm"
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            handlePositionSelected(e.target.value);
                                        }}
                                    >
                                        <option value="">-- เลือกตำแหน่ง --</option>
                                        {formData && formData.positions && formData.positions.map(type => (
                                            <option value={type.id} key={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    {(formik.errors.position_id && formik.touched.position_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.position_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>ระดับ</label>
                                    <select
                                        name="level_id"
                                        value={formik.values.level_id}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    >
                                        <option value="">-- เลือกระดับ --</option>
                                        {filteredLevels && filteredLevels.map(level => (
                                            <option value={level.id} key={level.id}>
                                                {level.name}
                                            </option>
                                        ))}
                                    </select>
                                    {(formik.errors.level_id && formik.touched.level_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.level_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <div className="flex flex-col">
                                        <label>วันที่บรรจุ</label>
                                        <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedAssignedAt}
                                                onChange={(date) => {
                                                    setSelectedAssignedAt(date);
                                                    formik.setFieldValue('assigned_at', date.format('YYYY-MM-DD'));
                                                }}
                                                inputVariant="outlined"
                                            />
                                        </MuiPickersUtilsProvider>
                                        {(formik.errors.assigned_at && formik.touched.assigned_at) && (
                                            <span className="text-red-500 text-sm">{formik.errors.assigned_at as string}</span>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <div className="flex flex-col">
                                        <label>วันที่เริ่มงาน (ที่ศูนย์สุขภาพจิตที่ 9)</label>
                                        <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedStartedAt}
                                                onChange={(date) => {
                                                    setSelectedStartedAt(date);
                                                    formik.setFieldValue('started_at', date.format('YYYY-MM-DD'));
                                                }}
                                                inputVariant="outlined"
                                            />
                                        </MuiPickersUtilsProvider>
                                        {(formik.errors.started_at && formik.touched.started_at) && (
                                            <span className="text-red-500 text-sm">{formik.errors.started_at as string}</span>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>หมายเหตุ</label>
                                    <textarea
                                        rows={3}
                                        name="remark"
                                        value={formik.values.remark}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    >
                                    </textarea>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button
                                    type="submit"
                                    className={`btn ${employee ? 'btn-outline-warning' : 'btn-outline-primary'} mt-2 float-right`}
                                    disabled={formik.isSubmitting}
                                >
                                    {loading && <Loading />}
                                    {employee ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default EmployeeForm
