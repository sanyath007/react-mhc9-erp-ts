import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getRefund } from '../../features/slices/loan-refund/loanRefundSlice'
import { currency, toLongTHDate, toShortTHDate, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormLoanReturn = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { refund } = useSelector((state: any) => state.loanRefund);

    useEffect(() => {
        if (id) dispatch(getRefund(id));
    }, [dispatch, id]);

    return (
        <>
            {/* PAGE 1 */}
            {refund && <div className="paper-container">
                <div className="memo-wrapper">
                    <div className="memo-top">
                        <div className="memo-logo">
                            <img src={`${process.env.REACT_APP_API_URL}/img/krut.jpg`} />
                        </div>
                        <h1>บันทึกข้อความ</h1>
                    </div>
                    <div className="memo-box">
                        <div className="memo-header">
                            <div className="memo-header-text">
                                <h3>ส่วนราชการ</h3>
                                <div className="memo-header-value">
                                    <span>{refund.contract?.loan?.department?.name} ศูนย์สุขภาพจิตที่ ๙ โทร o ๔๔๒๕ ๖๗๒๙</span>
                                    {/* refund.contract?.loan?.division?.name+ ' '+ */}
                                </div>
                            </div>
                            <div className="memo-header-text">
                                <div>
                                    <h3>ที่</h3>
                                    <div className="memo-header-value">
                                        <span>{refund.doc_no}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3>วันที่</h3>
                                    <div className="memo-header-value">
                                        <span>{toLongTHDate(moment(refund.doc_date).toDate())}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="memo-header-text">
                                <h3>เรื่อง</h3>
                                <div className="memo-header-value">
                                    <span>ขออนุมัติคืนเงินยืมราาชการเต็มจำนวน</span>
                                </div>
                            </div>
                            <div className="memo-header-text">
                                <h3>เรียน</h3>
                                <span>อธิบดีกรมสุขภาพจิต</span>
                            </div>
                        </div>
                        <div className="memo-content">
                            <div className="memo-paragraph">
                                ตามที่หนังสือ {refund.contract?.loan?.department?.name} เลขที่ {refund.return_no} ลงวันที่ {toLongTHDate(moment(refund.return_date).toDate())}
                                <span className="ml-1">{refund.return_topic}</span>
                                {/* <span className="mx-1">
                                    ระหว่างวันที่ {toLongTHDate(moment(refund.contract?.loan?.project_sdate).toDate())} ถึงวันที่ {toLongTHDate(moment(refund.contract?.loan?.project_edate).toDate())}
                                </span>
                                ณ{refund.contract?.loan?.courses.length  > 0 && refund.contract?.loan?.courses.map((course, index) => (
                                    <span className="mx-1" key={course.id}>
                                        {course.place?.name} จ.{course.place?.changwat?.name}
                                    </span>
                                ))} */}
                                <span className="mx-1">โดยใช้เงินงบประมาณศูนย์สุขภาพจิตที่ 9</span>
                                ตาม{refund.contract?.loan?.budgets && refund.contract?.loan?.budgets.map((data, index) => (
                                    <span key={data.budget_id}>
                                        {data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}
                                        {refund.contract?.loan?.budgets.length > 1 && <span className="mx-1">จำนวนเงิน {currency.format(data.total)} บาท</span>}
                                    </span>
                                ))}
                                <span className="ml-1">
                                    รวมจำนวนเงินทั้งสิ้น {currency.format(refund.contract?.loan?.budget_total)} บาท ({ThaiNumberToText(refund.contract?.loan?.budget_total)})
                                </span>
                                <span className="ml-1">
                                    {refund.return_reason}
                                </span> นั้น
                            </div>

                            <div className="memo-paragraph">
                                ในการนี้ ข้าพเจ้า{refund.contract?.loan.employee.prefix.name+refund.contract?.loan.employee.firstname+ ' ' +refund.contract?.loan.employee.lastname}
                                <span className="ml-1">{refund.contract?.loan.employee.position?.name}{refund.contract?.loan.employee.level?.name}</span>
                                <span className="ml-1">
                                    ขออนุมัติคืนเงินยืมราาชการเต็มจำนวน เป็นจำนวนเงินทั้งสิ้น {currency.format(refund.balance)} บาท ({ThaiNumberToText(refund.balance)})
                                </span>
                            </div>

                            <div className="memo-paragraph">
                                จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบโปรดลงนามอนุมัติ จะเป็นพระคุณ
                            </div>

                            <div className="memo-approvement">
                                <div className="memo-row">
                                    <div style={{ width: '40%' }}>&nbsp;</div>
                                    <div style={{ width: '60%' }}>
                                        <div style={{ textAlign: 'center', width: '100%' }}>
                                            <div className="pt-[40px] flex flex-col items-center justify-center">
                                                <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                <div className="signature">
                                                    <p>({refund.contract?.loan?.employee.prefix.name+refund.contract?.loan?.employee.firstname+ ' ' +refund.contract?.loan?.employee.lastname})</p>
                                                    <p>{refund.contract?.loan?.employee.position?.name}{refund.contract?.loan?.employee.level?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="memo-row">
                                    <div style={{ width: '40%' }}>
                                        <div style={{ width: '100%', height: '100px' }}>
                                            <div className="text-center">
                                                <p className="text-lg font-bold">อนุมัติ, เห็นชอบ, ลงนามแล้ว</p>
                                            </div>
                                            <div className="pt-[40px] flex flex-col items-center justify-center">
                                                <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                <div className="signature">
                                                    <p>(นางสาวจุฑามาศ วรรณศิลป์)</p>
                                                    <p>ผู้อำนวยการศูนย์สุขภาพจิตที่ 9</p>
                                                    {/* <p>รักษาราชการแทนผู้อำนวยการศูนย์สุขภาพจิตที่ 9</p> */}
                                                    <p>ปฏิบัติราชการแทนอธิบดีกรมสุขภาพจิต</p>
                                                    <div className="signature-date">
                                                        <p>วันที่</p>
                                                        <div style={{ width: '150px', borderBottom: '1px dashed black' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {/* END PAGE 1 */}
        </>
    )
}

export default FormLoanReturn
