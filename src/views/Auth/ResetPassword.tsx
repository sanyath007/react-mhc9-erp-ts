import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spinner } from 'react-bootstrap'
import { FaInfoCircle, FaArrowCircleLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
// import { login, resetSuccess } from '../../features/slices/auth/authSlice'
import api from '../../api'

const resetSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string()
                .min(8, "กรุณาระบุรหัสผ่านอย่างน้อย 8 ตัวอักษร")
                .required('กรุณากรอกรหัสผ่านใหม่ก่อน'),
    password_confirmation: Yup.string()
                            .min(8, "กรุณาระบุรหัสผ่านอย่างน้อย 8 ตัวอักษร")
                            .required('กรุณากรอกยืนยันรหัสผ่านใหม่ก่อน')
                            .oneOf([Yup.ref('password'), null], 'กรุณากรอกยืนยันรหัสผ่านใหม่ให้ตรงกับรหัสผ่านใหม่')
});

const ResetPassword = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch<any>();
    const { isSuccess, isLoading } = useSelector((state: any) => state.auth);
    const [searchParams] = useSearchParams();

    // useEffect(() => {
    //     if (success) {
    //         dispatch(resetSuccess());

    //         navigate('/');
    //     }
    // }, [success]);

    const handleSubmit = async (values, props) => {
        try {
            const res = await api.post(`/api/reset-password`, values);

            if (res.data.success) {
                toast.success('การตั้งรหัสผ่านใหม่สำเร็จ!!');
                /** Try ro Login with email and new password */
                // dispatch(login({ email: values.email, password: values.password }));
                navigate('/login');
            }
        } catch (error) {
            
        }

        props.resetForm();
    };

    return (
        <div className="container flex flex-col justify-center items-center min-h-[100vh]">
            <div className="login-box bg-white w-[440px] min-h-[400px] rounded-lg px-4 py-2 flex flex-col justify-around items-center">
                <h1 className="text-3xl font-bold mt-4 mb-2">ตั้งรหัสผ่านใหม่</h1>

                <div className="alert alert-info text-sm mb-4 w-full flex flex-row items-center gap-1">
                    <FaInfoCircle size={"20px"}  />
                    กรุณาตั้งรหัสผ่านใหม่ของคุณ
                </div>

                <div className="w-[100%] my-4">
                    <Formik
                        initialValues={{
                            email: searchParams ? searchParams.get('email') : '',
                            password: '',
                            password_confirmation: ''
                        }}
                        validationSchema={resetSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formik) => {
                            return (
                                <Form>
                                    <Row className="mb-2">
                                        <Col>
                                            <input
                                                type="text"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                className="form-control bg-gray-100"
                                                placeholder="Email"
                                            />
                                            {(formik.errors.email && formik.touched.email) && (
                                                <span className="text-red-500 text-sm">{formik.errors.email as string}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                className="form-control"
                                                placeholder="รหัสผ่านใหม่"
                                            />
                                            {(formik.errors.password && formik.touched.password) && (
                                                <span className="text-red-500 text-sm">{formik.errors.password as string}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                value={formik.values.password_confirmation}
                                                onChange={formik.handleChange}
                                                className="form-control"
                                                placeholder="ยืนยันรหัสผ่าน"
                                            />
                                            {(formik.errors.password_confirmation && formik.touched.password_confirmation) && (
                                                <span className="text-red-500 text-sm">{formik.errors.password_confirmation as string}</span>
                                            )}
                                        </Col>
                                    </Row>

                                    <ul className="alert alert-danger py-2 text-sm">
                                        <li>ต้องมีความยาวอย่างน้อย 8 ตัวอักษร</li>
                                        <li>สามารถมีตัวอักษร a-z หรือ A-Z หรือ 0-9 ได้</li>
                                        <li>สามารถมีตัวอักขระพิเศษ {'@ # $ % ^ & * _ ! + –'} ได้</li>
                                    </ul>

                                    <div className="d-grid mb-2">
                                        <button type="submit" className="btn btn-outline-primary">
                                            {isLoading && (
                                                <Spinner animation="border" role="status" size="sm" style={{ marginRight: '2px' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            )}
                                            บันทึก
                                        </button>
                                    </div>

                                    <div className="text-center mt-4">
                                        <Link to="/login" className="flex flex-row gap-1 items-center justify-center hover:text-purple-600">
                                            <FaArrowCircleLeft size={"14px"} /> กลับหน้าล็อกอิน
                                        </Link>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>

            <div className="mt-4 text-gray-600 text-sm">
                <a href="https:www.mhc9dmh.com">©ศูนย์สุขภาพจิตที่ 9</a> | โดย สัญญา ธรรมวงษ์
            </div>
        </div>
    )
}

export default ResetPassword