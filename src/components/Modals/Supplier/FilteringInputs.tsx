import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { generateQueryString } from '../../../utils'
import ButtonGroupSelection, { ButtonGroupOption } from '../../ui/Forms/ButtonGroupSelection'

const statusOptions: ButtonGroupOption[] = [
    { value: '1', label: 'ใช้งาน', icon: <CheckCircle2 className="w-4 h-4" />, color: 'success' },
    { value: '9', label: 'ระงับ', icon: <XCircle className="w-4 h-4" />, color: 'danger' },
];

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFilters((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (val: string | number) => {
        const updated = { ...filters, status: val };
        setFilters(updated);
        onFilter(generateQueryString(updated));
    };

    const handleClearInput = () => {
        setFilters(initialFilters);
        onFilter(generateQueryString(initialFilters));
    };

    return (
        <Row className="mb-2 items-center">
            <Col className="md:mb-0">
                <div className="flex flex-col md:flex-row items-center gap-2 p-2 rounded">
                    <div className="relative w-full">
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onFilter(generateQueryString(filters));
                                }
                            }}
                            className="form-control text-sm"
                            placeholder="ค้นหาชื่อผู้จัดจำหน่าย"
                        />
                        {filters.name !== '' && <X
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition hover:text-gray-600 hover:font-bold cursor-pointer"
                            onClick={() => {
                                const updated = { ...filters, name: '' };
                                setFilters(updated);
                                onFilter(generateQueryString(updated));
                            }}
                        />}
                    </div>
                    <span className="text-lg text-gray-300 whitespace-nowrap mx-2 hidden md:block">|</span>
                    <div className="flex items-center md:justify-start gap-2 w-full">
                        <span className="text-sm text-gray-500 whitespace-nowrap">สถานะ:</span>
                        <ButtonGroupSelection
                            className="w-full max-w-[280px]"
                            options={statusOptions}
                            value={filters.status}
                            onChange={handleStatusChange}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm ml-1 whitespace-nowrap"
                            onClick={handleClearInput}
                        >
                            เคลียร์
                        </button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default FilteringInputs;
