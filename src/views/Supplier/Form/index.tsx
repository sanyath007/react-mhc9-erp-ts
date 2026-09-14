import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Col, Row } from 'react-bootstrap'
import { store } from '../../../features/slices/supplier/supplierSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/supplier/supplierApi'
import Loading from '../../../components/ui/Loading'

const supplierSchema = Yup.object().shape({

});

const initialFormData = {
    changwats: [],
    amphurs: [],
    tambons: [],
    bank: []
};

const SupplierForm = () => {
    const dispatch = useDispatch<any>();
    const [filteredAmphurs, setFilteredAmphurs] = useState([]);
    const [filteredTambons, setFilteredTambons] = useState([]);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();

    const handleSubmit = (values, formik) => {
        dispatch(store(values));

        formik.resetForm();
    };

    const handleChangwatSelect = (id) => {
        setFilteredAmphurs(formData.amphurs.filter(amp => amp.chw_id === id));
    };

    const handleAmphurSelect = (id) => {
        setFilteredTambons(formData.tambons.filter(tam => tam.amp_id === id));
    };

    return (
        <Formik
            initialValues={{
                tax_no: '',
                name: '',
                address: '',
                moo: '',
                road: '',
                tambon_id: '',
                amphur_id: '',
                changwat_id: '',
                zipcode: '',
                tel: '',
                fax: '',
                email: '',
                seller_name: '',
                seller_tel: '',
                seller_email: '',
                manager_name: '',
                owner_name: '',
                bank_id: '',
                bank_acc_no: '',
                bank_acc_name: '',
                bank_acc_branch: '',
                tax_type_id: '',
                remark: '',
            }}
            validationSchema={supplierSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <Form>
                    <Row className="mb-2">
                        <Col>
                            <label>ชื่อผู้จัดจำหน่าย</label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <label>ที่อยู่เลขที่</label>
                            <input
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={2}>
                            <label>หมู่</label>
                            <input
                                type="text"
                                name="moo"
                                value={formik.values.moo}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={4}>
                            <label>ถนน</label>
                            <input
                                type="text"
                                name="road"
                                value={formik.values.road}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={4}>
                            <label>จังหวัด</label>
                            {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                <select
                                    name="changwat_id"
                                    value={formik.values.changwat_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleChangwatSelect(e.target.value);
                                    }}
                                    className="form-control font-thin text-sm"
                                >
                                    <option value="">-- เลือก --</option>\
                                    {formData.changwats?.map(changwat => (
                                        <option value={changwat.id} key={changwat.id}>{changwat.name}</option>
                                    ))}
                                </select>
                            )}
                        </Col>
                        <Col md={4}>
                            <label>อำเภอ</label>
                            {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                <select
                                    name="amphur_id"
                                    value={formik.values.amphur_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleAmphurSelect(e.target.value);
                                    }}
                                    className="form-control font-thin text-sm"
                                >
                                    <option value="">-- เลือก --</option>
                                    {filteredAmphurs.map(amphur => (
                                        <option value={amphur.id} key={amphur.id}>{amphur.name}</option>
                                    ))}
                                </select>
                            )}
                        </Col>
                        <Col md={4}>
                            <label>ตำบล</label>
                            {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                <select
                                    name="tambon_id"
                                    value={formik.values.tambon_id}
                                    onChange={formik.handleChange}
                                    className="form-control font-thin text-sm"
                                >
                                    <option value="">-- เลือก --</option>
                                    {filteredTambons.map(tambon => (
                                        <option value={tambon.id} key={tambon.id}>{tambon.name}</option>
                                    ))}
                                </select>
                            )}
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={4}>
                            <label>รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={formik.values.zipcode}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={4}>
                            <label>โทรศัพท์</label>
                            <input
                                type="text"
                                name="tel"
                                value={formik.values.tel}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={4}>
                            <label>โทรสาร</label>
                            <input
                                type="text"
                                name="fax"
                                value={formik.values.fax}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={4}>
                            <label>อีเมล</label>
                            <input
                                type="text"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={4}>
                            <label>เลขที่ผู้เสียภาษี</label>
                            <input
                                type="text"
                                name="tax_no"
                                value={formik.values.tax_no}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={4}>
                            <label>ประเภทภาษี</label>
                            <select
                                name="tax_type_id"
                                value={formik.values.tax_type_id}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            >
                                <option value="">-- เลือก --</option>
                                <option value="1">ภาษีเงินได้บุคคลธรรมดา</option>
                                <option value="2">ภาษีเงินได้นิติบุคคล</option>
                            </select>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={6}>
                            <label>ชื่อเจ้าของ</label>
                            <input
                                type="text"
                                name="owner_name"
                                value={formik.values.owner_name}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={6}>
                            <label>ชื่อผู้จัดการ</label>
                            <input
                                type="text"
                                name="manager_name"
                                value={formik.values.manager_name}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}>
                            <label>เลขที่บัญชีธนาคาร</label>
                            <input
                                type="text"
                                name="bank_acc_no"
                                value={formik.values.bank_acc_no}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={3}>
                            <label>ชื่อบัญชีธนาคาร</label>
                            <input
                                type="text"
                                name="bank_acc_name"
                                value={formik.values.bank_acc_name}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                        <Col md={2}>
                            <label>ธนาคาร</label>
                            {isLoading ? <div className="form-control text-sm"><Loading /></div> : (
                                <select
                                    name="bank_id"
                                    value={formik.values.bank_id}
                                    onChange={formik.handleChange}
                                    className="form-control font-thin text-sm"
                                >
                                    <option value="">-- เลือก --</option>
                                    {formData.banks?.map(bank => (
                                        <option value={bank.id} key={bank.id}>{bank.name}</option>
                                    ))}
                                </select>
                            )}
                        </Col>
                        <Col md={4}>
                            <label>สาขา (ธนาคาร)</label>
                            <input
                                type="text"
                                name="bank_acc_branch"
                                value={formik.values.bank_acc_branch}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <label>หมายเหตุ</label>
                            <textarea
                                rows={3}
                                name="remark"
                                value={formik.values.remark}
                                onChange={formik.handleChange}
                                className="form-control font-thin text-sm"
                            ></textarea>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <button type="submit" className="btn btn-outline-primary text-sm float-right">
                                บันทึก
                            </button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Formik>
    )
}

export default SupplierForm