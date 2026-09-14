import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getInspection } from '../../../features/slices/inspection/inspectionSlice'
import { toLongTHDate, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const InspectionReport = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { inspection } = useSelector((state: any) => state.inspection);

    useEffect(() => {
        if (id) dispatch(getInspection(id));
    }, [id]);

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
                    {inspection && (
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
                                            <span>{inspection.report_no}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3>วันที่</h3>
                                        <div className="memo-header-value">
                                            <span>{toLongTHDate(moment(inspection.report_date).toDate())}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรื่อง</h3>
                                    <div className="memo-header-value">
                                        <span>
                                            รายงานผลการตรวจรับการ
                                            {inspection.order?.requisition.order_type_id === 1
                                                ? 'ซื้อ' + inspection.order?.requisition?.category?.name
                                                : inspection.order?.requisition?.contract_desc
                                            } จำนวน {inspection.item_count} รายการ โดยวิธีเฉพาะเจาะจง
                                        </span>
                                    </div>
                                </div>
                                <div className="memo-header-text">
                                    <h3>เรียน</h3>
                                    <span>อธิบดีกรมสุขภาพจิต (ผ่านหัวหน้าเจ้าหน้าที่)</span>
                                </div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    <span className="ml-1">
                                        ตามที่ ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต ได้ดำเนินการจัด{inspection.order?.requisition.order_type_id === 1 ? 'ซื้อ' : 'จ้าง'}
                                        กับ{inspection.supplier?.name}
                                        เพื่อจัด{inspection.order?.requisition.order_type_id === 1
                                            ? 'ซื้อ' + inspection.order?.requisition?.category?.name
                                            : inspection.order?.requisition?.contract_desc
                                        }
                                    </span>
                                    <span className="ml-1">จำนวน {inspection.item_count} รายการ</span>
                                    <span className="ml-1">
                                        ตามรายงานผลการพิจารณาและขออนุมัติสั่งซื้อสั่งจ้าง ที่ {inspection.order?.requisition?.approvals[0].consider_no}
                                        <span className="ml-1">ลงวันที่ {toLongTHDate(moment(inspection.order?.requisition?.approvals[0].consider_date).toDate())}</span>
                                    </span>
                                    <span className="ml-1">
                                        เป็นจำนวนเงินทั้งสิ้น {currency.format(inspection.net_total)} บาท ({ThaiNumberToText(inspection.net_total)})
                                        ซึ่งได้รวมภาษีมูลค่าเพิ่ม ค่าขนส่ง ค่าจดทะเบียน และค่าใช้จ่ายอื่นๆ ทั้งปวง
                                    </span>
                                </div>

                                <div className="memo-paragraph">
                                    {inspection.supplier?.name} ได้ส่งมอบของที่ซื้อขาย ตามรายงานผลการพิจารณาและขออนุมัติสั่ง
                                    {inspection.order?.requisition.order_type_id === 1
                                        ? 'ซื้อ' + inspection.order?.requisition?.category?.name
                                        : inspection.order?.requisition?.contract_desc
                                    }
                                    <span className="mx-1">จํานวน {inspection.item_count} รายการ ดังกล่าวข้างต้นให้แก่</span>
                                    ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต 
                                    ทั้งนี้ ผู้ตรวจรับพัสดุได้พิจารณาตรวจสิ่งของที่ซื้อขาย เห็นว่ามีรายละเอียดถูกต้องครบถ้วนและได้ตรวจรับพัสดุเรียบร้อยแล้ว
                                    ดังนั้น จึงขอรายงานผลการตรวจรับพัสดุการ{inspection.order?.requisition.order_type_id === 1
                                        ? 'ซื้อ' + inspection.order?.requisition?.category?.name
                                        : inspection.order?.requisition?.contract_desc
                                    }
                                    <span className="ml-1">จํานวน {inspection.item_count} รายการ</span> (รายละเอียดปรากฏดังเอกสารแนบ)
                                </div>
                                <div className="memo-paragraph">
                                    <span className="with-compressed-2x">จึงเรียนมาเพื่อโปรดทราบ</span>
                                </div>

                                <div className="memo-approvement">
                                    {/* ผู้ขอ/เจ้าของโครงการ */}
                                    <div className="memo-row">
                                        <div style={{ width: '40%' }}>&nbsp;</div>
                                        <div style={{ width: '60%' }}>
                                            <div style={{ textAlign: 'center', width: '100%' }}>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
                                                        <p>({inspection.order?.requisition?.committees[0]?.employee?.prefix?.name+inspection.order?.requisition?.committees[0]?.employee?.firstname+ ' ' +inspection.order?.requisition?.committees[0]?.employee?.lastname})</p>
                                                        <p>{inspection.order?.requisition?.committees[0]?.employee?.position?.name}{inspection.order?.requisition?.committees[0]?.employee?.level?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div style={{ width: '100%' }}>
                                            <div style={{ width: '100%', padding: '1pt 0 1pt' }}>
                                                <div>
                                                    <p>เรียน อธิบดีกรมสุขภาพจิต</p>
                                                    <p style={{ textIndent: '1cm' }}>งานพัสดุ ได้รับมอบพัสดุตามรายละเอียดข้างต้นจากผู้ตรวจรับพัสดุเรียบร้อยแล้ว จึงเรียนมาเพื่อโปรดทราบ</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="memo-row">
                                        <div style={{ width: '40%' }}>&nbsp;</div>
                                        <div style={{ width: '60%' }}>
                                            <div style={{ textAlign: 'center', width: '100%' }}>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
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
                                                <div className="mt-[60px] flex flex-col justify-center items-center">
                                                    <p className="font-semibold">ทราบ</p>
                                                </div>
                                                <div className="pt-[40px] flex flex-col items-center justify-center">
                                                    <p className="w-[200px] border-dashed border-b mb-1"></p>
                                                    <div className="signature">
                                                        <p>( นางสาวจุฑามาศ วรรณศิลป์ )</p>
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

export default InspectionReport
