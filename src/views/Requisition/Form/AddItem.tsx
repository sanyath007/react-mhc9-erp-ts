import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FormGroup } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { v4 as uuid } from 'uuid'
import { calculateTotal, getFormDataItem } from '../../../utils'
import { useGetInitialFormDataQuery } from '../../../features/services/item/itemApi'
import ModalItemList from '../../../components/Modals/ItemList'

const itemSchema = Yup.object().shape({
    item_id: Yup.string().required('กรุณาเลือกรายสินค้า/บริการ'),
    price: Yup.number().min(1, 'ราคาต่อหน่วยต้องมากกว่า 0').required('กรุณาระบุราคาต่อหน่วย'),
    unit_id: Yup.string().required('กรุณาเลือกหน่วยนับ'),
    amount: Yup.string().required('กรุณาระบุจำนวน'),
    total: Yup.string().required('กรุณาระบุรวมเป็นเงิน'),
});

const initialFormData = {
    units: [],
    categories: [],
};

const AddItem = ({ item, defaultCategory, onAddItem, onUpdateItem, onCancel }: any) => {
    const [data, setData] = useState(null);
    const [showModalItems, setShowModalItems] = useState(false);
    const { data: formData = initialFormData } = useGetInitialFormDataQuery();

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const handleClear = (formik) => {
        formik.resetForm();
        setData(null);
        onCancel();
    };

    const handleSelect = (formik, item) => {
        if (!data || data.id === '') formik.setFieldValue('id', uuid());

        formik.setFieldValue('item_id', item?.id);
        formik.setFieldValue('item', item);
        formik.setFieldValue('price', '');
        formik.setFieldValue('unit_id', item?.unit_id);
        formik.setFieldValue('unit', item?.unit);
        formik.setFieldValue('amount', 1);

        setTimeout(() => formik.setFieldTouched('item_id', true), 300);

        handleCalculateTotal(formik, item?.price, 1);
    };

    const handleCalculateTotal = (formik, price, amount) => {
        formik.setFieldValue('total', calculateTotal(price, amount).toFixed(2));
        formik.setFieldTouched('total', true);
    };

    const handleSubmit = (values, formik) => {
        if (item) {
            onUpdateItem(values.id, { ...values })
        } else {
            onAddItem({ ...values });
        }

        formik.resetForm();
        setData(null);
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                ...data,
                id: data ? data.id : '',
                item_id: data ? data.item_id : '',
                item: data ? data.item : null,
                description: data? data.description : '',
                price: data ? data.price : '',
                unit_id: data ? data.unit_id : '',
                unit: data ? data.unit : null,
                amount: data ? data.amount : '',
                total: data ? data.total : '',
            }}
            validationSchema={itemSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                return (
                    <>
                        <ModalItemList
                            isShow={showModalItems}
                            onHide={() => setShowModalItems(false)}
                            onSelect={(item) => handleSelect(formik, item)}
                            defaultCategory={defaultCategory}
                        />

                        <div className="flex flex-row gap-1 mb-2">
                            <FormGroup className="w-[45%]">
                                <div className="input-group">
                                    <div className="form-control min-h-[34px] text-sm overflow-hidden whitespace-nowrap text-ellipsis bg-gray-100">
                                        {formik.values.item ? formik.values.item.name : <span className="text-gray-400">รายการสินค้า/บริการ</span>}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowModalItems(true)}
                                        disabled={item}
                                    >
                                        <FaSearch />
                                    </button>
                                </div>
                                {(formik.errors.item_id && formik.touched.item_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.item_id as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[10%]">
                                <input
                                    type="text"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleCalculateTotal(formik, e.target.value, formik.values.amount);
                                    }}
                                    className="form-control text-sm text-right"
                                    placeholder="ราคาต่อหน่วย"
                                />
                                {(formik.errors.price && formik.touched.price) && (
                                    <span className="text-red-500 text-xs">{formik.errors.price as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[8%]">
                                <input
                                    type="text"
                                    name="amount"
                                    value={formik.values.amount}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleCalculateTotal(formik, formik.values.price, e.target.value);
                                    }}
                                    className="form-control text-sm text-center"
                                    placeholder="จำนวน"
                                />
                                {(formik.errors.amount && formik.touched.amount) && (
                                    <span className="text-red-500 text-xs">{formik.errors.amount as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[10%]">
                                <select
                                    name="unit_id"
                                    value={formik.values.unit_id}
                                    onChange={(e) => {
                                        formik.handleChange(e);

                                        formik.setFieldValue('unit', getFormDataItem(formData, 'units', parseInt(e.target.value, 10)));
                                    }}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- หน่วยนับ --</option>
                                    {formData.units && formData.units.map(unit => (
                                        <option value={unit.id} key={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                                {(formik.errors.unit_id && formik.touched.unit_id) && (
                                    <span className="text-red-500 text-xs">{formik.errors.unit_id as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup className="w-[15%]">
                                <input
                                    type="text"
                                    name="total"
                                    value={formik.values.total}
                                    onChange={formik.handleChange}
                                    className="form-control text-sm text-right"
                                    placeholder="รวมเป็นเงิน"
                                />
                                {(formik.errors.total && formik.touched.total) && (
                                    <span className="text-red-500 text-xs">{formik.errors.total as string}</span>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <button
                                    type="button"
                                    className={`btn ${data ? 'btn-outline-secondary px-1' : 'btn-outline-primary'} text-sm`}
                                    onClick={formik.submitForm}
                                >
                                    {/* <FaPlus /> */}
                                    {data ? 'อัพเดต' : 'เพิ่ม'}
                                </button>
                            </FormGroup>
                            <FormGroup className="w-[6%]">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger text-sm px-1"
                                    onClick={() => handleClear(formik)}
                                >
                                    {/* <FaTimes /> */}
                                    {data ? 'ยกเลิก' : 'เคลียร์'}
                                </button>
                            </FormGroup>
                        </div>
                    </>
                )
            }}
        </Formik>
    )
}

export default AddItem
