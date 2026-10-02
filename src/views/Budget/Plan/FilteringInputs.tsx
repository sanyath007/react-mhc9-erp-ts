import React, { useState } from 'react'
import moment from 'moment'
import { generateQueryString } from '../../../utils'
import YearPicker from '../../../components/ui/Forms/YearPicker'

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);
    const [selectedYear, setSelectedYear] = useState(filters.year);

    return (
        <div className="border rounded-md py-2 px-3 mb-4 flex items-center gap-1">
            <div className="flex max-md:flex-col items-center min-md:gap-2">
                <label className="mr-1 max-md:w-[100%]">ปีงบ :</label>
                <YearPicker
                    value={selectedYear}
                    onChange={(year: string) => {
                        setSelectedYear(year);
                        setFilters(prev => ({ ...prev, ['year']: year }));
                    }}
                    inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                />
            </div>
            <button
                type="button"
                className="btn btn-outline-secondary btn-sm max-md:mt-6"
                onClick={() => onFilter(generateQueryString(filters))}
            >
                ค้นหา
            </button>
            <button
                type="button"
                className="btn btn-outline-danger btn-sm max-md:mt-6"
                onClick={() => {
                    setFilters(initialFilters);
                    setSelectedYear(moment());
                    onFilter(generateQueryString(initialFilters));
                }}
            >
                เคลียร์
            </button>
        </div>
    )
}

export default FilteringInputs