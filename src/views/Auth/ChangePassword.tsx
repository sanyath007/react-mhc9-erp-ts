import React from 'react'
import { useDispatch } from 'react-redux'
import { FaInfoCircle } from 'react-icons/fa'
import { FormGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import api from '../../api'
import { setLoggedInUser } from '../../features/slices/auth/authSlice'

const changeSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string()
                .min(8, "กรุณาระบุรหัสผ่านอย่างน้อย 8 ตัวอักษร")
                .required('กรุณากรอกรหัสผ่านใหม่ก่อน'),
    password_confirmation: Yup.string()
                            .min(8, "กรุณาระบุรหัสผ่านอย่างน้อย 8 ตัวอักษร")
                            .required('กรุณากรอกยืนยันรหัสผ่านใหม่ก่อน')
                            .oneOf([Yup.ref('password'), null], 'กรุณากรอกยืนยันรหัสผ่านใหม่ให้ตรงกับรหัสผ่านใหม่')
});

const ChangePassword = ({ currentUser }: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();

    const handleSubmit = async (values, formik) => {
        try {
            const res = await api.post('/api/change-password', values);

            if (res.data.success) {
                toast.success('เปลี่ยนรหัสผ่านสำเร็จ!!');
                dispatch(setLoggedInUser(res.data.user));
                navigate('/');
            }
        } catch (error) {
            toast.error('พบข้อผิดพลาด ไม่สามารถเปลี่ยนรหัสผ่านได้!!');
        }
    };

    return (
        <Formik
            initialValues={{
                email: currentUser.email,
                password: '',
                password_confirmation: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={changeSchema}
        >
            {(formik) => {
                return (
                    <Form>
                        <div>
                            <h3 className="text-xl font-bold">เปลี่ยนรหัสผ่าน</h3>

                            <div className="alert alert-info text-sm mb-4 w-full flex flex-row items-center gap-1">
                                <FaInfoCircle size={"20px"}  />
                                กรุณาเปลี่ยนรหัสผ่านก่อนใช้งานระบบ
                            </div>

                            <div className="mt-4">
                                <div className="w-[400px]">
                                    <FormGroup className="mb-2">
                                        <label htmlFor="">อีเมล</label>
                                        <div className="form-control bg-gray-100">{formik.values.email}</div>
                                    </FormGroup>
                                    <FormGroup className="mb-2">
                                        <label htmlFor="">รหัสผ่านใหม่</label>
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
                                    </FormGroup>
                                    <FormGroup className="mb-2">
                                        <label htmlFor="">ยืนยันรหัสผ่าน</label>
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
                                    </FormGroup>

                                    <ul className="alert alert-danger text-sm">
                                        <li>ต้องมีความยาวอย่างน้อย 8 ตัวอักษร</li>
                                        <li>สามารถมีตัวอักษร a-z หรือ A-Z หรือ 0-9 ได้</li>
                                        <li>สามารถมีตัวอักขระพิเศษ {'@ # $ % ^ & * _ ! + –'} ได้</li>
                                    </ul>

                                    <button type="submit" className="btn btn-outline-primary btn-sm">
                                        บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ChangePassword;
