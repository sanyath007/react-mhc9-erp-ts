import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { getRequisition } from '../../../features/slices/requisition/requisitionSlice'
import { toLongTHDate, toLongTHDateWithBE, currency } from '../../../utils'
import { ThaiNumberToText } from '../../../utils/currencyText'
import '../Preview.css'

const RequisitionNotice = () => {
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
                                <h3>ประกาศศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต</h3>
                                <div className="flex justify-center items-start leading-none text-center">
                                    <span className="m-0">เรื่อง</span>
                                    <span className="ml-2">
                                        ประกาศผู้ชนะการเสนอราคา {((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)}&nbsp;
                                        จำนวน {requisition.item_count} รายการ โดย{approval.procuring?.name}
                                    </span>
                                </div>
                                <div className="flex my-2"><hr className="w-[180px]" /></div>
                            </div>
                            <div className="memo-content">
                                <div className="memo-paragraph">
                                    ตามที่ ศูนย์สุขภาพจิตที่ ๙ กรมสุขภาพจิต ได้มีโครงการ{((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)}&nbsp;
                                    จำนวน {requisition.item_count} รายการ โดย{approval.procuring?.name} นั้น
                                </div>
                                <div className="memo-paragraph mt-[2.5cm]">
                                    {((requisition.order_type_id == 1) ? 'ซื้อ' + requisition.category?.name : requisition.contract_desc)}&nbsp;
                                    จำนวน {requisition.item_count} รายการ&nbsp;
                                    ผู้ได้รับการคัดเลือก ได้แก่ {approval.supplier?.name}&nbsp;
                                    โดยเสนอราคา เป็นเงินทั้งสิ้น  {currency.format(requisition.net_total)} บาท ({ThaiNumberToText(requisition.net_total)})
                                    รวมภาษีมูลค่าเพิ่มและภาษีอื่น ค่าขนส่ง ค่าจดทะเบียน และค่าใช้จ่ายอื่นๆ ทั้งปวง
                                </div>
                                <div className="memo-paragraph mt-2">
                                    <p className="indent-[4cm]">
                                        ประกาศ ณ วันที่ <span className="ml-2">{toLongTHDateWithBE(approval.notice_date)}</span>
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

export default RequisitionNotice
