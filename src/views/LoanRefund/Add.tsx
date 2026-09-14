import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Breadcrumb } from 'react-bootstrap'
import { resetSuccess } from '../../features/slices/loan-refund/loanRefundSlice'
import LoanRefundForm from './Form'

const AddLoanRefund = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.loanRefund);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetSuccess());
            toast.success('บันทึกรายการหักล้างเงินยืมเรียบร้อย!!');
            navigate('/loan-refund');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan-refund' }}>รายการหักล้างเงินยืม</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มรายการหักล้างเงินยืม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">เพิ่มรายการหักล้างเงินยืม</h1>

                <LoanRefundForm />

            </div>
        </div>
    )
}

export default AddLoanRefund