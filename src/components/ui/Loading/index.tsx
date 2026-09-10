import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading: React.FC = () => {
    return (
        <Spinner animation="border" role="status" size="sm" className="mr-[2px]">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}

export default Loading
