import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { WatDatePicker } from 'thaidatepicker-react'

interface ThDatePickerProps {
    onChange: (christDate: string, buddhistDate: string) => void;
    defaultValue?: string;
    error?: boolean;
    [key: string]: any;
}

const ThDatePicker: React.FC<ThDatePickerProps> = ({ onChange, defaultValue = '', error, ...props }) => {
    const [selectedDate, setSelectedDate] = useState<string>('')

    useEffect(() => {
        if (defaultValue) {
            setSelectedDate(defaultValue)
        }
    }, [defaultValue])

    const handleChange = (christDate: string, buddhistDate: string) => {
        onChange(christDate, buddhistDate)

        setSelectedDate(christDate)
    }

    return (
        <div className={`form-control ${error ? 'is-invalid' : ''}`}>
            <WatDatePicker
                value={selectedDate} // Can be replace with string or dayjs object (e.g. "2020-12-31" or `dayjs()`)
                onChange={handleChange}
                dateFormat={'yyyy-MM-dd'} // for set data purpose [using date-fns format](https://date-fns.org/v2.12.0/docs/format)
                displayFormat={'DD MMMM YYYY'} // for display purpose (using dayjs format)[https://day.js.org/docs/en/display/format]
                inputStyle={{ width: '100%', border: 'none', backgroundColor: 'transparent', outline: 'none' }} // styles for input
                clearable={true} // true | false
                minDate={'2020-12-26'} // supported date as string
                maxDate={dayjs().add(20, 'day')} // also supported dayjs or moment
                disabled={false} // true | false
                readOnly={false} // true | false
                yearBoundary={99} // number of boundary ±X Year
            />
        </div>
    )
}

export default ThDatePicker
