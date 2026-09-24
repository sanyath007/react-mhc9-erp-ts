import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Col, FormGroup, Row } from 'react-bootstrap'
// import Dropzone from 'react-dropzone'
import { useGetInitialFormDataQuery } from '../../../features/services/item/itemApi'
import { store, update, upload } from '../../../features/slices/item/itemSlice'

const itemSchema = Yup.object().shape({
    name: Yup.string().required(),
    category_id: Yup.string().required(),
    price: Yup.number().required(),
    unit_id: Yup.string().required(),
});

const ItemForm = ({ item }: any) => {
    const dispatch = useDispatch<any>();
    const { data: formData } = useGetInitialFormDataQuery();
    const [selectedImg, setSelectedImg] = useState(null);

    // const handleDropFiles = (acceptedFiles) => {
    //     console.log(acceptedFiles);
    // }

    const handleSubmit = (values, props) => {
        if (item) {
            dispatch(update({ id: item.id, data: values }));
        } else {
            let data = new FormData();
    
            data.append('img_url', selectedImg);
    
            for(const [key, val] of Object.entries(values)) {
                data.append(key, val as any);
            }

            dispatch(store(data));
        }

        props.resetForm();
        setSelectedImg(null);
    };

    const handleUploadImage = (id) => {
        let data = new FormData();

        data.append('img_url', selectedImg);
        dispatch(upload({ id, data }));
        setSelectedImg(null);
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: item ? item.name : '',
                category_id: (item && item.category_id) ? item.category_id : '',
                cost: item ? item.cost : 0,
                price: item ? item.price : 0,
                unit_id: (item && item.unit_id) ? item.unit_id : '',
                description: (item && item.description) ? item.description : '',
            }}
            validationSchema={itemSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <Form>
                        <div className="row">
                            <div className="col-3">
                                <Row>
                                    <Col>
                                    <FormGroup>
                                        <label>รูปภาพ</label>
                                        <div className="flex justify-center items-center border rounded-md overflow-hidden p-0 mt-1 min-h-[270px]">
                                            {selectedImg
                                                ? <img src={URL.createObjectURL(selectedImg)} alt='item-pic' />
                                                : item && <img src={`${process.env.REACT_APP_API_URL}/uploads/${item?.img_url}`} alt='item-pic' />
                                            }
                                        </div>
                                        <div className="mt-2 text-center">
                                            {(selectedImg && item) && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm mr-1"
                                                    onClick={() => handleUploadImage(item.id)}
                                                >
                                                    อัพโหลดรูป
                                                </button>
                                            )}
                                            <label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => setSelectedImg(e.target.files[0])}
                                                    className="ml-2 text-sm font-thin hidden"
                                                />
                                                {!selectedImg && (
                                                    <p className={`btn ${item ? 'btn-secondary' : 'btn-primary'} btn-sm`}>
                                                        {item ? 'เปลี่ยนรูป' : 'เพิ่มรูป'}
                                                    </p>
                                                )}
                                            </label>
                                            {selectedImg && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm mr-1"
                                                    onClick={() => setSelectedImg(null)}
                                                >
                                                    ยกเลิก
                                                </button>
                                            )}
                                        </div>
                                        {(formik.errors.img_url && formik.touched.img_url) && (
                                            <span className="text-red-500 text-sm">{formik.errors.img_url as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                                </Row>
                            </div>
                            <div className="col-8">
                                <Row className="mb-2">
                                    <Col md={8}>
                                        <FormGroup>
                                            <label>ชื่อสินค้า/บริการ</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm font-thin"
                                            />
                                            {(formik.errors.name && formik.touched.name) && (
                                                <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <label>ประเทภสินค้า/บริการ</label>
                                            <select
                                                name="category_id"
                                                value={formik.values.category_id}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm font-thin"
                                            >
                                                <option value="">-- ประเทภสินค้า/บริการ --</option>
                                                {formData && formData.types.map(type => (
                                                    <optgroup key={type.id} label={type.name}>
                                                        {type.categories.map(category => (
                                                            <option value={category.id} key={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            {(formik.errors.category_id && formik.touched.category_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.category_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <FormGroup>
                                            <label>ราคาทุน</label>
                                            <input
                                                type="text"
                                                name="cost"
                                                value={formik.values.cost}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm font-thin"
                                            />
                                            {(formik.errors.cost && formik.touched.cost) && (
                                                <span className="text-red-500 text-sm">{formik.errors.cost as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label>ราคาขาย</label>
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
                                    <Col>
                                        <FormGroup>
                                            <label>หน่วยนับ</label>
                                            <select
                                                name="unit_id"
                                                value={formik.values.unit_id}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm font-thin"
                                            >
                                                <option value="">-- หน่วยนับ --</option>
                                                {formData && formData.units.map(unit => (
                                                    <option value={unit.id} key={unit.id}>
                                                        {unit.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {(formik.errors.unit_id && formik.touched.unit_id) && (
                                                <span className="text-red-500 text-sm">{formik.errors.unit_id as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <FormGroup>
                                            <label>รายละเอียด</label>
                                            <textarea
                                                rows={5}
                                                name="description"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                className="form-control text-sm font-thin"
                                            ></textarea>
                                            {(formik.errors.description && formik.touched.description) && (
                                                <span className="text-red-500 text-sm">{formik.errors.description as string}</span>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        {/* <div>
                                            <Dropzone onDrop={handleDropFiles}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <div { ...getRootProps() } className="border h-[200px] flex justify-center items-center">
                                                        <input { ...getInputProps() } />
                                                        Click me to upload a file!
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </div> */}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <button
                                                type="submit"
                                                className={`btn ${item ? 'border-orange-300 hover:bg-orange-300 hover:text-white' : 'btn-outline-primary'} btn-sm float-right`}
                                            >
                                                {item ? 'บันทึกการแก่ไข' : 'บันทึก'}
                                            </button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ItemForm
