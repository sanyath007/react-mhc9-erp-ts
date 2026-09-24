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
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    size="small" 
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '34px',
                            fontSize: '0.875rem',
                            backgroundColor: '#fff',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isInvalid ? 'red' : '#dee2e6',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isInvalid ? 'red' : '#dee2e6',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: isInvalid ? 'red' : '#86b7fe',
                            borderWidth: '1px',
                        }
                    }}
                />
            )}
            sx={{
                '& .MuiAutocomplete-inputRoot': {
                    paddingTop: '0 !important',
                    paddingBottom: '0 !important',
                    paddingLeft: '4px !important',
                }
            }}
        />
    )
}

export default DropdownAutocomplete