import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { getRequisition } from '../../../features/slices/requisition/requisitionSlice'
import { toLongTHDate, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const RequisitionReport = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const approvalId = searchParams.get('approvalId');
    const dispatch = useDispatch<any>();
    const { requisition } = useSelector((state: any) => state.requisition);
    const approval = useMemo(() => requisition?.approvals.find(app => app.id === parseInt(approvalId)), [requisition, approvalId]);

    useEffect(() => {
        if (id) dispatch(getRequisition({ id }));
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

                    {(requisition && approval) && (
                        <div className="memo-box">
                            <div className="memo-header">
                                <div className="memo-header-text">
                                    <h3>ส่วนราชการ</h3>
                                    <div className="memo-header-value">
                                        <span>งานพัสดุ กลุ่มงานอำนวยการ ศูนย์สุขภาพจิตที่ ๙ โทร o ๔๔๒๕ ๖๗๒๙</span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <div>
                                        <h3>ที่</h3>
                                        <div className="memo-header-value">
                                            <span>{approval.report_no}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3>วันที่</h3>
                                        <div className="memo-header-value">
                                            <span>{toLongTHDate(moment(approval.report_date).toDate())}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรื่อง</h3>
                                    <div className="memo-header-value">
                                        <span>รายงานขอ{((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)} จำนวน {requisition.item_count} รายการ โดย{approval?.procuring?.name}</span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรียน</h3>
                                    <span>อธิบดีกรมสุขภาพจิต (ผ่านหัวหน้าเจ้าหน้าที่)</span>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    ด้วย ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต มีความประสงค์จะ{((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)}&nbsp;
                                    จำนวน {requisition.item_count} รายการ โดย{approval?.procuring?.name} ซึ่งมีรายละเอียด ดังต่อไปนี้
                                </div>
                                <div className="memo-paragraph">
                                    1. เหตุผลและความจำเป็นที่ต้องจัดซื้อจัดจ้าง
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">
                                            {requisition.reason ? requisition.reason : `เพื่อใช้ในการดำเนินงานภายในศูนย์สุขภาพจิตที่ 9 ปีงบประมาณ ${requisition.year}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    2. รายละเอียดของพัสดุ
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">{((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)} จำนวน {requisition.item_count} รายการ (รายละเอียดตามเอกสารแนบ)</p>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    3. ราคากลางของพัสดุที่จะซื้อหรือจ้าง
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">ราคาที่ได้มาจากการสืบราคาจากท้องตลาด {currency.format(requisition.net_total)} บาท ({ThaiNumberToText(requisition.net_total)})</p>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    4. วงเงินที่จะซื้อ
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">เงินงบประมาณรายจ่ายประจำปี พ.ศ. {requisition.year+543} จำนวนเงิน {currency.format(requisition.net_total)} บาท ({ThaiNumberToText(requisition.net_total)})</p>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    5. กำหนดเวลาที่ต้องการใช้พัสดุนั้น หรือให้งานนั้นแล้วเสร็จ
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]"> กำหนดเวลาการส่งมอบพัสดุ หรือให้งานแล้วเสร็จภายในวันที่ {toLongTHDate(moment(approval?.deliver_date).toDate())}</p>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    6. วิธีที่จะซื้อ และเหตุผลที่ต้องซื้อ
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">
                                            ดำเนินการโดย{approval?.procuring?.name} ตามพระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ มาตรา ๕๕(๓) และมาตรา ๕๖(๒) (ข)&nbsp;
                                            ประกอบกับระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ และกฎกระทรวง กำหนดวงเงินการจัดซื้อจัดจ้างพัสดุโดย{approval?.procuring?.name}&nbsp;
                                            วงเงินการจัดซื้อจัดจ้างที่ไม่ทำข้อตกลงเป็นหนังสือ และวงเงินการจัดซื้อจัดจ้างในการแต่งตั้งผู้ตรวจรับพัสดุ พ.ศ. ๒๕๖๐ ข้อ ๑&nbsp;
                                            การจัดซื้อจัดจ้างพัสดุที่มีการผลิต จำหน่าย ก่อสร้าง หรือให้บริการทั่วไป และมีวงเงินในการจัดซื้อจัดจ้างครั้งหนึ่งไม่เกิน ๕๐๐,๐๐๐ บาท (ห้าแสนบาทถ้วน)
                                        </p>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    7. หลักเกณฑ์การพิจารณาคัดเลือกข้อเสนอ
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">การพิจารณาคัดเลือกข้อเสนอโดยใช้เกณฑ์ราคา</p>
                                    </div>
                                </div>
                                <div className="text-right mt-[150px]">
                                    /8. การขออนุมัติแต่งตั้ง...
                                </div>
                                {/* END PAGE 1 */}

                                <div style={{ pageBreakBefore: 'always' }}></div>

                                {/* PAGE 2 */}
                                <div className="text-center mt-[1cm]">
                                    - 2 -
                                </div>
                                <div className="memo-paragraph">
                                    8. การขออนุมัติแต่งตั้งคณะกรรมการต่าง ๆ
                                    <div className="indent-0">
                                        {/* <p className="indent-[3.5cm]">ผู้จัดทำร่างขอบเขตของานหรือรายละเอียดคุณลักษณะเฉพาะและราคากลาง</p>
                                        <div className="indent-[4cm]">
                                            {requisition.committees.map((com, index) => (
                                                <p key={com.id}>
                                                    {requisition.committees.length > 1 && <span>{index+1}. </span>}
                                                    {com.employee.prefix.name+com.employee.firstname+ ' ' +com.employee.lastname}
                                                    {' '}ตำแหน่ง {com.employee.position?.name}{com.employee.level?.name}
                                                </p>
                                            ))}
                                        </div> */}
                                        <p className="indent-[3.5cm]">ผู้ตรวจรับพัสดุ</p>
                                        <div className="indent-[4cm]">
                                            {requisition.committees.map((com, index) => (
                                                <p key={com.id}>
                                                    {requisition.committees.length > 1 && <span>{index+1}. </span>}
                                                    {com.employee.prefix.name+com.employee.firstname+ ' ' +com.employee.lastname}
                                                    {' '}ตำแหน่ง {com.employee.position?.name}{com.employee.level?.name}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="memo-paragraph">
                                    จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบขอได้โปรด
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">1. อนุมัติให้ดำเนินการ ตามรายละเอียดในรายงานขอซื้อดังกล่าวข้างต้น</p>
                                        <p className="indent-[3.5cm]">2. ลงนามในคำสั่งแต่งตั้งผู้ตรวจรับพัสดุ</p>
                                    </div>
                                </div>

                                <div className="memo-approvement">
                                    <div className="memo-row">
                                        <div style={{ width: '40%' }}>&nbsp;</div>
                                        <div style={{ width: '60%' }}>
                                            <div style={{ textAlign: 'center', width: '100%' }}>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
                                                        {/* <p>({requisition.requester.prefix.name+requisition.requester.firstname+ ' ' +requisition.requester.lastname})</p> */}
                                                        <p>(นางสาวทิพปภา สีมาธรรมการย์)</p>
                                                        <p>นักวิชาการพัสดุ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div style={{ width: '40%' }}>
                                            <div style={{ width: '100%', height: '100px' }}>
                                                <div>
                                                    <p>เรียน อธิบดีกรมสุขภาพจิต</p>
                                                    <p style={{ textIndent: '1cm' }}>- เพื่อโปรดพิจารณาอนุมัติ</p>
                                                </div>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
                                                        {/* <p>({requisition.requester.prefix.name+requisition.requester.firstname+ ' ' +requisition.requester.lastname})</p> */}
                                                        <p>(นางณัฏฐา ศิริผล)</p>
                                                        <p>หัวหน้าเจ้าหน้าที่</p>
                                                        <div className="signature-date">
                                                            <p>วันที่</p>
                                                            <div style={{ width: '150px', borderBottom: '1px dashed black' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ width: '60%' }}>
                                            <div style={{ textAlign: 'center', width: '100%', height: '120px' }}>
                                                <div style={{ marginTop: '60px' }}>
                                                    เห็นชอบ/อนุมัติ
                                                </div>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
                                                        <p>(นางสาวจุฑามาศ วรรณศิลป์)</p>
                                                        <p>ผู้อำนวยการศูนย์สุขภาพจิตที่ 9</p>
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

            <div style={{ pageBreakBefore: 'always' }}></div>

            {/* PAGE 2 */}
            <div className="paper-container">
                <div className="px-[1.5cm] py-5 text-center">
                    <h1 className="text-2xl font-bold mb-2">รายละเอียดที่ขอซื้อ</h1>

                    <div>
                        <table className="w-full border-collapse border border-slate-400 mb-2">
                            <thead>
                                <tr className="text-[14pt]">
                                    <th className="w-[5%] border border-slate-300">ลำดับ</th>
                                    <th className="border border-slate-300">รายการ</th>
                                    <th className="w-[8%] border border-slate-300">จำนวน</th>
                                    <th className="w-[8%] border border-slate-300">ราคาต่อหน่วย</th>
                                    <th className="w-[8%] border border-slate-300">รวมเป็นเงิน</th>
                                    <th className="w-[8%] border border-slate-300">ราคามาตรฐาน</th>
                                    <th className="w-[8%] border border-slate-300">ราคากลาง</th>
                                    <th className="w-[8%] border border-slate-300">ราคาที่เคยจ้างครั้งหลังสุดภายใน 2 ปีงบประมาณ</th>
                                    <th className="w-[8%] border border-slate-300">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisition?.details.map((detail, index) => (
                                    <tr key={detail.id}>
                                        <td className="border border-slate-300">{index+1}</td>
                                        <td className="border border-slate-300 text-left pl-2 leading-6">
                                            <span>{detail.item?.name}</span>
                                            {detail.description && <span className="ml-1">{detail.description}</span>}
                                        </td>
                                        <td className="border border-slate-300">{detail.amount} {detail.unit?.name}</td>
                                        <td className="border border-slate-300">{currency.format(detail.price)}</td>
                                        <td className="border border-slate-300">{currency.format(detail.total)}</td>
                                        <td className="border border-slate-300"></td>
                                        <td className="border border-slate-300"></td>
                                        <td className="border border-slate-300"></td>
                                        <td className="border border-slate-300"></td>
                                    </tr>
                                ))}

                                <tr className="font-bold">
                                    <td colSpan={4}>รวมเป็นเงินทั้งสิ้น</td>
                                    <td>{currency.format(requisition?.details.reduce((sum, curVal) => sum = sum + curVal.total, 0))}</td>
                                    <td colSpan={4}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            {/* END PAGE 2 */}
        </>
    )
}

export default RequisitionReport
