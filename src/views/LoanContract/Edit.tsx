import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getContract, resetSuccess } from '../../features/slices/loan-contract/loanContractSlice'
import LoanContractForm from './Form'
import Loading from '../../components/ui/Loading'

const EditLoanContract = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const { contract, isLoading, isSuccess } = useSelector((state: any) => state.loanContract);

    useEffect(() => {
        if (isSuccess) {
            toast.success('แก้ไขข้อมูลสัญญาเงินยืมเรียบร้อย!!');
            dispatch(resetSuccess());
            navigate('/loan-contract');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (id) {
            dispatch(getContract(id));
        }
    }, [id]);

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ยืมเงินราชการ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/loan-contract' }}>รายการสัญญา</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขสัญญา</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h1 className="text-xl font-bold mb-1">แก้ไขสัญญา (ID: {id})</h1>

                {isLoading
                    ? <div className="text-center"><Loading /></div>
                    : <LoanContractForm contract={contract} />
                }
            </div>
        </div>
    )
}

export default EditLoanContract