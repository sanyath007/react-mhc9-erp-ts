import React, { useState } from 'react'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { generateQueryString } from '../../../utils'
import { useStyles } from '../../../hooks/useStyles'
import { useGetInitialFormDataQuery } from '../../../features/services/budget-project/budgetProjectApi';
import Loading from '../../../components/ui/Loading'

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const classes = useStyles();
    const [filters, setFilters] = useState(initialFilters);
    const [selectedYear, setSelectedYear] = useState(initialFilters ? moment(`${initialFilters.year}-01-01`) : moment());
    const { data: formData, isFetching } = useGetInitialFormDataQuery();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="border rounded-md py-2 px-3 mb-2 flex items-center gap-1">
            <div className="flex max-md:flex-col items-center min-md:gap-2">
                <label htmlFor="" className="w-[25%] max-md:w-[100%]">ปีงบ :</label>
                <DatePicker
                    format="YYYY"
                    views={['year']}
                    value={selectedYear}
                    onChange={(date) => {
                        setSelectedYear(date);
                        setFilters(prev => ({
                            ...prev,
                            plan: '',
                            year: moment(date).year()
                        }));
                    }}
                    className={classes.muiTextFieldInput}
                />
            </div>
            <div className="flex max-md:flex-col items-center min-md:gap-2 ml-2 w-[30%]">
                <label htmlFor="" className="w-[35%] max-md:w-[100%]">แผนงาน :</label>
                {isFetching && <div className="form-control text-sm"><Loading /></div>}
                {(!isFetching && formData) && (
                    <select
                        name="plan"
                        value={filters.plan}
                        onChange={handleInputChange}
                        className="form-control text-sm"
                    >
                        <option value="">-- แผนงานทั้งหมด --</option>
                        {formData && formData.plans.map(plan => (
                            <option value={plan.id} key={plan.id}>
                                {plan.plan_no} {plan.name}
                            </option>
                        ))}
                    </select>
                )}
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