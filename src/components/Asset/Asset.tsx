import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { currency } from '../../utils'

const Asset = ({ asset }: any) => {
    return (
        <Row>
            <Col lg={12} xl={2}>
                <div className="w-[100px] h-[100px] overflow-hidden border">
                    {(asset && asset.img_url) ? (
                        <img src={`${process.env.REACT_APP_API_URL}/uploads/${asset.img_url}`} alt='asset-pic' />
                    ) : (
                        <img src="./img/default-product.jpg" alt="employee-pic" className="asset-pic" />
                    )}
                </div>
            </Col>
            <Col lg={12} xl={10} className="font-thin text-sm max-[1199px]:mt-2">
                <p className="text-gray-800">{asset.group?.category?.name}</p>
                <p>
                    <b className="mr-1">เลข FSN:</b>{asset.fsn_no ? asset.fsn_no : '-'}
                    <b className="ml-4 mr-1">เลขครุภัณฑ์:</b>{asset.asset_no ? asset.asset_no : '-'}
                </p>
                <p>
                    <span className="font-bold">{asset.name}</span>
                    <span className="mx-2"><b>ยี่ห้อ:</b> {asset.brand?.name}</span>
                    <span className="mr-1"><b>รุ่น:</b> {asset.model ? asset.model : '-'}</span>
                </p>
                <p>
                    <span className="mr-1"><b>ซื้อเมื่อปี:</b> {asset.first_year ? asset.first_year : '-'}</span>
                    <span className="mr-1"><b>ราคา:</b> {asset.price ? currency.format(asset.price) : '-'} บาท</span>
                </p>
                {/* <p className="text-sm font-thin text-gray-500 ml-1">{asset.description}</p> */}
                <p className="text-sm font-thin text-red-400">
                    <span className="font-bold">หมายเหตุ:</span> {asset.remark ? asset.remark : '-'}
                </p>
            </Col>
        </Row>
    )
}

export default Asset