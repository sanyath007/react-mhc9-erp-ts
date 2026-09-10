import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { currency } from '../../utils';
import { getItems, destroy, resetDeleted } from '../../features/slices/item/itemSlice';
import { useGetInitialFormDataQuery } from '../../features/services/item/itemApi'
import Pagination from '../../components/ui/Pagination'
import Loading from '../../components/ui/Loading';
import Item from '../../components/Item/Item';
import FilteringInputs from '../../components/Item/FilteringInputs'

const initialFilters = {
    name: '',
    category: ''
};

const initialFormData = {
    units: [],
    categories: [],
};

const ItemList = () => {
    const dispatch = useDispatch();
    const { items, pager, isLoading, isDeleted } = useSelector(state => state.item);
    const { data: formData = initialFormData } = useGetInitialFormDataQuery();
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState('');

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getItems({ url: `/api/items/search?page=${params}` }));
        } else {
            dispatch(getItems({ url: `${apiEndpoint}${params}` }));
        }
    }, [dispatch, apiEndpoint, params]);

    useEffect(() => {
        if (isDeleted) {
            toast.success('ลบรายการสินค้าเรียบร้อย!!');
            dispatch(getItems({ url: `/api/items/search?page=${params}` }));
            dispatch(resetDeleted());
        }
    }, [isDeleted]);

    const handleFilter = (queryStr) => {
        setParams(queryStr);
        setApiEndpoint(`/api/items/search?page=`);
    };

    const handleDelete = (id) => {
        if (window.confirm(`คุณต้องการลบรายการสินค้ารหัส ${id} หรือไม่?`)) {
            dispatch(destroy({ id }));
        }
    };

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>รายการสินค้า/บริการ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">รายการสินค้า/บริการ</h2>
                    <Link to="add" className="btn btn-primary">เพิ่มสินค้า/บริการใหม่</Link>
                </div>
                <div className="mt-2">
                    <FilteringInputs
                        initialFilters={initialFilters}
                        formData={formData}
                        onFilter={handleFilter}
                    />

                    <table className="table table-bordered mb-2">
                        <thead>
                            <tr>
                                <th className="w-[5%] text-center">#</th>
                                <th>ชื่อสินค้า/บริการ</th>
                                <th className="w-[15%] text-center">ราคา</th>
                                <th className="w-[10%] text-center">สถานะ</th>
                                <th className="w-[10%] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td className="text-center" colSpan={5}><Loading /></td>
                                </tr>
                            )}
                            {(!isLoading && items) && items.map((item, index) => (
                                <tr key={item.id} className="text-sm">
                                    <td className="text-center">{pager && pager.from + index}</td>
                                    <td>
                                        <Item item={item} />
                                    </td>
                                    <td className="text-center">{currency.format(item.price)}</td>
                                    <td className="text-center"></td>
                                    <td className="text-center p-1">
                                        <Link to={`/item/${item.id}/detail`} className="btn btn-outline-primary btn-sm px-1">
                                            <FaSearch />
                                        </Link>
                                        <Link to={`/item/${item.id}/edit`} className="btn btn-outline-warning btn-sm px-1 m-1">
                                            <FaPencilAlt />
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm px-1"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setApiEndpoint(url)}
                    />
                </div>
            </div>
        </div>
    )
}

export default ItemList