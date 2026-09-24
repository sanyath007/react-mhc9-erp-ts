import React, { useEffect, useState } from 'react'
import { Field } from 'formik'

interface CheckboxProps {
    name: string;
    value?: string | number;
    label?: React.ReactNode;
    checked?: number | boolean;
    handleChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setChecked(props.checked == 1 || props.checked === true)
    }, [props.checked])

    return (
        <div>
            <Field
                type="checkbox"
                name={props.name}
                value={props.value}
                checked={checked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setChecked(e.target.checked)
                    props.handleChange(e.target.checked)
                }}
                className="me-1"
            /> {props.label}
        </div>
    )
}

export default Checkbox
