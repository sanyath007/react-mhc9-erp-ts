import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams  } from 'react-router-dom'
import moment from 'moment'
import { getRequisition } from '../../../features/slices/requisition/requisitionSlice'
import { toLongTHDate, toLongTHDateWithBE, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const RequisitionCommittee = () => {
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
                    <div className="memo-notice">
                        <div className="memo-logo-notice">
                            <img src={`${process.env.REACT_APP_API_URL}/img/krut.jpg`} />
                        </div>
                    </div>

                    {(requisition && approval) && (
                        <div className="memo-box">
                            <div className="flex flex-col justify-center items-center">
                                <h3>คำสั่งศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต</h3>
                                <div className="flex justify-center items-center">
                                    <span className="m-0">ที่</span>
                                    <span className="ml-2">{approval.directive_no}</span>
                                </div>
                                <div className="flex justify-center items-start leading-none text-center">
                                    <span className="m-0">เรื่อง</span>
                                    <span className="ml-2">
                                        แต่งตั้งผู้ตรวจรับพัสดุสำหรับการ {((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)}&nbsp;
                                        จำนวน {requisition.item_count} รายการ โดย{approval.procuring?.name}
                                    </span>
                                </div>
                                <div className="flex my-2"><hr className="w-[180px]" /></div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    ด้วย ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต มีความประสงค์จะ{((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)}&nbsp;
                                    จำนวน {requisition.item_count} รายการ โดย{approval.procuring?.name}&nbsp;
                                    และเพื่อให้เป็นไปตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ จึงขอแต่งตั้งรายชื่อต่อไปนี้เป็น ผู้ตรวจรับพัสดุสำหรับการ
                                    {((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)} จำนวน {requisition.item_count} รายการ โดย{approval.procuring?.name}
                                </div>
                                <div className="memo-paragraph">
                                    ผู้ตรวจรับพัสดุ
                                    <table className="indent-[2.5cm] w-full">
                                        {requisition.committees.map((com, index) => (
                                            <tr key={com.id}>
                                                <td>
                                                    {requisition.committees.length > 1 && <span>{index+1}.</span>}{com.employee.prefix.name+com.employee.firstname+ ' ' +com.employee.lastname}
                                                </td>
                                                <td className="indent-0 w-[35%]">{com.employee.position?.name}{com.employee.level?.name}</td>
                                                <td className="indent-0 w-[20%]">
                                                    {requisition.committees.length === 1 && <>ผู้ตรวจรับพัสดุ</>}
                                                    {(requisition.committees.length > 1 && index === 0) && <>ประธานกรรรมการฯ</>}
                                                    {(requisition.committees.length > 1 && index > 0) && <>กรรรมการฯ</>}
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                                <div className="memo-paragraph">
                                    อำนาจและหน้าที่
                                    <p>ทำการตรวจรับพัสดุให้เป็นไปตามเงื่อนไขของสัญญาหรือข้อตกลงนั้น</p>
                                </div>
                                <div className="memo-paragraph mt-2">
                                    <p className="indent-[4cm]">
                                        สั่ง ณ วันที่ <span className="ml-2">{toLongTHDateWithBE(approval.directive_date)}</span>
                                    </p>
                                </div>

                                <div className="memo-approvement">
                                    <div className="memo-row">
                                        <div className="w-[40%]"></div>
                                        <div>
                                            <div style={{ textAlign: 'center', width: '100%', height: '120px' }}>
                                                <div className="pt-[60px] flex flex-col items-center justify-center">
                                                    <div className="signature">
                                                        <p>(นางสาวจุฑามาศ วรรณศิลป์)</p>
                                                        <p>ผู้อำนวยการศูนย์สุขภาพจิตที่ 9</p>
                                                        <p>ปฏิบัติราชการแทนอธิบดีกรมสุขภาพจิต</p>
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

export default RequisitionCommittee
