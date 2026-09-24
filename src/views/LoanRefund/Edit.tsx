import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Breadcrumb } from 'react-bootstrap'
import { getRefund, resetSuccess } from '../../features/slices/loan-refund/loanRefundSlice'
import LoanRefundForm from './Form'
import Loading from '../../components/ui/Loading'

const EditLoanRefund = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { refund, isLoading, isSuccess } = useSelector((state: any) => state.loanRefund);

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetSuccess());
            toast.success('บันทึกการแก้ไขรายการหักล้างเงินยืมเรียบร้อย!!');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (id) dispatch(getRefund(id));
    }, [id]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan-refund' }}>รายการหักล้างเงินยืม</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขรายการหักล้างเงินยืม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">แก้ไขรายการหักล้างเงินยืม (#{id})</h1>

                {isLoading && <div className="text-center"><Loading /></div>}
                {(!isLoading && refund) && <LoanRefundForm refund={refund} />}
            </div>
        </div>
    )
}

export default EditLoanRefund