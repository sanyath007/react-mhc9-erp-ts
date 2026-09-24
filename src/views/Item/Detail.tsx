import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { getItem } from '../../features/slices/item/itemSlice'
import { currency } from '../../utils'

const ItemDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { item } = useSelector((state: any) => state.item);

    useEffect(() => {
        dispatch(getItem(id));
    }, [dispatch, id])

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/item' }}>รายการสินค้า/บริการ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดสินค้า/บริการใหม่</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <h2 className="text-xl">รายละเอียดสินค้า/บริการใหม่ ID : {id}</h2>

                <div className="my-2 border p-4 rounded-md">
                    {item && (
                        <div className="flex flex-row">
                            {![3,4].includes(item?.category?.asset_type_id) && (
                                <div className="mr-4">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/uploads/${item?.img_url}`}
                                        alt="item-img"
                                        className="w-[200px] h-auto"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col gap-1 w-full">
                                <p className="text-lg text-gray-600">{item?.category?.name}</p>
                                <p className="text-lg">{item?.name}</p>
                                <p className="font-bold text-lg">
                                    ราคา <span className="text-red-500">{currency.format(item.price)}</span> บาท |
                                    หน่วยนับ : <span className="font-thin">{item.unit?.name}</span>
                                </p>
                                {/* <ItemDesc item={item} /> */}
                                <div className="border rounded-md p-2 w-full min-h-[120px] bg-gray-50 overflow-scroll">
                                    <p className="underline">รายละเอียด</p>
                                    <p className="text-sm text-gray-400 font-thin">
                                        {item?.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

    export default ItemDetail
