import React from 'react';
import ErrorMessage from './ErrorMessage';

export interface ButtonGroupOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'emerald' | 'rose' | 'blue' | 'amber' | string;
    selectedClassName?: string;
    unselectedClassName?: string;
    iconColor?: string;
    selectedIconColor?: string;
    className?: string;
}

interface ButtonGroupSelectionProps {
    options: ButtonGroupOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    error?: boolean;
    errorMessage?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const getOptionColorClasses = (option: ButtonGroupOption, isSelected: boolean) => {
    if (isSelected) {
        if (option.selectedClassName) {
            return option.selectedClassName;
        }

        switch (option.color) {
            case 'success':
            case 'emerald':
            case 'green':
                return 'btn-success bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-medium';
            case 'danger':
            case 'rose':
            case 'red':
                return 'btn-danger bg-rose-600 border-rose-600 text-white hover:bg-rose-700 shadow-sm font-medium';
            case 'warning':
            case 'amber':
            case 'yellow':
                return 'btn-warning bg-amber-500 border-amber-500 text-white hover:bg-amber-600 shadow-sm font-medium';
            case 'info':
            case 'cyan':
                return 'btn-info bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700 shadow-sm font-medium';
            case 'primary':
            case 'blue':
                return 'btn-primary bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-sm font-medium';
            default:
                if (option.color) {
                    return `${option.color} text-white shadow-sm font-medium`;
                }
                return 'btn-primary shadow-sm border-primary text-white font-medium';
        }
    } else {
        if (option.unselectedClassName) {
            return option.unselectedClassName;
        }

        switch (option.color) {
            case 'success':
            case 'emerald':
            case 'green':
                return 'bg-white text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 hover:border-emerald-300 border-gray-300';
            case 'danger':
            case 'rose':
            case 'red':
                return 'bg-white text-gray-600 hover:text-rose-700 hover:bg-rose-50/50 hover:border-rose-300 border-gray-300';
            case 'warning':
            case 'amber':
            case 'yellow':
                return 'bg-white text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 hover:border-amber-300 border-gray-300';
            case 'info':
            case 'cyan':
                return 'bg-white text-gray-600 hover:text-cyan-700 hover:bg-cyan-50/50 hover:border-cyan-300 border-gray-300';
            case 'primary':
            case 'blue':
                return 'bg-white text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 hover:border-blue-300 border-gray-300';
            default:
                return 'btn-outline-secondary bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300';
        }
    }
};

const getIconColorClass = (option: ButtonGroupOption, isSelected: boolean) => {
    if (isSelected) {
        return option.selectedIconColor || 'text-white';
    }

    if (option.iconColor) {
        return option.iconColor;
    }

    switch (option.color) {
        case 'success':
        case 'emerald':
        case 'green':
            return 'text-emerald-600';
        case 'danger':
        case 'rose':
        case 'red':
            return 'text-rose-600';
        case 'warning':
        case 'amber':
        case 'yellow':
            return 'text-amber-600';
        case 'info':
        case 'cyan':
            return 'text-cyan-600';
        case 'primary':
        case 'blue':
            return 'text-blue-600';
        default:
            return 'text-gray-500';
    }
};

const ButtonGroupSelection: React.FC<ButtonGroupSelectionProps> = ({
    options,
    value,
    onChange,
    error,
    errorMessage,
    className = '',
    size = 'md'
}) => {
    const sizeClass = size === 'sm' ? 'py-1 px-2 text-xs' : size === 'lg' ? 'py-2.5 px-4 text-base' : 'py-1.5 px-3 text-sm';

    return (
        <div className={`flex flex-col ${className}`}>
            <div className={`flex flex-row space-x-2 ${error ? 'border !border-red-500 rounded p-1' : ''}`}>
                {options.map((option) => {
                    const isSelected = String(value) === String(option.value);
                    const colorClasses = getOptionColorClasses(option, isSelected);
                    const iconColorClass = getIconColorClass(option, isSelected);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`btn flex items-center justify-center flex-1 transition-colors duration-200 ${sizeClass} ${colorClasses} ${option.className || ''}`}
                        >
                            {option.icon && (
                                <span className={`mr-1.5 flex items-center ${iconColorClass}`}>
                                    {option.icon}
                                </span>
                            )}
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
            {error && errorMessage && (
                <ErrorMessage message={errorMessage} className="mt-1" />
            )}
        </div>
    );
};

export default ButtonGroupSelection;
