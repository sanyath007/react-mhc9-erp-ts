import React, { useState } from 'react'
import { Col, FormGroup, Row } from 'react-bootstrap'
import { generateQueryString } from '../../utils';

const FilteringInputs = ({ initialFilters, formData, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters({ ...filters, [name]: value })
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
    };

    const handleClearInputs = () => {
        setFilters(initialFilters);

        onFilter(generateQueryString(initialFilters));
    };

    return (
        <Row className="mb-2">
            <Col>
                <div className="filtering-wrapper border rounded-md flex flex-row gap-2 p-2">
                    <FormGroup>
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleInputChange}
                            placeholder="ค้นหาด้วยชื่อ"
                            className="form-control text-sm"
                        />
                    </FormGroup>
                    <FormGroup>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleInputChange}
                            className="form-control text-sm"
                        >
                            <option value="">-- ทั้งหมด --</option>
                            {formData.types && formData.types.map(type => (
                                <optgroup key={type.id} label={type.name}>
                                    {type.categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <button type="button" className="btn btn-outline-secondary text-sm" onClick={handleFilter}>
                            ตกลง
                        </button>
                        <button type="button" className="btn btn-outline-danger text-sm ml-1" onClick={handleClearInputs}>
                            เคลียร์
                        </button>
                    </FormGroup>
                </div>
            </Col>
        </Row>
    )
}

export default FilteringInputs
