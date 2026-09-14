import React, { useEffect, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaInfoCircle, FaArrowCircleLeft } from "react-icons/fa";
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { login, resetSuccess } from '../../features/slices/auth/authSlice'
import api from '../../api'

const loginSchema = Yup.object().shape({
    email: Yup.string().required()
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { success, loading } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if (success) {
            dispatch(resetSuccess());

            navigate('/');
        }
    }, [success]);

    const handleSubmit = async (values, props) => {
        // dispatch(login({ ...values }));
        try {
            const res = await api.post(`/api/forgot-password`, values);
            console.log(res.data);
            
            if (res.data.success) {
                toast.success('ระบบได้ทำการส่งรหัสยืนยันตัวตนไปยังอีเมลของคุณแล้ว!!');
                navigate({ pathname: '/verify-email', search: createSearchParams({ email: values.email }).toString()});
            }
        } catch (error) {
            
        }

        props.resetForm();
    };

    return (
        <div className="container flex flex-col justify-center items-center min-h-[100vh]">
            <div className="login-box bg-white w-[380px] min-h-[400px] rounded-lg px-4 py-4 flex flex-col justify-around items-center">
                <h1 className="text-3xl font-bold mt-4 mb-2">ลืมรหัสผ่าน</h1>

                <div className="alert alert-info text-sm mb-4 w-full flex flex-row items-center gap-1">
                    <FaInfoCircle size={"20px"}  />
                    กรุณากรอกอีเมลที่คุณลงทะเบียนไว้
                </div>

                <div className="w-[100%] my-4">
                    <Formik
                        initialValues={{
                            email: ''
                        }}
                        validationSchema={loginSchema}
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
                                                className="form-control"
                                                placeholder="อีเมล"
                                            />
                                        </Col>
                                    </Row>

                                    <div className="d-grid mb-2">
                                        <button type="submit" className="btn btn-outline-primary">
                                            {loading && (
                                                <Spinner animation="border" role="status" size="sm" style={{ marginRight: '2px' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            )}
                                            ส่งอีเมล <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>

                                    <div className="text-xs flex flex-row items-center gap-1">
                                        <i className="fas fa-info-circle"></i>
                                        <span>ระบบจะส่งรหัสยืนยันตัวตนของท่านไปยังอีเมลที่ลงทะเบียนไว้</span>
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

export default ForgotPassword