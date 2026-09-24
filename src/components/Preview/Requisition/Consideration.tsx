import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { getRequisition } from '../../../features/slices/requisition/requisitionSlice'
import { toLongTHDate, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const RequisitionConsideration = () => {
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
                                            <span>{approval.consider_no}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3>วันที่</h3>
                                        <div className="memo-header-value">
                                            <span>{toLongTHDate(moment(approval.consider_date).toDate())}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรื่อง</h3>
                                    <div className="memo-header-value">
                                        <span>รายงานผลการพิจารณาและ{requisition.topic} โดยวิธีเฉพาะเจาะจง</span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรียน</h3>
                                    <span>อธิบดีกรมสุขภาพจิต (ผ่านหัวหน้าเจ้าหน้าที่)</span>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    <span className="ml-1">ขอรายงานผลการพิจารณา{requisition.order_type_id === 1 ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc}</span>
                                    <span className="ml-1">จำนวน {requisition.item_count} รายการ โดยวิธีเฉพาะเจาะจง ซึ่งมีรายละเอียดดังนี้</span>
                                </div>
                                <div className="memo-paragraph">
                                    <table className="w-full border-collapse border border-slate-400">
                                        <thead>
                                            <tr className="text-[14pt]">
                                                <th className="w-[5%] border border-slate-300 text-center">ลำดับ</th>
                                                <th className="border border-slate-300 text-center">รายการพิจารณา</th>
                                                <th className="w-[12%] border border-slate-300 text-center">จำนวน</th>
                                                <th className="w-[30%] border border-slate-300 text-center">รายชื่อผู้ยื่นข้อเสนอ</th>
                                                <th className="w-[12%] border border-slate-300 text-center">ราคาที่เสนอ*</th>
                                                <th className="w-[12%] border border-slate-300 text-center">ราคาที่ตกลงซื้อหรือจ้าง*</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requisition.details.map((data, index) => (
                                                <tr key={data.id}>
                                                    <td className="border border-slate-300 text-center">{index+1}</td>
                                                    <td className="border border-slate-300 text-left pl-1">
                                                        {data.item?.name}
                                                        {/* {requisition.order_type_id === 1 ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc} */}
                                                    </td>
                                                    <td className="border border-slate-300 text-center">
                                                        {data.amount} {data.unit?.name}
                                                        {/* {requisition.item_count} รายการ */}
                                                    </td>
                                                    <td className="border border-slate-300 text-left pl-1 text-[14pt]">
                                                        {approval.supplier?.name}
                                                    </td>
                                                    <td className="border border-slate-300 text-right">
                                                        {currency.format(data.total)}
                                                        {/* {currency.format(requisition.net_total)} */}
                                                    </td>
                                                    <td className="border border-slate-300 text-right">
                                                        {currency.format(data.total)}
                                                        {/* {currency.format(requisition.net_total)} */}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="text-center" colSpan={5}>รวมเป็นเงินทั้งสิ้น ({ThaiNumberToText(requisition.net_total)})</td>
                                                <td className="text-right">{currency.format(requisition.net_total)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="indent-0 text-[12pt] mb-2">
                                        * ราคาที่เสนอ และราคาที่ตกลงซื้อหรือจ้าง เป็นราคารวมภาษีมูลค่าเพิ่มและภาษีอื่น ค่าขนส่ง ค่าจดทะเบียน และค่าใช้จ่ายอื่นๆ ทั้งปวง
                                    </div>

                                    <div className="indent-0">โดยเกณฑ์การพิจารณาผลการยื่นข้อเสนอครั้งนี้ จะพิจารณาตัดสินโดยใช้หลักเกณฑ์ราคา</div>
                                </div>
                                <div className="memo-paragraph">
                                    ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต พิจารณาแล้ว เห็นสมควร{requisition.order_type_id === 1 ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc}
                                    <span className="ml-1">จํานวน {requisition.item_count} รายการ โดยวิธีเฉพาะเจาะจง จากผู้เสนอราคาดังกล่าว</span>
                                </div>
                                <div className="memo-paragraph">
                                    <span className="with-compressed-2x">จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบขอได้โปรด</span>
                                    <div className="indent-0">
                                        <p className="indent-[3.5cm]">1. อนุมัติให้ดำเนินการ ตามรายละเอียดในรายงานขอซื้อดังกล่าวข้างต้น</p>
                                        <p className="indent-[3.5cm]">2. ลงนามในประกาศผู้ชนะการเสนอราคา</p>
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
                                        <div className="w-[60%]">
                                            <div className="text-center w-[100%] h-[120px]">
                                                <div className="mt-[60px] ml-[20%] flex flex-col justify-start items-start gap-1">
                                                    <p><i className="far fa-square"></i> อนุมัติ</p>
                                                    <p><i className="far fa-square"></i> ไม่อนุมัติ เนื่องจาก............................</p>
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
        </>
    )
}

export default RequisitionConsideration
