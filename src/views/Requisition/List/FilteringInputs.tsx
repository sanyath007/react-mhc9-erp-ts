import React, { useState } from 'react'
import YearPicker from '../../../components/ui/Forms/YearPicker'
import moment from 'moment'
import { generateQueryString } from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'
import { useGetInitialFormDataQuery } from '../../../features/services/requisition/requisitionApi';

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const classes = useStyles();
    const [filters, setFilters] = useState(initialFilters);
    const [selectedYear, setSelectedYear] = useState(filters.year);
    const { data: formData } = useGetInitialFormDataQuery();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="border rounded-md py-2 px-3 mb-2 flex items-center gap-1">
            <div className="flex max-md:flex-col items-center min-md:gap-2">
                <label htmlFor="" className="w-[25%] max-md:w-[100%]">ปีงบ :</label>
                <YearPicker
                    value={selectedYear}
                    onChange={(year: string) => {
                        setSelectedYear(year);
                        setFilters(prev => ({ ...prev, ['year']: year }));
                    }}
                    inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                />
            </div>
            <div className="flex max-md:flex-col items-center min-md:gap-2 ml-2 w-[30%]">
                <label htmlFor="" className="w-[30%] max-md:w-[100%]">สถานะ :</label>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleInputChange}
                    className="form-control text-sm"
                >
                    <option value="">-- สถานะทั้งหมด --</option>
                    {formData && formData.statuses.map(status => (
                        <option value={status.id} key={status.id}>{status.name}</option>
                    ))}
                </select>
            </div>
            <button
                type="button"
                className="btn btn-outline-primary btn-sm max-md:mt-6"
                onClick={() => onFilter(generateQueryString(filters))}
            >
                ค้นหา
            </button>
            <button
                type="button"
                className="btn btn-outline-danger btn-sm max-md:mt-6"
                onClick={() => {
                    setFilters(initialFilters);
                    setSelectedYear(moment().year());
                    onFilter(generateQueryString(initialFilters));
                }}
            >
                เคลียร์
            </button>
        </div>
    )
}

export default FilteringInputs