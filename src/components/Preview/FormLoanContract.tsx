import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'
import moment from 'moment'
import { getLoan } from '../../features/slices/loan/loanSlice'
import { currency, toLongTHDate, toLongTHDateRange, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormLoanContract = () => {
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
                <div className="form-wrapper form-contract">
                    <div className="border-[1px] border-black">
                        <div className="form-top">
                            <h1 className="text-2xl font-bold">สัญญายืมเงิน</h1>
                            <div className="absolute top-0 right-0 border-[1px] border-black p-2 text-sm">
                                <div className="flex flex-row items-end justify-start">
                                    <p>เลขที่</p>
                                    <div className="w-[120px] border-dashed border-b mb-1"></div>
                                </div>
                                <div className="flex flex-row items-end justify-start">
                                    <p>วันที่ครบกำหนด</p>
                                    <div className="w-[78px] border-dashed border-b mb-1"></div>
                                </div>
                            </div>
                        </div>
                        {loan && (
                            <div className="form-box">
                                <div className="form-header">
                                    <div className="memo-header-text">
                                        <h5>ยื่นต่อ</h5>
                                        <div className="memo-header-value">
                                            <span>อธิบดีกรมสุขภาพจิต</span>
                                        </div>
                                    </div>
                                    <div className="memo-header-text">
                                        <div>
                                            <h5>ข้าพเจ้า</h5>
                                            <div className="memo-header-value">
                                                <span>{loan.employee.prefix.name+loan.employee.firstname+ ' ' +loan.employee.lastname}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h5>ตำแหน่ง</h5>
                                            <div className="memo-header-value">
                                                <span>{loan.employee.position?.name}{loan.employee.level?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="memo-header-text">
                                        <h5>สังกัด</h5>
                                        <div className="memo-header-value">
                                            <span>ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต</span>
                                        </div>
                                    </div>
                                    <div className="memo-header-text">
                                        <h5>มีความประสงค์</h5>
                                        <div className="flex flex-row items-center gap-5">
                                            <div className="flex flex-row items-center gap-2">
                                                {loan.money_type_id === 1 ? <FaCheckSquare /> : <FaRegSquare /> } เงินทดลองราชการ
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                {loan.money_type_id === 2 ? <FaCheckSquare /> : <FaRegSquare /> } เงินยืมนอกงบประมาณ
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                {loan.money_type_id === 3 ? <FaCheckSquare /> : <FaRegSquare /> } เงินยืมราชการ
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ############## Content ############## */}
                                <div className="memo-content">
                                    <div className="memo-paragraph">
                                        {loan.loan_type_id === 1 
                                            ? <span className="ml-1">เพื่อเป็นค่าใช้จ่ายใน{loan.project_name}</span>
                                            : (
                                                <span className="ml-1">
                                                    {/* ตามหนังสือ {loan.division ? loan.division?.name : loan.department?.name} ที่ {loan.doc_no} ลงวันที่ {toLongTHDate(moment(loan.doc_date).toDate())}
                                                    <span className="ml-1">เรื่อง ขออนุมัติยืมเงินราชการ</span> */}
                                                    <span className="ml-1">เพื่อเป็นค่าใช้จ่ายในการเดินทางไปราชการเข้าร่วม{loan.project_name}</span>
                                                </span>
                                            )
                                        }
                                        <span className="mx-1">
                                            ระหว่างวันที่ {toLongTHDate(moment(loan.project_sdate).toDate())} ถึงวันที่ {toLongTHDate(moment(loan.project_edate).toDate())}
                                        </span>
                                        
                                        ณ{loan?.courses.length > 0 && loan?.courses.map((course, index) => (
                                            <span className="mx-1" key={course.id}>
                                                {index > 0 && 'และ'}{course.place?.name} จ.{course.place?.changwat?.name}
                                            </span>
                                        ))}
                                        <span className="ml-1">โดยใช้งบประมาณ</span>
                                        {loan.budgets && loan.budgets.map((data, index) => (
                                            <span className="ml-0" key={data.budget_id}>
                                                <span>{data.budget?.activity.project?.plan?.name} {data.budget?.activity.project?.name} {data.budget?.activity.name}</span>
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
                                                                <td className="w-[32%] text-right pr-8">
                                                                    <span className="mr-4">เป็นเงิน</span>{currency.format(data.total)} บาท
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    )
                                                )}

                                                <div className="font-bold">
                                                    <table className="w-full indent-[1.4cm]">
                                                        <tr>
                                                            <td className="w-[68%]"></td>
                                                            <td className="w-[32%] text-right pr-8">
                                                                รวมเป็นเงิน {currency.format(loan.order_total)} บาท 
                                                                {/* ({ThaiNumberToText(loan.order_total)}) */}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* รายการค่าใช้จ่าย */}
                                        <div>
                                            {(loan.courses && loan.courses.length > 1)
                                                // รายการค่าใช้จ่ายแบบแยกวัน
                                                ? loan.courses.map(course => {
                                                    let courseTotal = 0;

                                                    return (
                                                        <div className="mt-1" key={course.id}>
                                                            <p className="indent-[1.3cm]">
                                                                {course?.course_date && <span className="mx-1 font-bold">วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</span>} 
                                                                ณ {course?.place?.name} {/* จ.{course?.place?.changwat?.name} */}
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
                                                                                        <td className="w-[32%] text-right pr-8">
                                                                                            <span className="mr-4">เป็นเงิน</span>{currency.format(data.total)} บาท
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                }
                                                            )}

                                                            <div className="font-bold">
                                                                <table className="w-full indent-[1.4cm]">
                                                                    <tr>
                                                                        <td className="w-[68%]"></td>
                                                                        <td className="w-[32%] text-right pr-8">
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
                                                            <div className="mt-1" key={index}>
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
                                                                        <td className="w-[32%] text-right pr-8">
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
                                                            <td className="w-[68%]"></td>
                                                            <td className="w-[32%] text-right pr-8">
                                                                รวมเป็นเงิน {currency.format(loan.item_total)} บาท 
                                                                {/* ({ThaiNumberToText(loan.item_total)}) */}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            )}

                                            <div className="indent-[1.5cm] font-bold">
                                                <table className="w-full indent-0">
                                                    <tr>
                                                        <td className="w-[68%] text-center">ตัวอักษร ({ThaiNumberToText(loan.net_total)})</td>
                                                        <td className="w-[32%] text-right pr-8">
                                                            <span className="mr-2">รวมเป็นเงินทั้งสิ้น</span>{currency.format(loan.net_total)}<span className="ml-2">บาท</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="indent-0 font-bold">
                                            รวม {currency.format(loan.details.length)} รายการ เป็นจำนวนเงินทั้งสิ้น {currency.format(loan.net_total)} บาท ({ThaiNumberToText(loan.net_total)})
                                        </div>

                                        {loan.details.length > 1 && (
                                            <div className="indent-0 mt-1">
                                                <span className="underline">หมายเหตุ</span> - ค่าใช้จ่ายแต่ละรายการสามารถถัวเฉลี่ยจ่ายแทนกันได้
                                            </div>
                                        )}
                                    </div>

                                    <div className="memo-paragraph">
                                        ข้าพเจ้าสัญญาว่าจะปฏิบัติตามระเบียบของทางราชการทุกประการ และจะนำใบสำคัญจ่ายที่ถูกต้อง พร้อมทั้งเงินเหลือจ่าย (ถ้ามี) ส่งใช้ภายในกำหนดไว้ในระเบียบการเบิกจ่ายจากคลัง คือ ภายใน
                                        <span className="underline mx-1">{loan.loan_type_id === 1 ? '30' : '15'}</span>วัน นับแต่วันที่ 
                                        <span className="underline mx-1">{loan.loan_type_id === 1 ? 'ได้รับเงิน' : 'เดินทางกลับจากราชการ'}</span>
                                        ถ้าข้าพเจ้าไม่ส่งตามกำหนด ข้าพเจ้ายินยอมให้หักเงินเดือน ค่าจ้าง เบี้ยหวัด บำเหน็จ บำนาญ หรือเงินอื่นใดที่ข้าพเจ้าจะพึงได้รับราชการชดใช้จำนวนเงินที่ยืมไปจนครบถ้วนได้ทันที
                                    </div>
                                </div>
                                {/* ############## Content ############## */}

                                {/* ############## Approvement ############## */}
                                <div className="memo-approvement">
                                    <div className="memo-row">
                                        <div  className="w-[50%]">
                                            <div className="w-[100%]">
                                                <div className="pt-[20px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row items-end justify-center">
                                                        ลายมือชื่อ
                                                        <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    </div>
                                                    <div className="signature">
                                                        <p>({loan.employee.prefix.name+loan.employee.firstname+ ' ' +loan.employee.lastname})</p>
                                                        {/* <p>{loan.employee.position?.name}{loan.employee.level?.name}</p> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div  className="w-[50%]">
                                            <div className="pt-[20px] flex flex-row items-end justify-center">
                                                <p>วันที่</p>
                                                <div className="w-[200px] border-dashed border-b mb-1"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div className="w-[100%] flex flex-col">
                                            <p className="font-bold">เสนอ อธิบดีกรมสุขภาพจิต</p>
                                            <p style={{ textIndent: '1cm' }}>ได้ตรวจสอบแล้ว เห็นสมควรอนุมัติให้ยืมตามใบยืมฉบับนี้ได้ เป็นเงิน {currency.format(loan.net_total)} บาท ({ThaiNumberToText(loan.net_total)})</p>
                                            <div className="w-[100%] flex flex-row">
                                                <div className="w-[50%]">
                                                    <div style={{ width: '100%', padding: '1pt 0 1pt' }}>
                                                        <div className="pt-[20px] flex flex-col items-center justify-center">
                                                            <div className="flex flex-row items-end justify-center">
                                                                ลายมือชื่อ
                                                                <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                            </div>
                                                            <div className="signature">
                                                                <p>&nbsp;</p>
                                                                <p>&nbsp;</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div  className="w-[50%]">
                                                    <div className="pt-[20px] flex flex-row items-end justify-center">
                                                        <p>วันที่</p>
                                                        <div className="w-[200px] border-dashed border-b mb-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div className="w-[100%] text-center">
                                            <p className="font-bold">คำขออนุมัติ</p>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div className="w-[100%] flex flex-col">
                                            <p>อนุมัติให้ยืมเงินตามเงื่อนไขข้างต้นได้ เป็นเงิน {currency.format(loan.net_total)} บาท ({ThaiNumberToText(loan.net_total)})</p>
                                            <div className="w-[100%] flex flex-row">
                                                <div className="w-[50%]">
                                                    <div className="w-[100%]">
                                                        <div className="pt-[20px] flex flex-col items-center justify-center">
                                                            <div className="flex flex-row items-end justify-center">
                                                                ลงชื่ออนุมัติ
                                                                <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                            </div>
                                                            <div className="signature">
                                                                <p>&nbsp;</p>
                                                                <p>&nbsp;</p>
                                                                <p>&nbsp;</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div  className="w-[50%]">
                                                    <div className="pt-[20px] flex flex-row items-end justify-center">
                                                        <p>วันที่</p>
                                                        <div className="w-[200px] border-dashed border-b mb-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div className="w-[100%] text-center">
                                            <p className="font-bold">ใบรับเงิน</p>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div className="w-[100%] flex flex-col">
                                            <p>ได้รับเงินยืม จำนวน {currency.format(loan.net_total)} บาท ({ThaiNumberToText(loan.net_total)})</p>
                                            <div className="w-[100%] flex flex-row">
                                                <div className="w-[50%]">
                                                    <div className="w-[100%] mb-2">
                                                        <div className="pt-[10px] flex flex-col items-center justify-center">
                                                            <div className="flex flex-row items-end justify-center">
                                                                ลงชื่อ<p className="w-[200px] border-dashed border-b mb-1"></p>ผู้รับเงิน
                                                            </div>
                                                            <p>({loan.employee.prefix.name+loan.employee.firstname+ ' ' +loan.employee.lastname})</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div  className="w-[50%]">
                                                    <div className="pt-[10px] flex flex-row items-end justify-center">
                                                        <p>วันที่</p>
                                                        <div className="w-[200px] border-dashed border-b mb-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                
                                {/* ############## Approvement ############## */}
                            </div>
                        )}
                    </div>
                    <div className="pl-[10px]">
                        <p className="font-bold">เรียน อธิบดีกรมสุขภาพจิต</p>
                        <div style={{ textIndent: '1cm' }}>
                            <p className="font-bold text-[12pt]">ได้ตรวจสอบแล้ว หลักฐานประกอบสัญญายืมครบถ้วน ไม่มีหนี้ผูกพัน และได้ส่งเงินยืมเรียบร้อยแล้ว</p>
                        </div>
                        <div className="memo-row">
                            <div  className="w-[50%]">
                                <div className="w-[100%]">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="flex flex-row items-end justify-center">
                                            ลายชื่อ
                                            <p className="w-[200px] border-dashed border-b mb-1"></p>
                                        </div>
                                        <div className="flex flex-row">
                                            (<p className="w-[200px] border-dashed border-b mb-1"></p>)
                                        </div>
                                        <div className="flex flex-row">
                                            <p className="w-[60px] border-dashed border-b mb-1"></p>/
                                            <p className="w-[80px] border-dashed border-b mb-1"></p>/
                                            <p className="w-[60px] border-dashed border-b mb-1"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* END PAGE 1 */}
        </>
    )
}

export default FormLoanContract
