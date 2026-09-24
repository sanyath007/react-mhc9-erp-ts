import React, { useState } from 'react'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { generateQueryString } from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const classes = useStyles();
    const [filters, setFilters] = useState(initialFilters);
    const [selectedYear, setSelectedYear] = useState(moment(`${filters.year}-01-01`));

    return (
        <div className="border rounded-md py-2 px-3 mb-4 flex items-center gap-1">
            <div className="flex max-md:flex-col items-center min-md:gap-2">
                <label htmlFor="" className="w-[25%] max-md:w-[100%]">ปีงบ :</label>
                <DatePicker
                    format="YYYY"
                    views={['year']}
                    value={selectedYear}
                    onChange={(date) => {
                        setSelectedYear(date);
                        setFilters(prev => ({ ...prev, ['year']: moment(date).year() }));
                    }}
                    className={classes.muiTextFieldInput}
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