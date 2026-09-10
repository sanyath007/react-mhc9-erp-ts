import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

interface DropdownItem {
    id: string | number;
    name?: string;
    [key: string]: any;
}

interface DropdownAutocompleteProps {
    options?: DropdownItem[];
    defaultVal?: DropdownItem | null;
    onSelect: (item: DropdownItem | null) => void;
    isInvalid?: boolean;
}

const DropdownAutocomplete: React.FC<DropdownAutocompleteProps> = ({ options=[], defaultVal, onSelect, isInvalid }) => {
    return (
        <Autocomplete
            disablePortal
            onChange={(e, newVal) => onSelect(newVal as DropdownItem | null)}
            id="combo-box-demo"
            options={options}
            defaultValue={defaultVal}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} />}
            sx={{
                '& .MuiFormControl-root.MuiTextField-root': {
                    border: `${isInvalid ? '1px solid red' : 'inherit'}`,
                    borderRadius: '0.25rem'
                }
            }}
        />
    )
}

export default DropdownAutocomplete