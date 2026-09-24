import React, { useState } from 'react'
import { Col, FormGroup, Row } from 'react-bootstrap'
import { generateQueryString } from '../../utils';

const FilteringInputs = ({ initialFilters, onFilter, formData }: any) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters({ ...filters, [name]: value })
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
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
                            placeholder="ระบุชื่อ"
                            className="form-control text-sm"
                        />
                    </FormGroup>
                    <FormGroup>
                        <select
                            name="department"
                            value={filters.department}
                            onChange={handleInputChange}
                            className="form-control text-sm"
                        >
                            <option value="">-- หน่วยงาน --</option>
                            {formData.departments && formData.departments.map(department => (
                                <option value={department.id} key={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </FormGroup>
                    {/* <FormGroup>
                        <select
                            name="division"
                            value={filters.division}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">-- หน่วยงาน --</option>
                            {formData.divisions && formData.divisions.map(division => (
                                <option value={division.id} key={division.id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                    </FormGroup> */}
                    <FormGroup>
                        <button type="button" className="btn btn-outline-secondary btn-sm mt-[1px]" onClick={handleFilter}>
                            ค้นหา
                        </button>
                    </FormGroup>
                </div>
            </Col>
        </Row>
    )
}

export default FilteringInputs
