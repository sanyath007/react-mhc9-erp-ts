import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import moment from 'moment';
import { currency, generateQueryString, toShortTHDate, getUrlParam } from '../../utils'
import { getReports } from '../../features/slices/requisition/requisitionSlice';
import FilteringInputs from './FilteringInputs';
import DropdownButton from '../../components/FormControls/DropdownButton'
import DropdownItem from '../../components/FormControls/DropdownButton/DropdownItem'
import Loading from '../../components/ui/Loading';

const ProcurementAttachment = () => {
    const [cookies] = useCookies();
    const initialFilters = {
        sdate: moment().startOf('month').format('YYYY-MM-DD'),
        edate: moment().format('YYYY-MM-DD'),
        division: '',
        status: '>=,3',
        limit: 100,
        year: '', //cookies.budgetYear,
    };
    const dispatch = useDispatch<any>();
    const { requisitions, pager, isLoading, isDeleted } = useSelector((state: any) => state.requisition);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getReports({ url: `/api/requisitions/report/data?page=${params}` }));
        } else {
            dispatch(getReports({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint, params]);

    return (
        <div>
            <div className='flex flex-col items-center'>
                <h1 className='text-lg font-bold text-center'>รายละเอียดแนบท้ายประกาศผลผู้ชนะการจัดซื้อจัดจ้างหรือผู้ได้รับการคัดเลือก<br /> และสาระสำคัญของสัญญาหรือข้อตกลงเป็นหนังสือ</h1>
                <p className='text-base mb-2'>หน่วยงาน  ศูนย์สุขภาพจิตที่ 9</p>

                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => {
                        setParams(queryStr);
                        setApiEndpoint(prev => prev === '' ? `/api/requisitions/report/data?page=` : '');
                    }} />
            </div>

            <table className="table table-bordered text-sm">
                <thead>
                    <tr>
                        <th className="text-center w-[5%]" rowSpan={2}>#</th>
                        <th className="text-center w-[15%]" rowSpan={2}>เลขประจำตัวผู้เสียภาษี/<br />เลขประจำตัวประชาชน</th>
                        <th className="text-center" rowSpan={2}>ชื่อผู้ประกอบการ</th>
                        <th className="text-center w-[20%]" rowSpan={2}>รายการพัสดุที่จัดซื้อจัดจ้าง</th>
                        <th className="text-center w-[12%]" rowSpan={2}>จำนวนเงินรวมที่จัดซื้อจัดจ้าง</th>
                        <th className="text-center" colSpan={2}>เอกสารอ้างอิง</th>
                        <th className="text-center w-[8%]" rowSpan={2}>เหตุผลสนับสนุน</th>
                    </tr>
                    <tr>
                        <th className="text-center w-[10%]">วันที่</th>
                        <th className="text-center w-[10%]">เลขที่</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={11} className="text-center">
                                <div className="flex items-center justify-center">
                                    <Loading />
                                </div>
                            </td>
                        </tr>
                    )}

                    {requisitions && [...requisitions]
                        .sort((a, b) => {
                            const dateA = a.approvals[0].consider_date;
                            const dateB = b.approvals[0].consider_date;

                            return new Date(dateA).getTime() - new Date(dateB).getTime();
                        })
                        .map((req, index) => (
                            <tr key={req.id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                    {req.approvals[0].supplier?.tax_type_id === 1
                                        ? req.approvals[0].supplier?.tax_no ? req.approvals[0].supplier?.tax_no?.substring(0, 9) + 'xxxx' : '-'
                                        : req.approvals[0].supplier?.tax_no
                                    }
                                </td>
                                <td>{req.approvals[0].supplier?.name}</td>
                                <td>{req.order_type_id === 2 ? req.contract_desc : req.category.name}</td>
                                <td className="text-right">{currency.format(req.net_total)}</td>
                                <td>วันที่ <span>{toShortTHDate(req.approvals[0].consider_date)}</span></td>
                                <td>เลขที่ <span>{req.approvals[0].consider_no}</span></td>
                                <td className="text-center">1</td>
                            </tr>
                        ))}

                    {!isLoading && (
                        <tr className="font-bold">
                            <td className="text-center" colSpan={4}>รวมทั้งสิ้น</td>
                            <td className="text-right">{currency.format(requisitions.reduce((sum, curVal) => sum = sum + parseFloat(curVal.net_total), 0))}</td>
                            <td colSpan={4}></td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className='flex items-center justify-center mt-4'>
                <DropdownButton title="เอกสาร" btnColor="primary" cssClass="mr-1">
                    <DropdownItem>
                        <Link to={`/preview/procurement/attachment/${getUrlParam(params, 'sdate')}/${getUrlParam(params, 'edate')}/${getUrlParam(params, 'status')}/${getUrlParam(params, 'limit')}`} target="_blank" className="text-success">
                            <i className="fas fa-print mr-1"></i>
                            พิมพ์เอกสาร
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <a href={`${process.env.REACT_APP_API_URL}/procurement/summary`} target="_blank" className="text-primary">
                            <i className="far fa-file-word mr-1"></i>
                            ดาวน์โหลดเอกสาร
                        </a>
                    </DropdownItem>
                </DropdownButton>
            </div>
        </div>
    )
}

export default ProcurementAttachment