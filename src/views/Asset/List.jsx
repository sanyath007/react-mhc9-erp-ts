import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaSearch, FaPencilAlt, FaTrash } from 'react-icons/fa'
import { calcUsedAgeY, generateQueryString } from '../../utils'
import { getAssets, destroy } from '../../features/slices/asset/assetSlice'
import Asset from '../../components/Asset/Asset'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'
import AssetFilteringInput from '../../components/Asset/FilteringInput'

const initialFilters = {
    assetNo: '',
    name: '',
    category: '',
    group: '',
    owner: '',
    status: '1'
};

const AssetList = () => {
    const dispatch = useDispatch();
    const { assets, pager, isLoading } = useSelector(state => state.asset);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters))

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getAssets({ url: `/api/assets/search?page=&status=1` }));
        } else {
            dispatch(getAssets({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    const handleFilter = (queryStr) => {
        setParams(queryStr);

        setApiEndpoint(`/api/assets/search?page=`);
    };

    const handleDelete = (id) => {
        if (window.confirm('คุณต้องการลบรายการครุภัณฑ์ใช่หรือไม่?')) {
            dispatch(destroy({ id }));
        }
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการพัสดุ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการพัสดุ</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มพัสดุใหม่</Link>
                </div>

                <AssetFilteringInput
                    initialFilters={initialFilters}
                    onFilter={handleFilter}
                />

                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>รายการ</th>
                                <th className="text-center w-[8%]">อายุใช้งาน</th>
                                <th className="text-center w-[15%]">ผู้รับผิดชอบ</th>
                                <th className="text-center w-[8%]">สถานะ</th>
                                <th className="text-center w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {assets && assets.map((asset, index) => (
                                <tr key={asset.id} className="font-thin">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td><Asset asset={asset} /></td>
                                    <td className="text-sm text-center">
                                        {`${calcUsedAgeY(asset.first_year)}ปี`}
                                    </td>
                                    <td className="text-sm">
                                        {asset.current_owner?.length > 0 && `${asset.current_owner[0].owner.prefix.name}${asset.current_owner[0].owner.firstname} ${asset.current_owner[0].owner.lastname}`}
                                    </td>
                                    <td className="text-center">
                                        {asset.status === 1 && <span className="badge rounded-pill text-bg-success">ใช้งานอยู่</span>}
                                        {asset.status === 2 && <span className="badge rounded-pill text-bg-dark">สำรอง</span>}
                                        {asset.status === 3 && <span className="badge rounded-pill text-bg-secondary">ถูกยืม</span>}
                                        {asset.status === 9 && <span className="badge rounded-pill text-bg-warning">รอจำหน่าย</span>}
                                        {asset.status === 99 && <span className="badge rounded-pill text-bg-danger">จำหน่าย</span>}
                                    </td>
                                    <td className="text-center p-1">
                                        <Link to={`/asset/${asset.id}/detail`} className="btn btn-sm btn-info px-1 mr-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/asset/${asset.id}/edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(asset.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && assets?.length <= 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center text-sm font-thin">
                                        <span className="text-red-500">-- ไม่มีข้อมูล --</span>
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

export default AssetList
