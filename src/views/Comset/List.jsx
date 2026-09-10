import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { getComsets } from '../../features/slices/comset/comsetSlice';
import Loading from '../../components/ui/Loading';
import Pagination from '../../components/ui/Pagination';
import FilteringInputs from './FilteringInputs';
import { generateQueryString } from '../../utils';

const initialFilters = {
    name: '',
    status: 1
};

const ComsetList = () => {
    const dispatch = useDispatch();
    const { comsets, pager, isLoading } = useSelector(state => state.comset);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getComsets({ url: `/api/comsets/search?page=${params}` }));
        } else {
            dispatch(getComsets({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint]);

    const joinEquipments = (equipments) => {
        return equipments
            .map(eq => `${eq.type?.name} ${eq.brand?.name} ${eq.model} ${eq.capacity ? eq.capacity : '-'}${eq.status !== 1 ? '**' : ''}`)
            .join(', ');
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>ชุดคอมพิวเตอร์</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">ชุดคอมพิวเตอร์</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มชุดคอมพิวเตอร์</Link>
                </div>

                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(url) => {
                        setParams(url);
                        setApiEndpoint(prev => prev === '' ? `/api/comsets/search?page=` : '');
                    }}
                />

                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th className="text-center w-[15%]">หมายเลขพัสดุ</th>
                                <th className="text-center w-[15%]">ชุดคอมพิวเตอร์</th>
                                <th>รายละเอียด</th>
                                <th className="text-center w-[10%]">สถานะ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {comsets && comsets.map((com, index) => (
                                <tr key={com.id}>
                                    <td className="text-center">{index + pager.from}</td>
                                    <td className="text-center text-sm font-thin">{com.asset?.asset_no}</td>
                                    <td className="text-center">{com.name}</td>
                                    <td className="text-sm font-thin">
                                        {com.asset?.name}
                                        <span className="ml-1">ยี่ห้อ {com.asset?.brand?.name}</span>
                                        <span className="ml-1">รุ่น {com.asset?.model ? com.asset?.model : '-'}</span>
                                        <p>{com.description}</p>
                                        <p className="text-xs text-gray-400">{joinEquipments(com.equipments)}</p>
                                    </td>
                                    <td className="text-center">
                                        {com.status === 1 && <span className="badge rounded-pill text-bg-success">ใช้งานอยู่</span>}
                                        {com.status === 2 && <span className="badge rounded-pill text-bg-warning">รอซ่อม</span>}
                                        {com.status === 3 && <span className="badge rounded-pill text-bg-primary">ส่งซ่อม</span>}
                                        {com.status === 4 && <span className="badge rounded-pill text-bg-secondary">รอจำหน่าย</span>}
                                        {com.status === 5 && <span className="badge rounded-pill text-bg-dark">จำหน่าย</span>}
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/comset/${com.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/comset/${com.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && comsets.length <= 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        -- ไม่มีข้อมูล --
                                    </td>
                                </tr>
                            )}
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

export default ComsetList
