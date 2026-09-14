import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getAssetTypes } from '../../features/slices/asset-type/assetTypeSlice'
import AssetTypeList from './List'
import AssetTypeForm from './Form'

const AssetType = () => {
    const dispatch = useDispatch<any>();
    const { types, pager } = useSelector((state: any) => state.assetType);
    const [assetType, setAssetType] = useState(null);

    useEffect(() => {
        dispatch(getAssetTypes(null));
    }, [dispatch]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item href="/">ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>ประเภทพัสดุ</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">ประเภทพัสดุ</h2>
                </div>

                <AssetTypeForm
                    assetType={assetType}
                    handleCancel={() => setAssetType(null)}
                />

                <AssetTypeList
                    assetTypes={types}
                    pager={pager}
                    handleEditting={(assetType) => setAssetType(assetType)}
                />
            </div>
        </div>
    )
}

export default AssetType
