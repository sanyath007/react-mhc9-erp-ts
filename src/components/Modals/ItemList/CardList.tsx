import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { currency } from '../../../utils'
import ItemDesc from './ItemDesc'

const CardList = ({ items, onHide, onSelect }: any) => {
    return (
        <Row className="mb-0">
            {items && items.map((item, index) => (
                <Col md={6} lg={4} xl={3} className="my-0" key={item.id}>
                    <Card className="mb-1">
                        {![3,4].includes(item?.category?.asset_type_id) && (
                            <Card.Img
                                src={`${process.env.REACT_APP_API_URL}/uploads/${item?.img_url}`}
                                className="w-[120px] h-auto self-center"
                            />
                        )}
                        <Card.Body>
                            <p className="text-gray-500 text-xs">{item.category?.name}</p>
                            <p className="text-xs min-h-[50px]">{item.name}</p>
                            <ItemDesc item={item} />
                            <p className="font-bold text-lg my-1">
                                ราคา <span className="text-red-500">{currency.format(item.price)}</span> บาท
                            </p>
                            <button
                                className="btn btn-primary btn-sm w-full float-right"
                                onClick={() => {
                                    onHide();
                                    onSelect(item);
                                }}
                            >
                                เลือก
                            </button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

export default CardList
