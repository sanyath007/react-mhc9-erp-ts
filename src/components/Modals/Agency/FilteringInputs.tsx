import React, { useState } from 'react'
import { generateQueryString } from '../../../utils';

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters({ ...filters, [name]: value })
    };

    return (
        <div className="border rounded-md p-2">
            <div className="flex gap-1">
                <input
                    type="text"
                    name='name'
                    value={filters.name}
                    onChange={handleInputChange}
                    className="form-control text-sm"
                    placeholder="ชื่อหน่วยรับงบประมาณ"
                />
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onFilter(generateQueryString(filters))}>
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
        </div>
    )
}

export default FilteringInputs
