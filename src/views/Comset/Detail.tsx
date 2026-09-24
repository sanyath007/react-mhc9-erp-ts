import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { getComset } from '../../features/slices/comset/comsetSlice';
import Loading from '../../components/ui/Loading'

const ComsetDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { comset, isLoading } = useSelector((state: any) => state.comset);

    useEffect(() => {
        if (id) {
            dispatch(getComset(id));
        }
    }, [id]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/comset' }}>ชุดคอมพิวเตอร์</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดชุดคอมพิวเตอร์</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl">รายละเอียดชุดคอมพิวเตอร์ (#{id})</h2>

                {isLoading && (
                    <div className="text-center"><Loading /></div>
                )}

                {(!isLoading && comset) && (
                    <div className="my-2 border p-4 rounded-md">
                        <Row className="mb-4">
                            <Col md={4} className="mb-2">
                                <label htmlFor="">ครุภัณฑ์</label>
                                <div className="text-sm font-thin">
                                    {comset.asset?.asset_no}
                                </div>
                            </Col>
                            <Col md={8} className="mb-2">
                                <label htmlFor="">รายละเอียดครุภัณฑ์</label>
                                <div className="text-sm font-thin">
                                    {comset.asset?.name}
                                    <span className="ml-1">ยี่ห้อ {comset.asset?.brand?.name}</span>
                                    <span className="ml-1">รุ่น {comset.asset?.model ? comset.asset?.model : '-'}</span>
                                </div>
                            </Col>
                            <Col md={4} className="mb-2">
                                <label htmlFor="">ชื่อชุดคอมพิวเตอร์</label>
                                <div className="text-sm font-thin">
                                    {comset.name}
                                </div>
                            </Col>
                            <Col md={8} className="mb-2">
                                <label htmlFor="">รายละเอียด</label>
                                <div className="text-sm font-thin">
                                    {comset.description ? comset.description : '-'}
                                </div>
                            </Col>
                            <Col md={12} className="mb-2">
                                <label htmlFor="">หมายเหตุ</label>
                                <div className="text-sm">
                                    {comset.remark ? comset.remark : '-'}
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-row items-center justify-between mb-2">
                                    <h4 className="text-lg font-bold">อุปกรณ์ภายใน</h4>
                                </div>

                                <table className="table table-bordered text-sm">
                                    <thead>
                                        <tr>
                                            <th className="w-[5%] text-center">#</th>
                                            <th className="w-[20%] text-center">ประเภทอุปกรณ์</th>
                                            <th>รายละเอียด</th>
                                            <th className="w-[8%] text-center">ราคา</th>
                                            <th className="w-[12%] text-center">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comset.equipments.map((equipment, index) => (
                                            <tr key={equipment.id} className="font-thin">
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{equipment.type?.name}</td>
                                                <td>
                                                    <span>{equipment.brand?.name}</span>
                                                    <span className="mx-1">{equipment.model}</span>
                                                    <span>{equipment.capacity}</span>
                                                </td>
                                                <td className="text-center">{equipment.price}</td>
                                                <td className="text-center">
                                                    {equipment.status === 1 && <span className="badge rounded-pill text-bg-secondary ml-1">มาพร้อมเครื่อง</span>}
                                                    {equipment.status === 2 && <span className="badge rounded-pill text-bg-primary ml-1">ติดตั้งเพิ่ม</span>}
                                                    {equipment.status === 3 && <span className="badge rounded-pill text-bg-danger ml-1">เปลี่ยนอะไหล่</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="flex flex-row items-center justify-between mb-2">
                                    <h4 className="text-lg font-bold">อุปกรณ์ต่อพ่วง</h4>
                                </div>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="w-[5%] text-center">#</th>
                                            <th className="w-[20%] text-center">ประเภทอุปกรณ์</th>
                                            <th>รายละเอียด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComsetDetail
