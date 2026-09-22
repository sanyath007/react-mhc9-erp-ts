import React from 'react';

export interface ButtonGroupOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
}

interface ButtonGroupSelectionProps {
    options: ButtonGroupOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    error?: boolean;
    errorMessage?: string;
    className?: string;
}

const ButtonGroupSelection: React.FC<ButtonGroupSelectionProps> = ({
    options,
    value,
    onChange,
    error,
    errorMessage,
    className = ''
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <div className={`flex flex-row space-x-2 ${error ? 'border !border-red-500 rounded p-1' : ''}`}>
                {options.map((option) => {
                    const isSelected = String(value) === String(option.value);
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`btn flex items-center justify-center flex-1 py-2 text-sm transition-colors duration-200 ${
                                isSelected
                                    ? 'btn-primary shadow-sm border-primary text-white font-medium'
                                    : 'btn-outline-secondary bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                            {option.icon && (
                                <span className={`mr-2 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                    {option.icon}
                                </span>
                            )}
                            {option.label}
                        </button>
                    );
                })}
            </div>
            {error && errorMessage && (
                <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
            )}
        </div>
    );
};

export default ButtonGroupSelection;
