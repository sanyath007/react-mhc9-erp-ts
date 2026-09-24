import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { generateQueryString } from '../../utils'

const FilteringInputs = ({ initialFilters, onFilter }) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
    };

    return (
        <div className="border rounded-md p-2 mb-2">
            <Row>
                <Col>
                    <div className="flex flex-row items-center gap-2">
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleInputChange}
                            className="form-control text-sm"
                            placeholder="ค้นหาชื่อชุดคอมพิวเตอร์"
                        />
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleInputChange}
                            className="form-control text-sm"
                        >
                            <option value="">-- ทั้งหมด --</option>
                            <option value="1">ใช้งานอยู่</option>
                            <option value="4">รอจำหน่าย</option>
                            <option value="5">จำหน่ายแล้ว</option>
                        </select>
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleFilter}>
                            ค้นหา
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                                setFilters(initialFilters);
                                onFilter(generateQueryString(initialFilters));
                            }}
                        >
                            เคลียร์
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default FilteringInputs;
