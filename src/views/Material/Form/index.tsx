import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormGroup, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import OverWriteMomentBE from '../../../utils/OverwriteMomentBE'
import { store, update } from '../../../features/slices/asset/assetSlice'
import { useGetInitialFormDataQuery } from '../../../features/services/asset/assetApi'
import Loading from '../../../components/ui/Loading'
import UploadImage from './UploadImage'

const materialSchema = Yup.object().shape({
    asset_no: Yup.string().required(),
    name: Yup.string().required(),
    // description: Yup.string().required(),
    asset_category_id: Yup.string().required(),
    unit_id: Yup.string().required(),
    brand_id: Yup.string().required(),
    // budget_id: Yup.string().required(),
});

const MaterialForm = ({ id, asset }: any) => {
    const dispatch = useDispatch<any>();
    const { isLoading } = useSelector((state: any) => state.asset);
    const { data: formData, isLoading: loading } = useGetInitialFormDataQuery();
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [selectedPurchasedAt, setSelectedPurchasedAt] = useState(moment());
    const [selectedDateIn, setSelectedDateIn] = useState(moment());
    const [selectedFirstYear, setSelectedFirstYear] = useState(moment());
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (asset) {
            asset.purchased_at ? setSelectedPurchasedAt(moment(asset.purchased_at)) : setSelectedPurchasedAt(moment());
            asset.date_in ? setSelectedDateIn(moment(asset.date_in)) : setSelectedDateIn(moment());
            asset.first_year && setSelectedFirstYear(moment(`${asset.first_year-543}-01-01`));
        }
    }, [asset]);

    useEffect(() => {
        /** If in editting mode. Set filteredGroups data for display in input */
        if (asset && !loading) setFilteredGroups(formData.groups);
    }, [asset]);

    const handleCategorySelected = (category) => {
        const newGroups = formData.groups.filter(group => group.category_id === parseInt(category, 10));

        setFilteredGroups(newGroups);
    };

    const handleSubmit = (values, props) => {
        if (asset) {
            dispatch(update({ id, data: values }))
        } else {
            const data = new FormData();

            data.append('img_url', selectedImage);

            for(const [key, val] of Object.entries(values)) {
                data.append(key, val as any);
            }

            dispatch(store(data))
        }

        props.resetForm();
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                id: asset ? id : '',
                asset_no: asset ? asset.asset_no : '',
                name: asset ? asset.name : '',
                description: (asset && asset.description) ? asset.description : '',
                asset_type_id: (asset && asset.asset_type_id) ? asset.asset_type_id : '',
                asset_category_id: (asset && asset.asset_category_id) ? asset.asset_category_id : '',
                asset_group_id: (asset && asset.asset_group_id) ? asset.asset_group_id : '',
                price: (asset && asset.price) ? asset.price : '',
                unit_id: asset ? asset.unit_id : '',
                brand_id: asset ? asset.brand_id : '',
                model: (asset && asset.model) ? asset.model : '',
                purchased_at: (asset && asset.purchased_at) ? asset.purchased_at : moment().format('YYYY-MM-DD'),
                date_in: (asset && asset.date_in) ? asset.date_in : moment().format('YYYY-MM-DD'),
                first_year: (asset && asset.first_year) ? asset.first_year : moment().year()+543,
                obtain_type_id: (asset && asset.obtain_type_id) ? asset.obtain_type_id : '',
                budget_id: (asset && asset.budget_id) ? asset.budget_id : '',
                location: asset ? asset.location : '',
                room_id: (asset && asset.room_id) ? asset.room_id : '',
                remark: (asset && asset.remark) ? asset.remark : ''
            }}
            validationSchema={materialSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        {asset && (
                            <Row className="mb-3">
                                <Col>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="rounded-md mt-2 w-[200px] h-[132px] overflow-hidden flex justify-center border mb-2">
                                            {(!selectedImage && asset?.img_url) ? (
                                                <img src={`${process.env.REACT_APP_API_URL}/uploads/assets/${asset?.img_url}`} alt="asset-image" />
                                            ) : (
                                                <img src={``} alt="" />
                                            )}
                                            {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="" />}
                                        </div>
                                        
                                        <UploadImage
                                            asset={asset}
                                            selectedImage={selectedImage}
                                            handleSelectedImage={setSelectedImage}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row className="mb-2">
                            <Col sm={6} md={4}>
                                <FormGroup>
                                    <label>เลขที่พัสดุ</label>
                                    <input
                                        type="text"
                                        name="asset_no"
                                        value={formik.values.asset_no}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                        placeholder="เลขที่พัสดุ"
                                    />
                                    {(formik.errors.asset_no && formik.touched.asset_no) && (
                                        <span className="text-red-500 text-sm">{formik.errors.asset_no as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col sm={6} md={8}>
                                <FormGroup>
                                    <label>ชื่อพัสดุ</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                        placeholder="ชื่อพัสดุ"
                                    />
                                    {(formik.errors.name && formik.touched.name) && (
                                        <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>รายละเอียด</label>
                                    <textarea
                                        rows={3}
                                        name="description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                        placeholder="รายละเอียด"
                                    >
                                    </textarea>
                                    {(formik.errors.description && formik.touched.description) && (
                                        <span className="text-red-500 text-sm">{formik.errors.description as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>ชนิดพัสดุ</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="asset_category_id"
                                            value={formik.values.asset_category_id} 
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                handleCategorySelected(e.target.value);
                                            }}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกชนิดพัสดุ --</option>
                                            {formData.categories && formData.categories.map(category => (
                                                <option value={category.id} key={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {(formik.errors.asset_category_id && formik.touched.asset_category_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.asset_category_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>กลุ่มพัสดุ</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="asset_group_id"
                                            value={formik.values.asset_group_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกกลุ่มพัสดุ --</option>
                                            {filteredGroups && filteredGroups.map(group => (
                                                <option value={group.id} key={group.id}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={4}>
                                <FormGroup>
                                    <label>ราคาต่อหน่วย</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                    />
                                    {(formik.errors.price && formik.touched.price) && (
                                        <span className="text-red-500 text-sm">{formik.errors.price as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <label>หน่วยนับ</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="unit_id"
                                            value={formik.values.unit_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกหน่วยนับ --</option>
                                            {formData.units && formData.units.map(unit => (
                                                <option value={unit.id} key={unit.id}>{unit.name}</option>
                                            ))}
                                        </select>
                                    )}
                                    {(formik.errors.unit_id && formik.touched.unit_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.unit_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label>ประเภทการได้มา</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="obtain_type_id"
                                            value={formik.values.obtain_type_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกประเภทการได้มา --</option>
                                            {formData.obtainingTypes && formData.obtainingTypes.map(ob => (
                                                <option key={ob.id} value={ob.id}>
                                                    {ob.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {(formik.errors.obtain_type_id && formik.touched.obtain_type_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.obtain_type_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label>แหล่งงบประมาณ</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="budget_id"
                                            value={formik.values.budget_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกแหล่งงบประมาณ --</option>
                                            {formData.budgets && formData.budgets.map(budget => (
                                                <option key={budget.id} value={budget.id}>
                                                    {budget.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {(formik.errors.budget_id && formik.touched.budget_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.budget_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={3}>
                                <FormGroup>
                                    <label>ยี่ห้อ/ผู้ผลิต</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="brand_id"
                                            value={formik.values.brand_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกยี่ห้อ/ผู้ผลิต --</option>
                                            {formData.brands && formData.brands.map(brand => (
                                                <option value={brand.id} key={brand.id}>{brand.name}</option>
                                            ))}
                                        </select>
                                    )}
                                    {(formik.errors.brand_id && formik.touched.brand_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.brand_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>รุ่น</label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formik.values.model}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                    />
                                    {(formik.errors.model && formik.touched.model) && (
                                        <span className="text-red-500 text-sm">{formik.errors.model as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <div className="flex flex-col">
                                        <label>วันที่ซื้อ</label>
                                        <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedPurchasedAt}
                                                onChange={(date) => {
                                                    setSelectedPurchasedAt(date);
                                                    formik.setFieldValue('purchased_at', date.format('YYYY-MM-DD'));

                                                    setSelectedDateIn(date);
                                                    formik.setFieldValue('date_in', date.format('YYYY-MM-DD'));

                                                    setSelectedFirstYear(date);
                                                    formik.setFieldValue('first_year', date.year()+543);
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                        {(formik.errors.purchased_at && formik.touched.purchased_at) && (
                                            <span className="text-red-500 text-sm">{formik.errors.purchased_at as string}</span>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <div className="flex flex-col">
                                        <label>ปีที่ซื้อ (พ.ศ. เช่น 25xx)</label>
                                        <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                            <DatePicker
                                                views={["year"]}
                                                format="YYYY"
                                                value={selectedFirstYear}
                                                onChange={(date) => {
                                                    setSelectedFirstYear(date);
                                                    formik.setFieldValue('first_year', date.year()+543);
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                        {(formik.errors.first_year && formik.touched.first_year) && (
                                            <span className="text-red-500 text-sm">{formik.errors.first_year as string}</span>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <div className="flex flex-col">
                                        <label>วันที่นำเข้าระบบ</label>
                                        <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                value={selectedDateIn}
                                                onChange={(date) => {
                                                    setSelectedDateIn(date);
                                                    formik.setFieldValue('date_in', date.format('YYYY-MM-DD'));
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                        {(formik.errors.date_in && formik.touched.date_in) && (
                                            <span className="text-red-500 text-sm">{formik.errors.date_in as string}</span>
                                        )}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormGroup>
                                    <label>สถานที่เก็บ/จุดติดตั้ง</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                    />
                                    {(formik.errors.location && formik.touched.location) && (
                                        <span className="text-red-500 text-sm">{formik.errors.location as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>ห้อง</label>
                                    {loading && <div className="form-control text-sm"><Loading /></div>}
                                    {!loading && (
                                        <select
                                            name="room_id"
                                            value={formik.values.room_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกห้อง --</option>
                                            {formData.rooms && formData.rooms.map(room => (
                                                <option value={room.id} key={room.id}>
                                                    {room.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {(formik.errors.room_id && formik.touched.room_id) && (
                                        <span className="text-red-500 text-sm">{formik.errors.room_id as string}</span>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={asset ? 12 : 6}>
                                <FormGroup>
                                    <label>หมายเหตุ</label>
                                    <textarea
                                        rows={asset ? 3 : 8}
                                        name="remark"
                                        value={formik.values.remark}
                                        onChange={formik.handleChange}
                                        className="form-control text-sm font-thin"
                                    >
                                    </textarea>
                                </FormGroup>
                            </Col>
                            {!asset && (
                                <Col md={6}>
                                    <FormGroup>
                                        <label>รูปพัสดุ</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                            className="form-control text-sm"
                                        />
                                        <div className="border rounded-md mt-2 h-[132px] overflow-hidden flex justify-center">
                                            {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="" />}
                                        </div>
                                    </FormGroup>
                                </Col>
                            )}
                        </Row>
                        <Row>
                            <Col>
                                <button
                                    type="submit"
                                    className={`btn ${asset ? 'btn-outline-warning' : 'btn-outline-primary'} mt-2 float-right`}
                                    disabled={formik.isSubmitting || loading}
                                >
                                    {isLoading && <Loading />}
                                    {asset ? 'บันทึกการแกไข' : 'บันทึก'}
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default MaterialForm
