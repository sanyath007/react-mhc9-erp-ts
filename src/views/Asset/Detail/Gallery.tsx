import React from 'react'
import { Row, Col } from 'react-bootstrap'

const Gallery = ({ asset }) => {
    return (
        <div className="flex flex-col">
            <h3 className="mb-2 font-bold">รูปพัสดุ</h3>
            <div className="border w-full h-[220px] flex justify-center items-center overflow-hidden text-center rounded-md mb-2">
                <img src={`${process.env.REACT_APP_API_URL}/uploads/${asset?.img_url}`} alt="asset-image" className="w-[180px]" />
            </div>
            {/* <Row className="max-md:hidden gx-2">
                {[1,2,3,4].map((image, index) => (
                    <Col key={index} className="text-center mb-2" md={3}>
                        <img src={''} alt={`image ${index+1}`} className="border rounded-md h-[80px]" />
                    </Col>
                ))}
            </Row> */}
        </div>
    )
}

export default Gallery