import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'
import moment from 'moment'
import { getRefund } from '../../features/slices/loan-refund/loanRefundSlice'
import { useGetUserDetailsQuery } from '../../features/services/auth/authApi'
import { currency, toLongTHDate, toShortTHDate, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormLoanRefundBill = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { refund } = useSelector((state: any) => state.loanRefund);
    const { data: user } = useGetUserDetailsQuery(undefined, {
        pollingInterval: 900000,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (id) dispatch(getRefund(id));
    }, [dispatch, id]);

    return (
        <>
            {/* PAGE 1 */}
            <div className="paper-container">
                <div className="form-wrapper form-bill">
                    <div className="form-top mb-4">
                        <h1 className="text-3xl font-bold">ใบรับใบสำคัญ</h1>
                    </div>
                    {refund && (
                        <div className="form-box">
                            <div className="mb-2">
                                <div className="flex flex-row justify-between items-start">
                                    <div className="flex flex-row justify-start items-center">
                                        <span className="p-0">เลขที่</span>
                                        <span className="border-b-[1px] border-dashed w-[120px] text-center h-[28px]">
                                            {refund.bill_no}
                                        </span>
                                    </div>
                                    <div className="flex flex-col w-[40%]">
                                        <span>ศูนย์สุขภาพจิตที่ 9</span>
                                        <div className="flex flex-row justify-start items-center">
                                            <span className="p-0">วันที่</span>
                                            <span className="border-b-[1px] border-dashed w-[200px] text-center h-[28px]">
                                                {toLongTHDate(moment(refund.bill_date).toDate())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    <div className="flex flex-row">
                                        <span className="pr-1">ได้รับใบสำคัญจาก</span>
                                        <div className="border-b-[1px] border-dashed w-[35%] text-center indent-0">
                                            {refund.contract?.loan.employee.prefix.name+refund.contract?.loan.employee.firstname+ ' ' +refund.contract?.loan.employee.lastname}
                                        </div>
                                        <span className="indent-0 pr-1">ตำแหน่ง</span>
                                        <div className="border-b-[1px] border-dashed w-[35%] text-center indent-0">
                                            {refund.contract?.loan.employee.position?.name}{refund.contract?.loan.employee.level?.name}
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-2 indent-0">
                                        <span>สังกัดศูนย์สุขภาพจิตที่ 9 เพื่อส่งใช้เงินยืม</span>
                                        <div className="flex flex-row items-center gap-1">
                                            {refund.contract?.loan.money_type_id === 1 ? <FaCheckSquare /> : <FaRegSquare /> } เงินทดลองราชการ
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            {refund.contract?.loan.money_type_id === 2 ? <FaCheckSquare /> : <FaRegSquare /> } เงินยืมนอกงบประมาณ
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            {refund.contract?.loan.money_type_id === 3 ? <FaCheckSquare /> : <FaRegSquare /> } เงินยืมราชการ
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <span className="pr-1 indent-0">ตามสัญญายืมเลขที่</span>
                                        <div className="border-b-[1px] border-dashed w-[80px] text-center indent-0">
                                            {refund.contract?.contract_no}
                                        </div>
                                        <span className="pr-1 indent-0">ลงวันที่</span>
                                        <div className="border-b-[1px] border-dashed w-[180px] text-center indent-0">
                                            {toLongTHDate(moment(refund.contract?.approved_date).toDate())}
                                        </div>
                                        <span className="pr-1 indent-0">เป็นจำนวนเงิน</span>
                                        <div className="border-b-[1px] border-dashed w-[110px] text-center indent-0">
                                            {currency.format(refund.contract?.net_total)}
                                        </div>
                                        <span className="pr-1 indent-0">บาท</span>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="border-b-[1px] border-dashed w-[400px] text-center indent-0">
                                            ({ThaiNumberToText(refund.contract?.net_total)})
                                        </div>
                                        <span className="pr-1 indent-0">และได้ส่งใช้ใบสำคัญ</span>
                                        <span className="pr-1 indent-0">จำนวน</span>
                                        <div className="border-b-[1px] border-dashed w-[60px] text-center indent-0">
                                            1
                                        </div>
                                        <span className="indent-0">ชุด</span>
                                    </div>
                                    <div className="flex flex-row">
                                        <span className="px-1 indent-0">เป็นเงิน</span>
                                        <div className="border-b-[1px] border-dashed w-[130px] text-center indent-0">
                                            {currency.format(refund.net_total)}
                                        </div>
                                        <span className="pr-1 indent-0">บาท</span>
                                        <div className="border-b-[1px] border-dashed w-[420px] text-center indent-0">
                                            ({ThaiNumberToText(refund.net_total)})
                                        </div>
                                    </div>
                                    <div className="flex flex-row indent-0 mt-1 ml-[10px]">
                                        <div className="w-[5%]">โดย</div>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row gap-1">
                                                {(refund.net_total === refund.contract?.net_total) ? <FaCheckSquare /> : <FaRegSquare />} ส่งใช้ใบสำคัญเท่ากับจำนวนเงินที่ยืม
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                {refund.refund_type_id === 2 ? <FaCheckSquare /> : <FaRegSquare />} ส่งใช้ใบสำคัญสูงกว่าจำนวนเงินที่ยืม
                                                <div className="flex flex-row">
                                                    <span className="pr-1">คงเหลือรับจริง</span>
                                                    <div className="border-b-[1px] border-dashed w-[120px] text-center">
                                                        {refund.refund_type_id === 2 && currency.format(refund.balance)}
                                                    </div> บาท
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                {refund.refund_type_id === 1 ? <FaCheckSquare /> : <FaRegSquare />} ส่งใช้ใบสำคัญน้อยกว่าจำนวนเงินที่ยืม
                                                <div className="flex flex-row">
                                                    <span className="pr-1">และส่งใช้ด้วยเงินสด</span>
                                                    <div className="border-b-[1px] border-dashed w-[120px] text-center">
                                                        {refund.refund_type_id === 1 && currency.format(refund.balance)}
                                                    </div> บาท
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <span className="pr-1">ตามใบเสร็จรับเงินเลขที่</span>
                                                <div className="border-b-[1px] border-dashed w-[120px] text-center">
                                                    {/* {refund.receipt_no} */}
                                                </div>
                                                <span className="px-1">ลงวันที่</span>
                                                <div className="border-b-[1px] border-dashed w-[200px] text-center">
                                                    {/* {toLongTHDate(moment(refund.receipt_date).toDate())} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="memo-approvement">
                                    <div className="memo-row">
                                        <div className="w-[40%]">&nbsp;</div>
                                        <div className="w-[60%]">
                                            <div className="text-center w-full">
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row indent-4 pl-8">
                                                        <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                        ผู้รับใบสำคัญ
                                                    </div>
                                                    {user?.permissions[0].role_id === 4 ? (
                                                        <div className="signature">
                                                            <p>({user?.employee?.prefix?.name + user?.employee?.firstname + ' ' + user?.employee?.lastname})</p>
                                                            <p>{`${user?.employee?.position?.name}${user?.employee?.level ? user?.employee?.level?.name : ''}`}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="signature">
                                                            <p>(นางสาวสิรินดา วิถีธรรม)</p>
                                                            <p>นักวิชาการเงินและบัญชี</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="memo-row">
                                        <div className="mt-[60px]">
                                            <div className="flex flex-row">
                                                <span className="pr-1">เลขที่ฎีกา</span>
                                                <div className="border-b-[1px] border-dashed w-[120px] text-center">
                                                    {refund.contract?.bill_no}
                                                </div>
                                                <span className="px-1">ลงวันที่</span>
                                                <div className="border-b-[1px] border-dashed w-[150px] text-center"></div>
                                                <span className="px-1">เบิกเงินจาก</span>
                                                <div className="border-b-[1px] border-dashed w-[150px] text-center"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* END PAGE 1 */}
        </>
    )
}

export default FormLoanRefundBill
