import React, { useState } from 'react';
import { Col, FormGroup, Row } from 'react-bootstrap';
import YearPicker from '../../components/ui/Forms/YearPicker';
import { generateQueryString } from '../../utils';
import { FaSearch } from 'react-icons/fa';

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFilters((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
    };

    const handleClear = () => {
        setFilters(initialFilters);
        onFilter(generateQueryString(initialFilters));
    };

    return (
        <div className="filtering-wrapper border rounded-md py-3 px-4 mb-2">
            <Row>
                <Col lg={11}>
                    <Row>
                        <Col className="px-1 mb-2" md={8}>
                            <FormGroup>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="ชื่อโครงการ"
                                    className="form-control text-sm"
                                />
                            </FormGroup>
                        </Col>
                        <Col className="px-1 mb-2" md={4}>
                            <FormGroup>
                                <YearPicker
                                    value={filters.year}
                                    onChange={(year: string) => {
                                        setFilters((prev: any) => ({ ...prev, year: year }));
                                    }}
                                    inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col lg={1} className="max-lg:pr-1 lg:pl-1">
                    <button 
                        type="button" 
                        className="btn btn-primary btn-sm w-full h-[34px] flex items-center justify-center mb-1" 
                        onClick={handleFilter}
                    >
                        <FaSearch className="mr-1" /> ค้นหา
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary btn-sm w-full h-[34px] flex items-center justify-center" 
                        onClick={handleClear}
                    >
                        ล้าง
                    </button>
                </Col>
            </Row>
        </div>
    );
};

export default FilteringInputs;
