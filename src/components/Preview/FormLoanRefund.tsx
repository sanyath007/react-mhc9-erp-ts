import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getRefund } from '../../features/slices/loan-refund/loanRefundSlice'
import { currency, toLongTHDate, toLongTHDateRange, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormLoanRefund = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { refund } = useSelector((state: any) => state.loanRefund);

    useEffect(() => {
        if (id) dispatch(getRefund(id));
    }, [dispatch, id]);

    return (
        <>
            {/* PAGE 1 */}
            <div className="paper-container">
                <div className="memo-wrapper">
                    <div className="memo-top">
                        <div className="memo-logo">
                            <img src={`${process.env.REACT_APP_API_URL}/img/krut.jpg`} />
                        </div>
                        <h1>บันทึกข้อความ</h1>
                    </div>
                    {refund && (
                        <div className="memo-box">
                            <div className="memo-header">
                                <div className="memo-header-text">
                                    <h3>ส่วนราชการ</h3>
                                    <div className="memo-header-value">
                                        <span>ศูนย์สุขภาพจิตที่ ๙ {refund.contract?.loan.division ? refund.contract?.loan?.division?.name : refund.contract?.loan?.department?.name} โทร o ๔๔๒๕ ๖๗๒๙  โทรสาร o ๔๔๒๕ ๖๗๓๐</span>
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
                                        <span>ขอส่งหลักฐานเพื่อหักล้างเงินยืม</span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรียน</h3>
                                    <span>อธิบดีกรมสุขภาพจิต</span>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    ตามหนังสือ {refund.contract?.loan.division ? refund.contract?.loan?.division?.name : refund.contract?.loan?.department?.name} ที่ {refund.contract?.loan?.doc_no} ลงวันที่ {toLongTHDate(moment(refund.contract?.loan?.doc_date).toDate())}
                                    {refund.contract?.loan?.loan_type_id === 1 
                                        ? <span className="ml-1">ได้ขออนุมัติยืมเงินราชการในการจัด{refund.contract?.loan?.project_name}</span>
                                        : <span className="ml-1">เรื่อง ขออนุมัติยืมเงินราชการ เพื่อเป็นค่าใช้จ่ายในการเดินทางไปราชการเข้าร่วม{refund.contract?.loan?.project_name}</span>
                                    }
                                    <span className="mx-1">
                                        ระหว่างวันที่ {toLongTHDate(moment(refund.contract?.loan?.project_sdate).toDate())} ถึงวันที่ {toLongTHDate(moment(refund.contract?.loan?.project_edate).toDate())}
                                    </span>
                                    ณ{refund.contract?.loan?.courses.length > 0 && refund.contract?.loan?.courses.map((course, index) => (
                                        <span className="mx-1" key={course.id}>
                                            {index > 0 && 'และ'}{course.place?.name} จ.{course.place?.changwat?.name}
                                        </span>
                                    ))}
                                    <span className="mx-1">จากงบประมาณศูนย์สุขภาพจิตที่ 9</span>
                                    ตาม{refund.contract?.loan?.budgets && refund.contract?.loan?.budgets.map((data, index) => (
                                        <span key={data.budget_id}>
                                            {data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}
                                            {refund.contract?.loan?.budgets.length > 1 && <span className="mx-1">จำนวนเงิน {currency.format(data.total)} บาท</span>}
                                        </span>
                                    ))}
                                    <span className="ml-1">
                                        รวมจำนวนเงินทั้งสิ้น {currency.format(refund.contract?.loan?.budget_total)} บาท ({ThaiNumberToText(refund.contract?.loan?.budget_total)})
                                    </span> นั้น
                                </div>

                                <div className="memo-paragraph">
                                    ในการนี้ ข้าพเจ้า{refund.contract?.loan.employee.prefix.name+refund.contract?.loan.employee.firstname+ ' ' +refund.contract?.loan.employee.lastname}
                                    <span className="ml-1">{refund.contract?.loan.employee.position?.name}{refund.contract?.loan.employee.level?.name}</span>
                                    <span className="ml-1">
                                        {refund.contract?.loan?.loan_type_id === 1 && 'ได้ดำเนินการจัดโครงการฯ เสร็จสิ้นแล้ว '}จึงขอส่งหลักฐานเงินยืมราชการ</span>
                                    <span className="ml-1">
                                        เป็นจำนวนเงิน {currency.format(refund.net_total)} บาท ({ThaiNumberToText(refund.net_total)})
                                    </span>
                                    <span className="ml-1">
                                        {refund.refund_type_id === 1
                                            ? 'และคืนเงินยืมราชการ'
                                            : refund.refund_type_id === 2 ? 'และเบิกเงินเพิ่ม' : ''}
                                    </span>
                                    {refund.budgets && refund.budgets.map((data, index) => (
                                        <span key={data.budget_id}>
                                            {data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}
                                            {refund.contract?.loan?.budgets.length > 1 && <span className="mx-1">จำนวนเงิน {currency.format(data.total)} บาท</span>}
                                        </span>
                                    ))} เป็นจำนวนเงินทั้งสิ้น {currency.format(refund.balance)} บาท ({ThaiNumberToText(refund.balance)})
                                    <span className="ml-1">
                                        มีรายละเอียดดังต่อไปนี้
                                    </span>

                                    {/* รายการขออนุมัติจัดซื้อจัดจ้าง */}
                                    {refund.details && refund.details.some(item => item.contract_detail?.expense_group === 2) && (
                                        <div className="indent-0 mt-1">
                                            <p className="indent-[1.3cm] mx-1 font-bold">ขออนุมัติจัดซื้อจัดจ้างตามรายละเอียดดังนี้</p>
                                            {refund.details && refund.details
                                                .filter(item => item.contract_detail?.expense_group === 2)
                                                .map((data, index) => (
                                                    <table className="w-full indent-[1.4cm]">
                                                        <tr>
                                                            <td className="w-[50%]">
                                                                <span>-{data.contract_detail?.expense?.name}</span>
                                                            </td>
                                                            <td className="w-[32%] indent-0 text-right pr-8">
                                                                <span className="mr-4">เป็นเงิน</span>{currency.format(data.total)} บาท
                                                            </td>
                                                        </tr>
                                                    </table>
                                                )
                                            )}

                                            <div className="font-bold">
                                                <table className="w-full indent-[1.4cm]">
                                                    <tr>
                                                        <td className="w-[50%]"></td>
                                                        <td className="w-[50%] indent-0 text-right pr-8">
                                                            รวมเป็นเงิน {currency.format(refund.order_total)} บาท 
                                                            {/* ({ThaiNumberToText(refund.order_total)}) */}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* รายการค่าใช้จ่าย */}
                                    <div>
                                        {(refund.contract?.loan?.courses && refund.contract?.loan?.courses.length > 1)
                                            // รายการค่าใช้จ่ายแบบแยกวัน
                                            ? refund.contract?.loan?.courses.map(course => {
                                                let courseTotal = 0;

                                                return (
                                                    <div className="mt-2" key={course.id}>
                                                        <p className="indent-[1.3cm]">
                                                            {course?.course_date && <span className="mx-1 font-bold">วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</span>} 
                                                            ณ {course?.place?.name} {/* จ.{course?.place?.changwat?.name} */}
                                                        </p>

                                                        {refund.details && refund.details
                                                            .filter(item => item.contract_detail?.expense_group === 1)
                                                            .map((data, index) => {
                                                                // คำนวณยอดรวมของแต่ละวัน
                                                                courseTotal += parseInt(data.contract_detail?.loan_detail?.course_id, 10) === course.id ? parseFloat(data.total) : 0;

                                                                return (
                                                                    <div key={index}>
                                                                        {parseInt(data.contract_detail?.loan_detail?.course_id, 10) === course.id && (
                                                                            <table className="w-full indent-[1.4cm]">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td className="w-[68%]">
                                                                                            <span>-{data.contract_detail?.expense?.name}</span>
                                                                                            {(data.description && data.contract_detail?.expense?.pattern)
                                                                                                ? (
                                                                                                    <span className="ml-1">
                                                                                                        {replaceExpensePatternFromDesc(data.contract_detail?.expense?.pattern, data.description)}
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="ml-1">
                                                                                                        {data.description && <span>({data.description})</span>}
                                                                                                    </span>
                                                                                                )
                                                                                            }
                                                                                        </td>
                                                                                        <td className="w-[32%] indent-0 text-right pr-8">
                                                                                            <span className="mr-4">เป็นเงิน</span>{currency.format(data.total)} บาท
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        )}
                                                                    </div>
                                                                )
                                                            }
                                                        )}

                                                        <div className="font-bold">
                                                            <table className="w-full indent-[1.4cm]">
                                                                <tr>
                                                                    <td className="w-[50%]"></td>
                                                                    <td className="w-[50%] indent-0  text-right pr-8">
                                                                        รวมเป็นเงิน {currency.format(courseTotal)} บาท 
                                                                        {/* ({ThaiNumberToText(courseTotal)}) */}
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )
                                            })

                                            // รายการค่าใช้จ่ายแบบรวม
                                            : refund.details && refund.details
                                                .filter(item => item.contract_detail?.expense_group === 1)
                                                .map((data, index) => {
                                                    return (
                                                        <div className="mt-2" key={index}>
                                                            <table className="w-full indent-[1.4cm]">
                                                                <tr>
                                                                    <td className="w-[68%]">
                                                                        <span>-{data.contract_detail?.expense?.name}</span>
                                                                        {(data.description && data.contract_detail?.expense?.pattern)
                                                                            ? (
                                                                                <span className="ml-1">
                                                                                    {replaceExpensePatternFromDesc(data.contract_detail?.expense?.pattern, data.description)}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="ml-1">
                                                                                    {data.description && <span>({data.description})</span>}
                                                                                </span>
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td className="w-[32%] indent-0 text-right pr-8">
                                                                        <span className="mr-4">เป็นเงิน</span>{currency.format(data.total)} บาท
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    )
                                                }
                                            )
                                        }

                                        {/* ยอดรวมของรายการค่าใช้จ่ายแบบรวม */}
                                        {(refund.contract?.loan?.courses && refund.contract?.loan?.courses.length === 1) && (
                                            <div className="font-bold">
                                                <table className="w-full indent-[1.4cm]">
                                                    <tr>
                                                        <td className="w-[50%]"></td>
                                                        <td className="w-[50%] indent-0 text-right pr-8">
                                                            รวมเป็นเงิน {currency.format(refund.item_total)} บาท 
                                                            {/* ({ThaiNumberToText(refund.item_total)}) */}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        )}

                                        <div className="indent-[1.5cm] font-bold">
                                            รวมจำนวนเงินทั้งสิ้น {currency.format(refund.net_total)} บาท ({ThaiNumberToText(refund.net_total)})
                                        </div>
                                    </div>

                                    {refund.details.length > 1 && (
                                        <div className="indent-0 mt-2">
                                            <span className="underline">หมายเหตุ</span> - ค่าใช้จ่ายแต่ละรายการสามารถถัวเฉลี่ยจ่ายแทนกันได้
                                        </div>
                                    )}
                                </div>

                                <div className="memo-paragraph">
                                    จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติต่อไปด้วย จะเป็นพระคุณ
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
                                                    <p className="text-lg font-bold">อนุมัติ</p>
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
                    )}
                </div>
            </div>
            {/* END PAGE 1 */}
        </>
    )
}

export default FormLoanRefund
