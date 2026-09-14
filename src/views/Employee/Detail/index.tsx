import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployee } from '../../../features/slices/employee/employeeSlice'
import { resetSuccess } from '../../../features/slices/member/memberSlice'
import { toShortTHDate, calcAgeY } from '../../../utils'
import MemberList from './Member/MemberList'
import AddMember from './Member/AddMember'
import ChangeAvatar from './ChangeAvatar'
import EmployeeAvatar from './EmployeeAvatar'
import Loading from '../../../components/ui/Loading'

const EmployeeDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.member);
    const { employee, isLoading, isSuccess: isUploaded } = useSelector((state: any) => state.employee);
    const [isShow, setIsShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(getEmployee(id))
    }, [id]);

    useEffect(() => {
        if (isSuccess) dispatch(resetSuccess());
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/employee" }}>บุคลากร</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดบุคลากร</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายละเอียดบุคลากร ID: {id}</h2>

                <div className="my-2 border p-4 rounded-md min-h-[75vh]">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {(!isLoading && employee) && (
                        <>
                            <Row className="mb-4">
                                <Col md={3} className="flex flex-col justify-center items-center">
                                    <EmployeeAvatar
                                        avatarUrl={selectedImage ? '' : employee.avatar_url || ''}
                                        selectedImage={selectedImage}
                                    />

                                    <ChangeAvatar
                                        employee={employee}
                                        selected={selectedImage}
                                        onSelect={(image) => setSelectedImage(image)}
                                    />
                                </Col>
                                <Col md={9}>
                                    <div className="flex flex-col space-y-2 font-thin">
                                        <p>
                                            <b>เลขที่เจ้าหน้าที่ : </b>{employee.employee_no}
                                            <b className="ml-2">เลข 13 หลัก : </b>{employee.cid}
                                        </p>
                                        <p>
                                            <b>ชื่อ-สกุล : </b>{employee.prefix?.name}{employee.firstname} {employee.lastname}
                                            <b className="ml-2">วันเดือนปีเกิด : </b>{employee.birthdate && toShortTHDate(employee.birthdate)} <span>อายุ {calcAgeY(employee.birthdate)} ปี</span></p>
                                        <p>
                                            <b>ที่อยู่ : </b>{employee.address_no} หมู่ {employee.moo || '-'} ถนน{employee.road || '-'} {' '}
                                            ต.{employee.tambon?.name} อ.{employee.amphur?.name} จ.{employee.changwat?.name} {employee.zipcode}
                                        </p>
                                        <p>
                                            <b>ตำแหน่ง : </b>{employee.position?.name}{employee.level && employee.level.name}
                                        </p>
                                        <p>
                                            <b>วันที่บรรจุ : </b>{employee.assigned_at && toShortTHDate(employee.assigned_at)}
                                            <b className="ml-2">วันที่เริ่มปฏิบัติงาน : </b>{employee.started_at && toShortTHDate(employee.started_at)}
                                        </p>
                                        <div className="flex flex-row items-center mb-2">
                                            <b className="mr-1">สถานะ : </b>
                                            {employee.status === 1 && <h2 className="badge rounded-pill bg-success">ปฏิบัติราชการ</h2>}
                                            {employee.status === 2 && <h2 className="badge rounded-pill bg-bg-light text-dark">ย้าย</h2>}
                                            {employee.status === 3 && <h2 className="badge rounded-pill bg-bg-light text-dark">โอน</h2>}
                                            {employee.status === 4 && <h2 className="badge rounded-pill bg-dark">เกษียณ</h2>}
                                            {employee.status === 5 && <h2 className="badge rounded-pill bg-primary">ช่วยราชการ</h2>}
                                            {employee.status === 6 && <h2 className="badge rounded-pill bg-info">ลาศึกษาต่อ</h2>}
                                            {employee.status === 7 && <h2 className="badge rounded-pill bg-warning">พักราชการ</h2>}
                                            {employee.status === 9 && <h2 className="badge rounded-pill bg-danger">ลาออก</h2>}
                                            {employee.status === 99 && <h2 className="badge rounded-pill bg-secondary">ไม่ทราบ</h2>}
                                        </div>
                                        <div className="flex flex-row items-center">
                                            <a href="#" className="btn btn-primary">เปลี่ยนสถานะ</a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <div className="mt-4">
                                        <div className="flex flex-row justify-between items-center mb-2">
                                            <h2 className="font-bold text-lg">สังกัดหน่วยงาน</h2>

                                            {!isShow && (
                                                <button className="btn btn-primary btn-sm" onClick={() => setIsShow(!isShow)}>
                                                    เพิ่ม
                                                </button>
                                            )}
                                        </div>

                                        <AddMember
                                            isShow={isShow}
                                            onCancel={() => setIsShow(false)}
                                            employeeId={employee.id}
                                        />
                                        <MemberList employee={employee} />
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default EmployeeDetail
