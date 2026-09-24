import React, { Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import { toShortTHDate, toLongTHDateRange } from '../../../utils'

const CourseList = ({ courses, onRemoveCourse }: any) => {
    return (
        <Row>
            <Col>
                <div className="alert alert-primary py-1 px-1 mb-0 mt-2 min-h-[34px]">
                    <h3 className="text-blue-900 ml-1 underline">รายการรุ่น</h3>

                    <ul className="text-sm font-thin">
                        {courses.map((course, index) => (
                            <Fragment key={index} >
                                {!course.removed && (
                                    <li className="hover:bg-blue-300 py-1 px-2 rounded-md">
                                        {/* - รุ่นที่ {course.seq_no ? course.seq_no : ++index} */}
                                        {++index}.{course?.course_date && <span className="ml-1">วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</span>} 
                                        <span className="ml-1">
                                            ณ {course?.room && <span className="mr-1">{course.room}</span>}
                                            {course?.place?.name} จ.{course?.place?.changwat?.name}
                                            <span className="ml-1">{course?.remark && course?.remark}</span>
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger text-sm rounded-full p-0 ml-2"
                                            onClick={() => onRemoveCourse(course.id, !course.loan_id)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </li>
                                )}
                            </Fragment>
                        ))}
                    </ul>
                </div>
            </Col>
        </Row>
    )
}

export default CourseList