import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getLoan } from '../../features/slices/loan/loanSlice'
import { currency, toLongTHDate, toLongTHDateRange, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormLoan = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { loan } = useSelector((state: any) => state.loan);

    useEffect(() => {
        if (id) dispatch(getLoan(id));
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
                    {loan && (
                        <div className="memo-box">
                            <div className="memo-header">
                                <div className="memo-header-text">
                                    <h3>ส่วนราชการ</h3>
                                    <div className="memo-header-value">
                                        <span>ศูนย์สุขภาพจิตที่ ๙ {loan.division ? loan.division?.name : loan.department?.name} โทร o ๔๔๒๕ ๖๗๒๙  โทรสาร o ๔๔๒๕ ๖๗๓๐</span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <div>
                                        <h3>ที่</h3>
                                        <div className="memo-header-value">
                                            <span>{loan.doc_no}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3>วันที่</h3>
                                        <div className="memo-header-value">
                                            <span>{toLongTHDate(moment(loan.doc_date).toDate())}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรื่อง</h3>
                                    <div className="memo-header-value">
                                        <span>ขออนุมัติยืมเงินราชการ</span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรียน</h3>
                                    <span>อธิบดีกรมสุขภาพจิต</span>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    ตามหนังสือ {loan.project_owner} ที่ {loan.project_no} ลงวันที่ {toLongTHDate(moment(loan.project_date).toDate())}
                                    {loan.loan_type_id === 1 
                                        ? <span className="ml-1">กำหนดจัด{loan.project_name}</span>
                                        : <span className="ml-1">เรื่อง ขออนุมัติเดินทางไปราชการเพื่อเข้าร่วม{loan.project_name}</span>
                                    }
                                    <span className="mx-1">
                                        ระหว่างวันที่ {toLongTHDate(moment(loan.project_sdate).toDate())} ถึงวันที่ {toLongTHDate(moment(loan.project_edate).toDate())}
                                    </span>
                                    ณ{loan?.courses.length > 0 && loan?.courses.map((course, index) => (
                                        <span className="mx-1" key={course.id}>
                                            {index > 0 && 'และ'}{course.place?.name} จ.{course.place?.changwat?.name}
                                        </span>
                                    ))} นั้น
                                </div>
                                <div className="memo-paragraph">
                                    ข้าพเจ้า<span className="mx-1">{loan.employee.prefix.name+loan.employee.firstname+ ' ' +loan.employee.lastname}</span>
                                    ตำแหน่ง<span className="mx-1">{loan.employee.position?.name}{loan.employee.level?.name}</span> ขออนุมัติยืมเงินงบประมาณศูนย์สุขภาพจิตที่ 9
                                    ตาม{loan.budgets && loan.budgets.map((data, index) => (
                                        <span key={data.budget_id}>
                                            <span>{data.budget?.activity?.project?.plan?.name} {data.budget?.activity?.project?.name} {data.budget?.activity?.name}</span>
                                            {loan.budgets.length > 1 && <span className="mx-1">จำนวนเงิน {currency.format(data.total)} บาท</span>}
                                        </span>
                                    ))}
                                    <span className="ml-1">
                                        รวมเป็นเงินทั้งสิ้น {currency.format(loan.budget_total)} บาท ({ThaiNumberToText(loan.budget_total)})
                                    </span>
                                    <span className="ml-1">
                                        มีรายละเอียดดังต่อไปนี้
                                    </span>

                                    {/* รายการขออนุมัติจัดซื้อจัดจ้าง */}
                                    {loan.details && loan.details.some(item => item.expense_group === 2) && (
                                        <div className="indent-0 mt-1">
                                            <p className="indent-[1.3cm] mx-1 font-bold">ขออนุมัติจัดซื้อจัดจ้างตามรายละเอียดดังนี้</p>
                                            {loan.details && loan.details
                                                .filter(item => item.expense_group === 2)
                                                .map((data, index) => (
                                                    <table className="w-full indent-[1.4cm]">
                                                        <tr>
                                                            <td className="w-[68%]">
                                                                <span>-{data.expense?.name}</span>
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
                                                            รวมเป็นเงิน {currency.format(loan.order_total)} บาท 
                                                            {/* ({ThaiNumberToText(loan.order_total)}) */}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* รายการค่าใช้จ่าย */}
                                    <div className="mt-4">
                                        {(loan.courses && loan.courses.length > 1)
                                            // รายการค่าใช้จ่ายแบบแยกวัน
                                            ? loan.courses.map(course => {
                                                let courseTotal = 0;

                                                return (
                                                    <div className="mt-2" key={course.id}>
                                                        <p className="indent-[1.3cm]">
                                                            {course?.course_date && (
                                                                <>
                                                                    <span className="mx-1 font-bold">วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</span>
                                                                    <span>ณ {course?.place?.name} {/* จ.{course?.place?.changwat?.name} */}</span>
                                                                    <span className="ml-1">{course?.remark && course?.remark}</span>
                                                                </>
                                                            )}
                                                        </p>
                                                        {loan.details && loan.details
                                                            .filter(item => item.expense_group === 1)
                                                            .map((data, index) => {
                                                                // คำนวณยอดรวมของแต่ละวัน
                                                                courseTotal += parseInt(data.course_id, 10) === course.id ? parseFloat(data.total) : 0;

                                                                return (
                                                                <div key={index}>
                                                                    {parseInt(data.course_id, 10) === course.id && (
                                                                        <table className="w-full indent-[1.4cm]">
                                                                            <tr>
                                                                                <td className="w-[68%]">
                                                                                    <span>-{data.expense?.name}</span>
                                                                                    {(data.description && data.expense?.pattern)
                                                                                        ? (
                                                                                            <span className="ml-1">
                                                                                                {replaceExpensePatternFromDesc(data.expense?.pattern, data.description)}
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
                                                                    )}
                                                                </div>
                                                            )}
                                                        )}

                                                        <div className="font-bold">
                                                            <table className="w-full indent-[1.4cm]">
                                                                <tr>
                                                                    <td className="w-[50%]"></td>
                                                                    <td className="w-[50%] indent-0 text-right pr-8">
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
                                            : loan.details && loan.details
                                                .filter(item => item.expense_group === 1)
                                                .map((data, index) => {
                                                    return (
                                                        <div className="mt-2" key={index}>
                                                            <table className="w-full indent-[1.4cm]">
                                                                <tr>
                                                                    <td className="w-[68%]">
                                                                        <span>-{data.expense?.name}</span>
                                                                        {(data.description && data.expense?.pattern)
                                                                            ? (
                                                                                <span className="ml-1">
                                                                                    {replaceExpensePatternFromDesc(data.expense?.pattern, data.description)}
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
                                        {(loan.courses && loan.courses.length === 1) && (
                                            <div className="font-bold">
                                                <table className="w-full indent-[1.4cm]">
                                                    <tr>
                                                        <td className="w-[50%]"></td>
                                                        <td className="w-[50%] indent-0 text-right pr-8">
                                                            รวมเป็นเงิน {currency.format(loan.item_total)} บาท 
                                                            {/* ({ThaiNumberToText(loan.item_total)}) */}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        )}

                                        <div className="indent-[1.5cm] font-bold">
                                            รวมจำนวนเงินทั้งสิ้น {currency.format(loan.net_total)} บาท ({ThaiNumberToText(loan.net_total)})
                                        </div>
                                    </div>
                                    {loan.details.length > 1 && (
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
                                                        <p>({loan.employee.prefix.name+loan.employee.firstname+ ' ' +loan.employee.lastname})</p>
                                                        <p>{loan.employee.position?.name}{loan.employee.level?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="memo-row">
                                        <div style={{ width: '40%' }}>
                                            <div style={{ width: '100%', height: '100px' }}>
                                                <div className="text-center">
                                                    <p className="text-lg font-bold">อนุมัติ</p>
                                                </div>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
                                                        <p>( นายนิตย์  ทองเพชรศรี )</p>
                                                        <p>ผู้อำนวยการศูนย์สุขภาพจิตที่ 9</p> */}
                                                        {/* <p>รักษาราชการแทนผู้อำนวยการศูนย์สุขภาพจิตที่ 9</p> */}
                                                        {/* <p>ปฏิบัติราชการแทนอธิบดีกรมสุขภาพจิต</p>
                                                        <div className="signature-date">
                                                            <p>วันที่</p>
                                                            <div style={{ width: '150px', borderBottom: '1px dashed black' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
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

export default FormLoan
