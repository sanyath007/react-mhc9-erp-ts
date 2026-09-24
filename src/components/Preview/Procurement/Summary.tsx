import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getReports } from '../../../features/slices/requisition/requisitionSlice'
import { toShortTHDate, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const PreviewProcurementSummary = () => {
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
                    <div className='flex flex-col items-center'>
                        <h1 className='text-2xl font-bold'>แบบสรุปผลการดำเนินการจัดซื้อจัดจ้าง</h1>
                        <p className='text-xl font-bold'>หน่วยงาน  ศูนย์สุขภาพจิตที่ 9</p>
                        <p className='text-xl font-bold mb-2'>วันที่ {toShortTHDate(sdate)} ถึงวันที่ {toShortTHDate(edate)}</p>
                    </div>
                    <div>
                        <table className="w-full border-collapse border border-slate-400 mb-2">
                            <thead>
                                <tr className="text-[14pt]">
                                    <th className="w-[5%] border border-slate-300">ลำดับ</th>
                                    <th className="w-[15%] border border-slate-300">งานที่จัดซื้อหรือจัดจ้าง</th>
                                    <th className="w-[8%] border border-slate-300">วงเงินที่จะซื้อหรือจ้าง</th>
                                    <th className="w-[8%] border border-slate-300">ราคากลาง</th>
                                    <th className="w-[10%] border border-slate-300">วิธีซื้อหรือจ้าง</th>
                                    <th className="w-[15%] border border-slate-300">รายชื่อผู้เสนอราคา</th>
                                    <th className="w-[15%] border border-slate-300">ผู้ได้รับการคัดเลือก<br />และราคาที่เสนอ</th>
                                    <th className="w-[10%] border border-slate-300">เหตุผลที่<br />คัดเลือกโดยสรุป</th>
                                    <th className="border border-slate-300">เลขที่และวันที่ของสัญญา<br />หรือข้อตกลงในการซื้อหรือจ้าง</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisitions.map((req, index) => (
                                    <tr key={req.id}>
                                        <td className="border border-slate-300">{index+1}</td>
                                        <td className="border border-slate-300 text-left pl-2 leading-6">
                                            {req.order_type_id === 2 ? req.contract_desc : req.category.name}
                                        </td>
                                        <td className="border border-slate-300">{currency.format(req.net_total)}</td>
                                        <td className="border border-slate-300">{currency.format(req.budget_total)}</td>
                                        <td className="border border-slate-300">{req.approvals[0].procuring?.name}</td>
                                        <td className="border border-slate-300">{req.approvals[0].supplier?.name}</td>
                                        <td className="border border-slate-300">{req.approvals[0].supplier?.name}</td>
                                        <td className="border border-slate-300">ราคาต่ำสุด</td>
                                        <td className="border border-slate-300">
                                            <p>เลขที่ <span>{req.approvals[0].consider_no}</span></p>
                                            <p>วันที่ <span>{toShortTHDate(req.approvals[0].consider_date)}</span></p>
                                        </td>
                                    </tr>
                                ))}

                                <tr className="font-bold">
                                    <td colSpan={2}>รวมทั้งสิ้น</td>
                                    <td>{currency.format(requisitions?.reduce((sum, curVal) => sum = sum + parseFloat(curVal.net_total), 0))}</td>
                                    <td>{currency.format(requisitions?.reduce((sum, curVal) => sum = sum + parseFloat(curVal.budget_total), 0))}</td>
                                    <td colSpan={5}></td>
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

export default PreviewProcurementSummary
