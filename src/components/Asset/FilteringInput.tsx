import React, { useState } from 'react'
import { Col, Row, FormGroup } from 'react-bootstrap'
import { generateQueryString } from '../../utils'
import { useGetInitialFormDataQuery } from '../../features/services/asset/assetApi';
import Loading from '../ui/Loading';

const initialFormData = {
    groups: [],
    employees: [],
    statuses: []
};

const AssetFilteringInput = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const _filters = { ...filters, [name]: value };

        setFilters(_filters);
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
    };

    const handleClearInputs = () => {
        setFilters(initialFilters);

        onFilter(generateQueryString(initialFilters));
    };

    return (
        <Row>
            <Col>
                <div className="flex flex-row gap-2 border rounded-md p-2 my-2">
                    <FormGroup>
                        <input
                            type="text"
                            name="assetNo"
                            value={filters.assetNo}
                            onChange={handleInputChange}
                            className="form-control text-sm font-thin"
                            placeholder="หมายเลขพัสดุ"
                        />
                    </FormGroup>
                    {/* <FormGroup>
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleInputChange}
                            className="form-control text-sm font-thin"
                            placeholder="ชื่อพัสดุ"
                        />
                    </FormGroup> */}
                    {/* <FormGroup>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">-- ชนิดพัสดุ --</option>
                            {categories && categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </FormGroup> */}
                    <FormGroup className="w-[40%]">
                        {isLoading && <div className="form-control text-center"><Loading /></div>}
                        {!isLoading && (
                            <select
                                name="group"
                                value={filters.group}
                                onChange={handleInputChange}
                                className="form-control text-sm font-thin"
                            >
                                <option value="">-- กลุ่มพัสดุ --</option>
                                {formData.groups && formData.groups.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </FormGroup>
                    <FormGroup>
                        {isLoading && <div className="form-control text-center"><Loading /></div>}
                        {!isLoading && (
                            <select
                                name="owner"
                                value={filters.owner}
                                onChange={handleInputChange}
                                className="form-control text-sm font-thin"
                            >
                                <option value="">-- ผู้รับผิดชอบ --</option>
                                {formData.employees && formData.employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {`${employee.firstname} ${employee.lastname}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </FormGroup>
                    <FormGroup>
                        {isLoading && <div className="form-control text-center"><Loading /></div>}
                        {!isLoading && (
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleInputChange}
                                className="form-control text-sm font-thin"
                            >
                                <option value="">-- สถานะ --</option>
                                {formData.statuses && formData.statuses.map(status => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        )}
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

export default AssetFilteringInput
