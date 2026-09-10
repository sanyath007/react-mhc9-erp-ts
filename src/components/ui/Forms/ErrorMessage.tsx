import { FaExclamationCircle } from 'react-icons/fa'

const ErrorMessage = ({ message, className }: { message: string, className?: string }) => {
    return (
        <p className={`text-xs text-rose-500 flex items-center gap-1 ${className}`}>
            <FaExclamationCircle size={12} />
            {message}
        </p>
    )
}

export default ErrorMessage