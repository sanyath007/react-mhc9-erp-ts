import React, { useState } from 'react'

const RadioButtonGroup = ({ items, defaultValue, selected, onChange }: any) => {
    return (
        <div className="flex flex-row gap-2">
            {items.map(item => (
                <RadioButtonItem
                    key={item.value}
                    item={item}
                    isChecked={selected ? selected === item.value : defaultValue === item.value}
                    onSelect={(val) => onChange(val)}
                />
            ))}
        </div>
    )
}

const RadioButtonItem = ({ item, isChecked, onSelect }: any) => {
    return (
        <label className={`flex gap-1 rounded-md px-3 py-1 ${isChecked ? ' bg-[#D1EDE8] text-[#03A9F4] border-[#03A9F4] border-[1px]' : 'border'}`}>
            <input
                type="radio"
                checked={isChecked}
                onChange={() => onSelect(item.value)}
            />
            {item.label}
        </label>
    );
}

export default RadioButtonGroup