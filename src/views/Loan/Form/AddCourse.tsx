import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Col, Row } from 'react-bootstrap'
import { DatePicker } from '@material-ui/pickers'
import { FaAngleDown, FaSearch, FaPlus } from 'react-icons/fa'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { useStyles } from '../../../hooks/useStyles'
import ModalPlaceForm from '../../../components/Modals/Place/Form'
import ModalPlaceList from '../../../components/Modals/Place/List'

const courseSchema = (expenseCalc) => Yup.object().shape({
    course_date: Yup.string().when([], {
        is: () => expenseCalc === '2', 
        then: () => Yup.string().required('กรุณาเลือกวันที่ก่อน'),
    }),
    place_id: Yup.string().required('กรุณาเลือกสถานที่ก่อน')
});

const AddCourse = ({ courses, defaultCourseDate, expenseCalc, onAdd }: any) => {
    const classes = useStyles()
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [showPlaceFormModal, setShowPlaceFormModal] = useState(false);
    const [selectedCourseSDate, setSelectedCourseSDate] = useState(defaultCourseDate ? moment(defaultCourseDate) : moment());
    const [selectedCourseEDate, setSelectedCourseEDate] = useState(defaultCourseDate ? moment(defaultCourseDate) : moment());
    const [place, setPlace] = useState(null);

    useEffect(() => {
        setSelectedCourseSDate(moment(defaultCourseDate));
        setSelectedCourseEDate(moment(defaultCourseDate));
    }, [defaultCourseDate]);

    const handleSubmit = (values, formik) => {
        const course = {
            ...values,
            id: uuid(),
            course_date: expenseCalc === 2 ? selectedCourseSDate.format('YYYY-MM-DD') : '',
            room: values.room
        };

        onAdd(course);

        formik.resetForm();
        setPlace(null);
        setSelectedCourseSDate(defaultCourseDate ? moment(defaultCourseDate) : moment());
        setSelectedCourseEDate(defaultCourseDate ? moment(defaultCourseDate) : moment());
    };

    return (
        <Formik
            initialValues={{
                id: '',
                course_date: '',
                course_edate: '',
                room: '',
                place_id: '',
                place: null,
                remark: ''
            }}
            validationSchema={courseSchema(expenseCalc)}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Row>
                        <ModalPlaceList
                            isShow={showPlaceModal}
                            onHide={() => setShowPlaceModal(false)}
                            onSelect={(place) => {
                                setPlace(place);
                                formik.setFieldValue('place_id', place.id);
                                formik.setFieldValue('place', place);
                            }}
                            />

                        <ModalPlaceForm
                            isShow={showPlaceFormModal}
                            onHide={() => setShowPlaceFormModal(false)}
                            onSubmit={(place) => {
                                setPlace(place);
                                formik.setFieldValue('place_id', place?.id);
                                formik.setFieldValue('place', place);
                            }}
                        />
                        <Col>
                            <Row>
                                {expenseCalc === 2 && (
                                    <>
                                        <Col md={2} className="pr-1">
                                            <label htmlFor="">รุ่นวันที่</label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedCourseSDate}
                                                onChange={(date) => {
                                                    setSelectedCourseSDate(date);
                                                    formik.setFieldValue('course_date', moment(date).format('YYYY-MM-DD'));

                                                    /** Set course_edate according to selected course_date */
                                                    setSelectedCourseEDate(date);
                                                }}
                                                className={classes.muiTextFieldInput}
                                            />
                                            {(formik.errors.course_date && formik.touched.course_date) && (
                                                <span className="text-red-500 text-xs">{formik.errors.course_date as string}</span>
                                            )}
                                        </Col>
                                        <Col md={2} className="px-1">
                                            <label htmlFor="">ถึงวันที่ <span className="text-red-500">(ถ้ามี)</span></label>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedCourseEDate}
                                                onChange={(date) => {
                                                    setSelectedCourseEDate(date);
                                                    formik.setFieldValue('course_edate', moment(date).format('YYYY-MM-DD'));
                                                }}
                                                className={classes.muiTextFieldInput}
                                            />
                                            {(formik.errors.course_edate && formik.touched.course_edate) && (
                                                <span className="text-red-500 text-xs">{formik.errors.course_edate as string}</span>
                                            )}
                                        </Col>
                                    </>
                                )}
                                <Col md={expenseCalc === 2 ? 8 : 4} className={`${expenseCalc === 2 ? "px-1" : "pr-1"}`}>
                                    <label htmlFor="">ชื่อห้องประชุม <span className="text-red-500">(ถ้ามี)</span></label>
                                    <input
                                        type="text"
                                        name="room"
                                        value={formik.values.room}
                                        onChange={formik.handleChange}
                                        className={`form-control text-sm ${(formik.errors.room && formik.touched.room) && 'border-red-500'}`}
                                    />
                                    {(formik.errors.room && formik.touched.room) && (
                                        <span className="text-red-500 text-xs">{formik.errors.room as string}</span>
                                    )}
                                </Col>
                                <Col md={expenseCalc === 2 ? 6 : 8} className={`${expenseCalc === 2 ? "mt-2" : ""} pr-1`}>
                                    <label htmlFor="">สถานที่จัด</label>
                                    <div className="input-group">
                                        <div className={`form-control text-sm h-[34px] bg-gray-100 ${(formik.errors.place_id && formik.touched.place_id) && 'border-red-500'}`}>
                                            {place?.name} {place && <span>จ.{place?.changwat?.name}</span>}
                                        </div>
                                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowPlaceModal(true)}>
                                            <FaSearch />
                                        </button>
                                        <button type="button" className="btn btn-outline-success btn-sm px-2" onClick={() => setShowPlaceFormModal(true)}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                    {(formik.errors.place_id && formik.touched.place_id) && (
                                        <span className="text-red-500 text-xs">{formik.errors.place_id as string}</span>
                                    )}
                                </Col>
                                <Col md={expenseCalc === 2 ? 6 : 12} className={`${expenseCalc === 2 ? "px-1" : "pr-1"} mt-2`}>
                                    {expenseCalc === 2 && <label htmlFor="">รายละเอียดเพิ่มเติม <span className="text-red-500">(ถ้ามี)</span></label>}
                                    <input
                                        type="text"
                                        name="remark"
                                        value={formik.values.remark}
                                        onChange={formik.handleChange}
                                        className={`form-control text-sm ${(formik.errors.remark && formik.touched.remark) && 'border-red-500'}`}
                                        placeholder={`${expenseCalc === 2 ? '' : 'รายละเอียดเพิ่มเติม (ถ้ามี)'}`}
                                    />
                                    {(formik.errors.remark && formik.touched.remark) && (
                                        <span className="text-red-500 text-xs">{formik.errors.remark as string}</span>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                        <Col md={1} className="pl-1">
                            <label htmlFor=""></label>
                            <div className='flex flex-row items-center'>
                                <button
                                    type="button"
                                    className={`btn btn-outline-primary btn-sm flex flex-col justify-center items-center px-3`}
                                    onClick={formik.submitForm}
                                >
                                    เพิ่ม <FaAngleDown />
                                </button>
                            </div>
                        </Col>
                    </Row>
                )
            }}
        </Formik>
    )
}

export default AddCourse