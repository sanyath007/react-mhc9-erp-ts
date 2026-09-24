import React, { useState } from 'react'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { generateQueryString } from '../../utils'
import { useStyles } from '../../hooks/useStyles'

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const classes = useStyles();
    const [filters, setFilters] = useState(initialFilters);
    const [selectedSdate, setSelectedSdate] = useState(moment(`${filters.sdate}`));
    const [selectedEdate, setSelectedEdate] = useState(moment(`${filters.edate}`));

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="border rounded-md py-2 px-3 mb-2 flex items-center gap-1">
            <div className="flex max-md:flex-col items-center min-md:gap-2">
                <label htmlFor="" className="w-[25%] max-md:w-[100%]">วันที่ :</label>
                <DatePicker
                    format="DD/MM/YYYY"
                    value={selectedSdate}
                    onChange={(date) => {
                        const endOfMonth = moment(date).endOf('month');

                        setSelectedSdate(date);
                        setSelectedEdate(endOfMonth);

                        setFilters(prev => ({
                            ...prev,
                            ['sdate']: moment(date).format('YYYY-MM-DD'),
                            ['edate']: moment(endOfMonth).format('YYYY-MM-DD'),
                        }));
                    }}
                    className={classes.muiTextFieldInput}
                />
            </div>
            <div className="flex max-md:flex-col items-center min-md:gap-2">
                <label htmlFor="" className="w-[25%] max-md:w-[100%]">ถึง :</label>
                <DatePicker
                    format="DD/MM/YYYY"
                    value={selectedEdate}
                    onChange={(date) => {
                        setSelectedEdate(date);
                        setFilters(prev => ({ ...prev, ['edate']: moment(date).format('YYYY-MM-DD') }));
                    }}
                    className={classes.muiTextFieldInput}
                />
            </div>
            <button
                type="button"
                className="btn btn-outline-dark btn-sm max-md:mt-6"
                onClick={() => onFilter(generateQueryString(filters))}
            >
                ค้นหา
            </button>
            <button
                type="button"
                className="btn btn-outline-danger btn-sm max-md:mt-6"
                onClick={() => {
                    setFilters(initialFilters);
                    setSelectedSdate(moment());
                    setSelectedEdate(moment());
                    onFilter(generateQueryString(initialFilters));
                }}
            >
                เคลียร์
            </button>
        </div>
    )
}

export default FilteringInputs