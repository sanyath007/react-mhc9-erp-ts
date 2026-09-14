import React, { useEffect } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { resetSuccess } from '../../features/slices/loan-contract/loanContractSlice'
import LoanContractForm from './Form'

const AddLoanContract = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { isSuccess } = useSelector((state: any) => state.loanContract);

    useEffect(() => {
        if (isSuccess) {
            toast.success('บันทึกข้อมูลสัญญาเงินยืมเรียบร้อย!!');
            dispatch(resetSuccess());
            navigate('/loan-contract');
        }
    }, [isSuccess]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan-contract' }}>รายการสัญญา</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มสัญญา</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">เพิ่มสัญญา</h1>

                <LoanContractForm />

            </div>
        </div>
    )
}

export default AddLoanContract