import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { FaSearch, FaPencilAlt, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import { generateQueryString } from '../../utils'
import { getRepairations } from '../../features/slices/repairation/repairationSlice'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'

const initialFilters = {};

const RepairationList = () => {
    const dispatch = useDispatch();
    const { repairations, pager, isLoading } = useSelector(state => state.repairation);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters))

    useEffect(() => {
        dispatch(getRepairations({ url: '/api/repairations/search' }))
    }, [dispatch]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการส่งซ่อม</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายการส่งซ่อม</h2>

                <div>
                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="w-[5%] text-center">#</th>
                                <th className="w-[12%] text-center">วันที่ส่งซ่อม</th>
                                <th>รายละเอียดปัญหา</th>
                                <th className="w-[22%]">ผู้ส่งซ่อม</th>
                                <th className="w-[8%] text-center">สถานะ</th>
                                <th className="w-[10%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="text-center"><Loading /></td>
                                </tr>
                            )}
                            {!isLoading && repairations && repairations.map((repairation, index) => (
                                <tr key={repairation.id} className="font-thin">
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td className="text-center">
                                        <p className="text-sm">{moment(repairation.request_date).format('DD/MM/YYYY')}</p>
                                        <p className="text-sm font-thin"><b className="mr-1">เวลา</b>{repairation.request_time}</p>
                                    </td>
                                    <td>
                                        {/** Render Task data */}
                                        <p className="text-sm font-thin">
                                            {repairation.task?.problem}
                                            <span className="ml-1">{repairation.asset?.name}</span>
                                            <span className="ml-1"><b>ยี่ห้อ</b> {repairation.asset?.brand?.name}</span>
                                        </p>
                                    </td>
                                    <td>
                                        {`${repairation.requester?.prefix?.name}${repairation.requester?.firstname} ${repairation.requester?.lastname}`}
                                        <p><b>{`${repairation.requester?.position?.name}${repairation.requester?.level ? repairation.requester?.level?.name : ''}`}</b></p>
                                    </td>
                                    <td className="text-center">
                                        {repairation.status === 1 && <span className="badge rounded-pill text-bg-secondary">รอซ่อม</span>}
                                        {repairation.status === 2 && <span className="badge rounded-pill text-bg-info">สั่งซื้ออะไหล่</span>}
                                        {repairation.status === 3 && <span className="badge rounded-pill text-bg-warning">ส่งซ่อมภายนอก</span>}
                                        {repairation.status === 4 && <span className="badge rounded-pill text-bg-success">ส่งมอบแล้ว</span>}
                                        {repairation.status === 9 && <span className="badge rounded-pill text-bg-danger">ยกเลิก</span>}
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/repairation/${repairation.id}/detail`} className="btn btn-sm btn-info mr-1">
                                            <FaSearch size={'12px'} />
                                        </Link>
                                        <Link to={`/repairation/${repairation.id}/edit`} className="btn btn-sm btn-warning mr-1">
                                            <FaPencilAlt size={'12px'} />
                                        </Link>
                                        <button className="btn btn-sm btn-danger">
                                            <FaTrash size={'12px'} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pager={pager}
                    onPageClick={(url) => setApiEndpoint(url)}
                />
            </div>
        </div>
    )
}

export default RepairationList
