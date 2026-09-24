import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'
import moment from 'moment'
import { getLoan } from '../../features/slices/loan/loanSlice'
import { currency, toLongTHDate, toShortTHDate, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormProjectVerify = () => {
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
                <div className="form-wrapper form-bill">
                    <div className="form-top mb-4">
                        <h1 className="text-2xl font-bold leading-none">บันทึกการทวนสอบโครงการ</h1>
                    </div>
                    {loan && (
                        <div className="form-box">
                            <div className="mb-5">
                                <div className="flex flex-row justify-start items-start">
                                    <span className="w-[10%]">ชื่อโครงการ</span>
                                    <div className="w-[90%] ml-2">
                                        {loan.project_name}
                                    </div>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div>
                                    <div className="flex flex-row items-center justify-center gap-4">
                                        <div className="flex flex-row items-center gap-1">
                                            <FaRegSquare /> โครงการเก่า
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            <FaRegSquare /> โครงการต่อเนื่อง
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            <FaRegSquare /> โครงการใหม่
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-1">
                                        <div className="flex flex-col">
                                            <span>1. ระยะเวลาการดำเนินการ</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-5">
                                                    <FaRegSquare /> เป็นไปตามแผน
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-5">
                                                    <FaRegSquare /> ไม่เป็นไปตามแผน (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>2. งบประมาณ</span>
                                            <div className="flex flex-row gap-4">
                                                <div className="flex flex-col">
                                                    <div className="flex flex-row items-center gap-1 pl-5">
                                                        2.1 <FaRegSquare /> ถูกต้องตามผลผลิตที่กำหนด
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1 pl-5">
                                                        2.2 <FaRegSquare /> ถูกต้องตามระเบียบการเบิกจ่ายของกระทรวงการคลัง
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1 pl-5">
                                                        2.3 <FaRegSquare /> จำนวนเงินตรงตามที่ระบุ
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaRegSquare /> ไม่เป็นไปตามแผน (ระบุ) .........................
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaRegSquare /> ไม่เป็นไปตามแผน (ระบุ) .........................
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <FaRegSquare /> ไม่ตรงตามที่ระบุ (ระบุ) .........................
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>3. การเขียนโครงการเป็นไปตามแนวทางการปฏิบัติ</span>
                                            <div className="flex flex-row gap-1 pl-5">
                                                <FaRegSquare /> ถูกต้องตามแผน
                                            </div>
                                            <div className="flex flex-row gap-1 pl-5">
                                                <FaRegSquare /> ไม่ถูกต้องตามแผน (ระบุ) .......................................................................
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="memo-approvement">
                                    <div className="flex flex-row items-center justify-center gap-4 mt-6">
                                        <span className="text-lg font-bold">ผู้ทวนสอบ</span>
                                    </div>
                                    <div className="memo-row">
                                        <div className="w-[45%]">
                                            <div className="w-full">
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row">
                                                        <p className="w-[150px] border-dashed border-b mb-1"></p>
                                                        ผู้เสนอโครงการ
                                                    </div>
                                                    <div className="signature">
                                                        <p>({loan.employee.prefix.name+loan.employee.firstname+ ' ' +loan.employee.lastname})</p>
                                                        <p>{loan.employee.position?.name}{loan.employee.level?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[55%]">
                                            <div className="w-full">
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row">
                                                        <p className="w-[150px] border-dashed border-b mb-1"></p>
                                                        <span>งานแผนงานและประเมินผล</span>
                                                    </div>
                                                    <div className="signature">
                                                        <p>(นางสาววรวรรณ หนึ่งด่านจาก)</p>
                                                        <p>นักวิชาการสาธารณสุขชำนาญการ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="memo-row">
                                        <div className="w-[45%]">
                                            <div className="w-full">
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row">
                                                        <p className="w-[150px] border-dashed border-b mb-1"></p>
                                                        งานการเงินและบัญชี
                                                    </div>
                                                    <div className="signature">
                                                        <p>(นางสาวสิรินดา  วิถีธรรม)</p>
                                                        <p>นักวิชาการเงินและบัญชี</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[55%]">
                                            <div className="w-full">
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row">
                                                        <p className="w-[150px] border-dashed border-b mb-1"></p>หัวหน้ากลุ่มงานวิชาการ
                                                    </div>
                                                    <div className="signature">
                                                        <p>(นางสาววรวรรณ หนึ่งด่านจาก)</p>
                                                        <p>นักวิชาการสาธารณสุขชำนาญการ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center justify-center gap-4 mt-6">
                                        <span className="text-lg font-bold">ผู้รับรอง</span>
                                    </div>

                                    <div className="memo-row">
                                        <div className="w-[10%]">&nbsp;</div>
                                        <div className="w-[90%]">
                                            <div className="text-center w-full">
                                                <div className="pt-[20px] flex flex-col items-center justify-center">
                                                    <div className="flex flex-row">
                                                        <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                        ผู้อำนวยการ
                                                    </div>
                                                    <div className="signature">
                                                        <p>(นายนิตย์ ทองเพชรศรี)</p>
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

export default FormProjectVerify
