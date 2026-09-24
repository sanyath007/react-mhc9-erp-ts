import React, { useState } from 'react'
import { Col, FormGroup, Row } from 'react-bootstrap'
import { generateQueryString } from '../../utils'
import { useGetInitialFormDataQuery } from '../../features/services/requisition/requisitionApi'
import Loading from '../ui/Loading'

const initialFormData = {
    units: [],
    categories: [],
};

const RequisitionFilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters({ ...filters, [name]: value })
    };

    const handleFilter = () => {
        let queryStr = '';
        for (const [key, val] of Object.entries(filters)) {
            queryStr += `&${key}=${val}`;
        }

        onFilter(queryStr);
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
                            name="pr_no"
                            value={filters.pr_no}
                            onChange={handleInputChange}
                            placeholder="เลขที่คำขอ"
                            className="form-control text-sm font-thin"
                        />
                    </FormGroup>
                    <FormGroup>
                        <input
                            type="date"
                            name="pr_date"
                            value={filters.pr_date}
                            onChange={handleInputChange}
                            placeholder="วันที่คำขอ"
                            className="form-control text-sm font-thin"
                        />
                    </FormGroup>
                    <FormGroup>
                        {isLoading && <div className="form-control text-sm text-center"><Loading /></div>}
                        {!isLoading && (
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleInputChange}
                                className="form-control text-sm font-thin"
                            >
                                <option value="">-- ประเภทพัสดุ --</option>
                                {formData.categories && formData.categories.map(category => (
                                    <option value={category.id} key={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </FormGroup>
                    <FormGroup>
                        {isLoading && <div className="form-control text-sm text-center"><Loading /></div>}
                        {!isLoading && (
                            <select
                                name="division"
                                value={filters.division}
                                onChange={handleInputChange}
                                className="form-control text-sm font-thin"
                            >
                                <option value="">-- หน่วยงาน --</option>
                                {formData.divisions && formData.divisions.map(division => (
                                    <option value={division.id} key={division.id}>
                                        {division.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </FormGroup>
                    <FormGroup>
                        <button type="button" className="btn btn-outline-secondary text-sm" onClick={handleFilter}>
                            ตกลง
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger text-sm ml-1"
                            onClick={handleClearInputs}
                        >
                            เคลียร์
                        </button>
                    </FormGroup>
                </div>
            </Col>
        </Row>
    )
}

export default RequisitionFilteringInputs
