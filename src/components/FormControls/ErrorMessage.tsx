import React from 'react'

interface ErrorMessageProps {
    message: string;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
    return (
        <p className={["text-xs text-red-500 flex items-center gap-1", className].join(' ')}>
            <i className="fas fa-info-circle"></i>
            {message}
        </p>
    )
}

export default ErrorMessage