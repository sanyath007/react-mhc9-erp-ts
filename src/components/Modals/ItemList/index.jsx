import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { generateQueryString } from '../../../utils';
import { getItems } from '../../../features/slices/item/itemSlice';
import { useGetInitialFormDataQuery } from '../../../features/services/item/itemApi';
import FilteringInputs from '../../Item/FilteringInputs';
import CardList from './CardList';
import TableList from './TableList';
import ControlButtons from './ControlButtons';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination';

const initialFormData = {
    units: [],
    categories: [],
};

const ModalItemList = ({ isShow, onHide, onSelect, defaultCategory }) => {
    const initialFilters = { name: '', category: defaultCategory || '' };
    const dispatch = useDispatch();
    const { items, pager, loading } = useSelector(state => state.item);
    const [isListMode, setIsListMode] = useState(false);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (apiEndpoint === '') {
            dispatch(getItems({ url: `/api/items/search?page=&limit=12${params}` }));
        } else {
            dispatch(getItems({ url: `${apiEndpoint}${params}` }));
        }
    }, [apiEndpoint]);

    useEffect(() => {
        setParams(generateQueryString({ name: '', category: defaultCategory }));
        setApiEndpoint(prev => prev === '' ? '/api/items/search?page=&limit=12' : '');
    }, [defaultCategory]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header className="border py-1 px-2">
                <div className="flex flex-row items-center justify-between w-full">
                    <Modal.Title>รายการสินค้า/บริการ</Modal.Title>
                    <div className="flex flex-row items-center gap-2">
                        <ControlButtons isListMode={isListMode} onIsListModeClick={setIsListMode} />
                        <FaTimes size={'20px'} className="cursor-pointer hover:text-gray-400 text-gray-600" onClick={onHide} />
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => {
                        setParams(queryStr);
                        setApiEndpoint(prev => prev === '' ? '/api/items/search?page=&limit=12' : '');
                    }}
                    formData={formData}
                />

                {loading && (
                    <div className="text-center">
                        <Loading />
                    </div>
                )}

                {!isListMode ? (
                    <CardList
                        items={items}
                        onHide={onHide}
                        onSelect={onSelect}
                    />
                ) : (
                    <TableList
                        items={items}
                        pager={pager}
                        onHide={onHide}
                        onSelect={onSelect}
                    />
                )}
            </Modal.Body>
            <Modal.Footer className="py-1">
                {(pager && pager.last_page > 1) && (
                    <Pagination
                        pager={pager}
                        onPageClick={(url) => setApiEndpoint(`${url}&limit=12`)}
                    />
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default ModalItemList
