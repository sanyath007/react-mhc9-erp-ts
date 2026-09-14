import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'
import moment from 'moment'
import { getLoan } from '../../features/slices/loan/loanSlice'
import { currency, toLongTHDate, toShortTHDate, replaceExpensePatternFromDesc } from '../../utils'
import { ThaiNumberToText } from '../../utils/currencyText'
import './Preview.css'

const FormProjectReview = () => {
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
                <div className="form-wrapper mt-[1cm]">
                    <div className="form-top mb-2">
                        <h1 className="text-2xl font-bold leading-none">บันทึกการทบทวนโครงการ</h1>
                    </div>
                    {loan && (
                        <div className="form-box">
                            <div className="mb-2">
                                <div className="flex flex-row justify-start items-start">
                                    <span className="w-[10%]">ชื่อโครงการ</span>
                                    <div className="w-[90%] ml-2">
                                        {loan.project_name}
                                    </div>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div>
                                    <div className="flex flex-col mt-1">
                                        <div className="flex flex-col">
                                            <span>รูปแบบการเขียนโครงการ</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> ถูกต้อง
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่ถูกต้อง (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>1. ระยะเวลาการดำเนินงาน</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> ตรงตามที่กำหนด
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่ตรงตามที่กำหนด (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>2. ความสำคัญของโครงการที่จัดทำ</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> เหมาะสม
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่เหมาะสม (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>3. วัตถุประสงค์โครงการสอดคล้องกับผลผลิตและวิธีการติดตามประเมินผล (สามารถวัดได้)</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> ถูกต้อง
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่ถูกต้อง (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>4. กลุ่มเป้าหมาย (จำนวน / กลุ่มผู้เข้าร่วม)</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> ถูกต้อง
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่ถูกต้อง (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>5. ตัวชี้วัดที่กำหนด</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> เหมาะสมสามารถวัดได้
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่เหมาะสม (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>6. วิธีการถ่ายทอด</span>
                                            <div className="flex flex-row">
                                                <div className="flex flex-row items-center gap-1 pl-10 w-[30%]">
                                                    <FaRegSquare /> เหมาะสม
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-10">
                                                    <FaRegSquare /> ไม่เหมาะสม (ระบุ) .......................................................................
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col mt-4">
                                            <span className="font-bold">สรุปผลการทบทวนโครงการ</span>
                                            <div className="flex flex-row items-center gap-1 pl-10">
                                                <FaRegSquare /> ผ่าน สามารถดำเนินการได้
                                            </div>
                                            <div className="flex flex-row items-center gap-1 pl-10">
                                                <FaRegSquare /> ไม่ผ่าน ต้องแก้ไข (ระบุ) ..............................................................................................................................................
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="memo-approvement">
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
                                                        <span>ผู้ทบทวนโครงการ</span>
                                                    </div>
                                                    <div className="signature">
                                                        <p>(นางสาววรวรรณ หนึ่งด่านจาก)</p>
                                                        <p>นักวิชาการสาธารณสุขชำนาญการ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center justify-center gap-4 mt-4">
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

export default FormProjectReview
