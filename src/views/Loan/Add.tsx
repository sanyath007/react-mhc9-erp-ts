import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { resetSuccess } from '../../features/slices/loan/loanSlice'
import LoanForm from './Form'

const AddLoan = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.loan);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลคำขอเรียบร้อยแล้ว!!');
            dispatch(resetSuccess());
            navigate('/loan')
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan' }}>รายการคำขอยืมเงิน</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มคำขอยืมเงิน</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">เพิ่มคำขอยืมเงิน</h1>

                <LoanForm />

            </div>
        </div>
    )
}

export default AddLoan