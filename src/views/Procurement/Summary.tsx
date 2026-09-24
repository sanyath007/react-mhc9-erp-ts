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

const ProcurementSummary = () => {
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
                <h1 className='text-lg font-bold'>แบบสรุปผลการดำเนินการจัดซื้อจัดจ้าง</h1>
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
                        <th className="text-center w-[5%]">#</th>
                        <th className="text-center w-[15%]">งานที่จัดซื้อหรือจัดจ้าง</th>
                        <th className="text-center w-[8%]">วงเงินที่จะซื้อหรือจ้าง</th>
                        <th className="text-center w-[8%]">ราคากลาง</th>
                        <th className="text-center w-[10%]">วิธีซื้อหรือจ้าง</th>
                        <th className="text-center w-[15%]">รายชื่อผู้เสนอราคา</th>
                        <th className="text-center w-[15%]">ผู้ได้รับการคัดเลือก<br />และราคาที่เสนอ</th>
                        <th className="text-center w-[10%]">เหตุผลที่<br />คัดเลือกโดยสรุป</th>
                        <th className="text-center">เลขที่และวันที่ของสัญญา<br />หรือข้อตกลงในการซื้อหรือจ้าง</th>
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
                                <td>{req.order_type_id === 2 ? req.contract_desc : req.category.name}</td>
                                <td className="text-right">{currency.format(req.net_total)}</td>
                                <td className="text-right">{currency.format(req.budget_total)}</td>
                                <td>{req.approvals[0].procuring?.name}</td>
                                <td>{req.approvals[0].supplier?.name}</td>
                                <td>{req.approvals[0].supplier?.name} ราคาที่เสนอ {currency.format(req.net_total)} บาท</td>
                                <td>ราคาต่ำสุด</td>
                                <td>
                                    <p>เลขที่ <span>{req.approvals[0].consider_no}</span></p>
                                    <p>วันที่ <span>{toShortTHDate(req.approvals[0].consider_date)}</span></p>
                                </td>
                            </tr>
                        ))}

                    {!isLoading && (
                        <tr className="font-bold">
                            <td className="text-center" colSpan={2}>รวมทั้งสิ้น</td>
                            <td className="text-right">{currency.format(requisitions?.reduce((sum, curVal) => sum = sum + parseFloat(curVal.net_total), 0))}</td>
                            <td className="text-right">{currency.format(requisitions?.reduce((sum, curVal) => sum = sum + parseFloat(curVal.budget_total), 0))}</td>
                            <td colSpan={5}></td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className='flex items-center justify-center mt-4'>
                <DropdownButton title="เอกสาร" btnColor="primary" cssClass="mr-1">
                    <DropdownItem>
                        <Link to={`/preview/procurement/summary/${getUrlParam(params, 'sdate')}/${getUrlParam(params, 'edate')}/${getUrlParam(params, 'status')}/${getUrlParam(params, 'limit')}`} target="_blank" className="text-success">
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

export default ProcurementSummary