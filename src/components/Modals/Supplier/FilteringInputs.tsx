import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { generateQueryString } from '../../../utils';
// import { useGetInitialFormDataQuery } from '../../../services/item/itemApi';

const initialFormData = {
    units: [],
    categories: [],
};

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);
    // const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({ ...prev, [name]: value }));
    }

    const handleClearInput = () => {
        setFilters(initialFilters);
        onFilter(generateQueryString(initialFilters));
    }

    return (
        <Row className="mb-2">
            <Col>
                <div className="flex flex-row items-center">
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleInputChange}
                        className="form-control text-sm"
                        placeholder="ค้นหาชื่อผู้จัดจำหน่าย"
                    />
                    <button className="btn btn-outline-primary btn-sm ml-1" onClick={() => onFilter(generateQueryString(filters))}>
                        ค้นหา
                    </button>
                    <button className="btn btn-outline-danger btn-sm ml-1" onClick={handleClearInput}>
                        เคลียร์
                    </button>
                </div>
            </Col>
        </Row>
    )
}

export default FilteringInputs
