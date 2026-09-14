import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalPreviewImage = ({ isShow, onHide, title, url, alt }: any) => {
    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="border flex justify-center">
                    <img src={url} alt={alt || title} />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalPreviewImage
