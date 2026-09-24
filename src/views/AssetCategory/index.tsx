import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getAssetCategories } from '../../features/slices/asset-category/assetCategorySlice'
import AssetCategoryList from './List'
import AssetCategoryForm from './Form'

const AssetCategory = () => {
    const dispatch = useDispatch<any>();
    const { categories, pager } = useSelector((state: any) => state.assetCategory);
    const [assetCategory, setAssetCategory] = useState(null);

    useEffect(() => {
        dispatch(getAssetCategories(null));
    }, [dispatch]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item href="/">ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>ชนิดพัสดุ</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">ชนิดพัสดุ</h2>
                </div>

                <AssetCategoryForm
                    assetCategory={assetCategory}
                    handleCancel={() => setAssetCategory(null)}
                />

                <AssetCategoryList
                    categories={categories}
                    pager={pager}
                    handleEditting={(dep) => setAssetCategory(dep)}
                />
            </div>
        </div>
    )
}

export default AssetCategory
