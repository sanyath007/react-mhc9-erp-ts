import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Col, FormGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa'
import { currency } from '../../../utils'
import { store, update } from '../../../features/slices/comset/comsetSlice';
import Loading from '../../../components/ui/Loading'
import ModalAssetList from '../../../components/Modals/AssetList';
import ModalEquipmentForm from '../../../components/Modals/Equipment/Form'
import ModalLicenseForm from '../../../components/Modals/License/Form'

const comsetSchema = Yup.object().shape({
    asset_id: Yup.string().required(),
    name: Yup.string().required(),
});

const ComsetForm = ({ comset }: any) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: any) => state.comset);
    const [asset, setAsset] = useState(null);
    const [showAssetList, setShowAssetList] = useState(false);
    const [showEquipmentForm, setShowEquipmentForm] = useState(false);
    const [showLicenseForm, setShowLicenseForm] = useState(false);
    const [edittingEquipment, setEdittingEquipment] = useState(null);
    const [edittingLicense, setEdittingLicense] = useState(null);

    useEffect(() => {
        if (comset) {
            setAsset(comset.asset)
        }
    }, [comset]);

    const handleAssetSelected = (formik, asset) => {
        setAsset(asset);
        formik.setFieldValue('asset_id', asset.id);
    };

    const handleSubmitEquipmentForm = (formik, equipment) => {
        if (equipment.comset_id) {
            const updated = formik.values.equipments.map(eq => {
                if (eq.id === equipment.id) {
                    return {
                        ...equipment,
                        updated: true
                    }
                }

                return eq;
            });

            console.log(updated);
            setEdittingEquipment(null);
            formik.setFieldValue('equipments', updated);
        } else {
            formik.setFieldValue('equipments', [...formik.values.equipments, equipment]);
        }
    };

    const handleSubmitLicenseForm = (formik, license) => {
        if (license.comset_id) {
            const updated = formik.values.licenses.map(eq => {
                if (eq.id === license.id) {
                    return {
                        ...license,
                        updated: true
                    }
                }

                return eq;
            });

            console.log(updated);
            setEdittingLicense(null);
            formik.setFieldValue('licenses', updated);
        } else {
            formik.setFieldValue('licenses', [...formik.values.licenses, license]);
        }
    };

    const handleSubmit = (values, props) => {
        if (comset) {
            dispatch(update({ id: comset.id, data: values }));
        } else {
            dispatch(store(values));
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: comset ? comset.name : '',
                description: (comset && comset.description) ? comset.description : '',
                asset_id: comset ? comset.asset_id : '',
                remark: (comset && comset.remark) ? comset.remark : '',
                equipments: (comset && comset.equipments) ? comset.equipments : [],
                assets: (comset && comset.assets) ? comset.assets : [],
                licenses: (comset && comset.licenses) ? comset.licenses : [],
            }}
            validationSchema={comsetSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <ModalAssetList
                            isShow={showAssetList}
                            onHide={() => setShowAssetList(false)}
                            onSelect={(asset) => handleAssetSelected(formik, asset)}
                        />

                        <ModalEquipmentForm
                            isShow={showEquipmentForm}
                            onHide={() => setShowEquipmentForm(false)}
                            onSubmit={(equipment) => handleSubmitEquipmentForm(formik, equipment)}
                            data={edittingEquipment}
                        />

                        <ModalLicenseForm
                            isShow={showLicenseForm}
                            onHide={() => setShowLicenseForm(false)}
                            onSubmit={(license) => handleSubmitLicenseForm(formik, license)}
                            data={edittingLicense}
                        />

                        <Row className="mb-2">
                            <Col md={4}>
                                <FormGroup>
                                    <label>หมายเลขครุภัณฑ์/เลข FSN</label>
                                    <div className="input-group has-validation">
                                        <div className="form-control text-sm text-center bg-gray-100 min-h-[34px]">
                                            {asset?.asset_no ? asset?.asset_no : asset?.fsn_no}
                                        </div>
                                        <input
                                            type="hidden"
                                            name="asset_id"
                                            value={formik.values.asset_id}
                                            onChange={formik.handleChange}
                                        />
                                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowAssetList(true)}>ค้นหา</button>
                                    </div>
                                    {(formik.errors.asset_id && formik.touched.asset_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.asset_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={8}>
                                <FormGroup>
                                    <label>รายละเอียดครุภัณฑ์</label>
                                    <div className="form-control text-sm bg-gray-100 min-h-[34px]">
                                        {asset?.name}
                                        <span className="ml-1">ยี่ห้อ {asset?.brand?.name}</span>
                                        <span className="ml-1">รุ่น {asset?.model ? asset?.model : '-'}</span>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={4}>
                                <FormGroup>
                                    <label>ชื่อชุดคอมพิวเตอร์</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    />
                                    {(formik.errors.name && formik.touched.name) && (
                                        <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>รายละเอียด</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm"
                                    >
                                    </input>
                                    {(formik.errors.description && formik.touched.description) && (
                                        <span className="text-red-500 text-sm">{formik.errors.description as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                <FormGroup>
                                    <label>หมายเหตุ</label>
                                    <textarea
                                        rows={3}
                                        name="remark"
                                        value={formik.values.remark}
                                        onChange={formik.handleChange}
                                        className="form-control"
                                    >
                                    </textarea>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-row items-center justify-between mb-2">
                                    <h4 className="text-lg font-bold">อุปกรณ์ภายใน</h4>

                                    <div className="flex flex-row">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={() => setShowEquipmentForm(true)}
                                        >
                                            เพิ่มอุปกรณ์
                                        </button>
                                    </div>
                                </div>

                                <table className="table table-bordered text-sm">
                                    <thead>
                                        <tr>
                                            <th className="w-[5%] text-center">#</th>
                                            <th>รายละเอียด</th>
                                            <th className="w-[20%] text-center">ประเภทอุปกรณ์</th>
                                            <th className="w-[10%] text-center">ราคา</th>
                                            <th className="w-[10%] text-center">สถานะ</th>
                                            <th className="w-[8%] text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formik.values.equipments.map((equipment, index) => (
                                            <tr key={equipment.id}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>
                                                    <span>{equipment.brand?.name}</span>
                                                    <span className="mx-1">{equipment.model}</span>
                                                    <span>{equipment.capacity}</span>
                                                </td>
                                                <td className="text-center">{equipment.type?.name}</td>
                                                <td className="text-center">{currency.format(equipment.price)}</td>
                                                <td className="text-center">
                                                    {equipment.status === 1 && <span className="badge rounded-pill text-bg-secondary">มาพร้อมเครื่อง</span>}
                                                    {equipment.status === 2 && <span className="badge rounded-pill text-bg-primary">ติดตั้งเพิ่ม</span>}
                                                    {equipment.status === 3 && <span className="badge rounded-pill text-bg-danger">เปลี่ยนอะไหล่</span>}
                                                </td>
                                                <td className="text-center">
                                                    <a
                                                        href="#"
                                                        className="btn btn-sm btn-warning px-1 mr-1"
                                                        onClick={() => {
                                                            setEdittingEquipment(equipment);
                                                            setShowEquipmentForm(true);
                                                        }}
                                                    >
                                                        <FaPencilAlt />
                                                    </a>
                                                    <a href="#" className="btn btn-sm btn-danger px-1">
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <div className="flex flex-row items-center justify-between mb-2">
                                    <h4 className="text-lg font-bold">ไลเซนส์</h4>

                                    <div className="flex flex-row">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={() => setShowLicenseForm(true)}
                                        >
                                            เพิ่มไลเซนส์
                                        </button>
                                    </div>
                                </div>

                                <table className="table table-bordered text-sm mb-1">
                                    <thead>
                                        <tr>
                                            <th className="w-[5%] text-center">#</th>
                                            <th>รายละเอียด</th>
                                            <th className="w-[20%] text-center">ไลเซนส์</th>
                                            <th className="w-[10%] text-center">ราคา</th>
                                            <th className="w-[10%] text-center">สถานะ</th>
                                            <th className="w-[8%] text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formik.values.licenses.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center">
                                                    <span className="text-red-600 text-sm">-- ไม่มีรายการ --</span>
                                                </td>
                                            </tr>
                                        )}
                                        {formik.values.licenses.length > 0 && formik.values.licenses.map((license, index) => (
                                            <tr>
                                                <td className="text-center">{index + 1}</td>
                                                <td>{license.description}</td>
                                                <td className="text-center">{license.license_no}</td>
                                                <td className="text-center">{currency.format(license.price)}</td>
                                                <td className="text-center">
                                                    {license.status === 1 && <span className="badge rounded-pill bg-success">ใช้งานอยู่</span>}
                                                    {license.status === 2 && <span className="badge rounded-pill bg-secondary">หมดอายุ</span>}
                                                </td>
                                                <td className="text-center">
                                                    <a
                                                        href="#"
                                                        className="btn btn-sm btn-warning px-1 mr-1"
                                                        onClick={() => {
                                                            setEdittingLicense(license);
                                                            setShowLicenseForm(true);
                                                        }}
                                                    >
                                                        <FaPencilAlt />
                                                    </a>
                                                    <a href="#" className="btn btn-sm btn-danger px-1">
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button
                                    type="submit"
                                    className={`btn ${comset ? 'btn-outline-secondary' : 'btn-outline-primary'} float-right`}
                                    disabled={formik.isSubmitting}
                                >
                                    {comset ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ComsetForm
