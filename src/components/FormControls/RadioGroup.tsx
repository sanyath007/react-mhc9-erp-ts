import React, { useState, ChangeEvent } from 'react'

interface RadioItem {
    id: string | number;
    name: string;
}

interface RadioGroupProps {
    label?: string;
    name: string;
    defaultValue?: string | number;
    items: RadioItem[];
    direction?: 'row' | 'col';
    onSelected: (data: { name: string; value: string }) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, defaultValue, items = [], direction, onSelected }) => {
    const [selected, setSelected] = useState<string>("")

    const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        setSelected(value)
        onSelected({ name, value })
    }

    return (
        <div className={direction == 'row' ? 'input-wrapper drow' : 'input-wrapper dcol'}>
            {label && <label htmlFor="">{label}</label>}
            {items.map(item => (
                <div key={item.id} className="input-radio">
                    <input
                        type="radio"
                        name={name}
                        value={item.id}
                        onChange={handleChecked}
                        checked={defaultValue == item.id}
                    /> {item.name}
                </div>
            ))}
        </div>
    )
}

export default RadioGroup
