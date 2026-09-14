import React, { useEffect, useState } from 'react'

const ReceiveButton = ({ id, isReceived, onReceive }: any) => {
    const [received, setReceived] = useState(false);

    useEffect(() => {
        if (isReceived) {
            setReceived(isReceived);
        }
    }, [isReceived]);

    const handleClick = () => {
        setReceived(!received);
        onReceive(id, !received);
    };

    return (
        <button
            type="button"
            className={`btn ${received ? 'btn-outline-success' : 'btn-outline-danger'} btn-sm`}
            onClick={handleClick}
        >
            {received ? 'รับแล้ว' : 'รับ'}
        </button>
    )
}

export default ReceiveButton
