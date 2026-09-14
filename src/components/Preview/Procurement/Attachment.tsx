import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getReports } from '../../../features/slices/requisition/requisitionSlice'
import { toShortTHDate, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const PreviewProcurementAttachment = () => {
    const { sdate, edate, status, limit } = useParams();
    const dispatch = useDispatch<any>();
    const { requisitions } = useSelector((state: any) => state.requisition);

    useEffect(() => {
        if (sdate && edate) dispatch(getReports({ url: `/api/requisitions/report/data?page=&sdate=${sdate}&edate=${edate}&status=${status}&limit=${limit}` }));
    }, [dispatch, sdate, edate]);

    return (
        <>
            {/* PAGE 2 */}
            <div className="paper-container">
                <div className="px-[1.5cm] py-5 text-center">
                    <h1 className="text-2xl font-bold mb-2">รายละเอียดที่ขอซื้อ</h1>
                    <p className='text-xl font-bold mb-2'>วันที่ {toShortTHDate(sdate)} ถึงวันที่ {toShortTHDate(edate)}</p>

                    <div>
                        <table className="w-full border-collapse border border-slate-400 mb-2">
                            <thead>
                                <tr className="text-[14pt]">
                                    <th className="w-[5%] border border-slate-300" rowSpan={2}>ลำดับ</th>
                                    <th className="w-[15%] border border-slate-300" rowSpan={2}>เลขประจำตัวผู้เสียภาษี/<br />เลขประจำตัวประชาชน</th>
                                    <th className="border border-slate-300" rowSpan={2}>ชื่อผู้ประกอบการ</th>
                                    <th className="w-[20%] border border-slate-300" rowSpan={2}>รายการพัสดุที่จัดซื้อจัดจ้าง</th>
                                    <th className="w-[12%] border border-slate-300" rowSpan={2}>จำนวนเงินรวมที่จัดซื้อจัดจ้าง</th>
                                    <th className="border border-slate-300" colSpan={2}>เอกสารอ้างอิง</th>
                                    <th className="w-[8%] border border-slate-300" rowSpan={2}>เหตุผลสนับสนุน</th>
                                </tr>
                                <tr>
                                    <th className="w-[10%] border border-slate-300 text-center ">วันที่</th>
                                    <th className="w-[10%] border border-slate-300 text-center ">เลขที่</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisitions.map((req, index) => (
                                    <tr key={req.id}>
                                        <td className="border border-slate-300">{index+1}</td>
                                        <td className="border border-slate-300">{req.approvals[0].supplier?.tax_no}</td>
                                        <td className="border border-slate-300 text-left pl-2 leading-6">{req.approvals[0].supplier?.name}</td>
                                        <td className="border border-slate-300">{req.order_type_id === 2 ? req.contract_desc : req.category.name}</td>
                                        <td className="border border-slate-300">{currency.format(req.net_total)}</td>
                                        <td className="border border-slate-300">เลขที่ <span>{req.approvals[0].consider_no}</span></td>
                                        <td className="border border-slate-300">วันที่ <span>{toShortTHDate(req.approvals[0].consider_date)}</span></td>
                                        <td className="border border-slate-300">1</td>
                                    </tr>
                                ))}

                                <tr className="font-bold">
                                    <td colSpan={4}>รวมทั้งสิ้น</td>
                                    <td>{currency.format(requisitions.reduce((sum, curVal) => sum = sum + parseFloat(curVal.net_total), 0))}</td>
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

export default PreviewProcurementAttachment
