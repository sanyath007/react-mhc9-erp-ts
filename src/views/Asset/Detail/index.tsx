import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, Col, FormGroup, Row } from 'react-bootstrap'
import { FaInfoCircle } from 'react-icons/fa';
import { getAsset } from '../../../features/slices/asset/assetSlice';
import OwnershipList from './Ownership/List';
import OwnershipForm from './Ownership/Form';
import Gallery from './Gallery';
import Loading from '../../../components/ui/Loading';
import AssetHistories from './Histories';

const AssetDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { asset, isLoading } = useSelector((state: any) => state.asset);
    const { success } = useSelector((state: any) => state.ownership);
    const [openOwnershipForm, setOpenOwnershipForm] = useState(false);

    useEffect(() => {
        if (id) dispatch(getAsset({ id }));
    }, [id])

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/asset' }}>รายการพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดพัสดุ</Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="content-heading mb-2">
                    <h2 className="flex flex-row items-center gap-1 text-xl">
                        <FaInfoCircle className="text-info" />
                        <span>รายละเอียดพัสดุ : {id}</span>
                    </h2>
                </div>

                <div className="my-2 border p-4 rounded-md">
                    {isLoading && <div className="text-center"><Loading /></div>}
                    {!isLoading && asset && (
                        <>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Gallery asset={asset} />
                                </Col>
                                <Col>
                                    <Row className="mb-2">
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>หมายเลขพัสดุ</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.asset_no}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>เลข FSN</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.fsn_no}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={12} className="mb-2">
                                            <FormGroup>
                                                <label>ชื่อพัสดุ</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.name}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>ชนิดพัสดุ</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.group?.category?.name}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>กลุ่มพัสดุ</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.group?.name}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>ยี่ห้อ</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.brand?.name}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>รุ่น</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.model}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>ราคา</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.price_per_unit}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>หน่วยนับ</label>
                                                <div className="form-control min-h-[34px] text-sm font-thin">
                                                    {asset.unit?.name}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>สถานที่เก็บ/จุดติดตั้ง</label>
                                                <div className="form-control text-sm font-thin min-h-[34px]">
                                                    {asset.location}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>ห้อง</label>
                                                <div className="form-control text-sm font-thin min-h-[34px]">
                                                    {asset.room?.name}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>รายละเอียด</label>
                                                <div className="form-control text-sm font-thin min-h-[80px]">
                                                    {asset.description}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FormGroup>
                                                <label>หมายเหตุ</label>
                                                <div className="form-control text-sm font-thin min-h-[80px]">
                                                    {asset.remark}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="flex flex-row items-end justify-between mb-2">
                                        <h3 className="font-bold">ผู้รับผิดชอบ</h3>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary text-sm"
                                            onClick={() => setOpenOwnershipForm(true)}
                                            disabled={success}
                                        >
                                            เพิ่มผู้รับผิดชอบ
                                        </button>
                                    </div>
                                    <OwnershipList
                                        assetId={id ? id : ''}
                                        isUpdated={success}
                                    />

                                    <OwnershipForm
                                        isOpen={openOwnershipForm}
                                        handleHide={() => setOpenOwnershipForm(false)}
                                        assetId={id}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="flex flex-row items-end justify-between mb-2">
                                        <h3 className="font-bold">ประวัติการซ่อมบำรุง</h3>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary text-sm"
                                            onClick={() => setOpenOwnershipForm(true)}
                                            disabled={success}
                                        >
                                            เพิ่มประวัติ
                                        </button>
                                    </div>

                                    <AssetHistories asset={asset} />
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AssetDetail
