import React, { useState } from 'react'
import { useFormikContext } from 'formik';
import { FaSearch } from 'react-icons/fa'
import ModalSupplierList from '../../Modals/Supplier'

const SupplierSelection = ({ fieldName }: any) => {
    const { setFieldValue, values, errors, touched } = useFormikContext<any>();
    const [showSupplierModal, setShowSupplierModal] = useState(false);

    const isInvalid = errors[fieldName] && touched[fieldName];

    return (
        <>
            <ModalSupplierList
                isShow={showSupplierModal}
                onHide={() => setShowSupplierModal(false)}
                onSelect={(supplier: any) => {
                    setFieldValue(fieldName, supplier.name);
                }}
            />

            <div className="input-group">
                <div className={`form-control text-sm text-gray-500 bg-gray-200 cursor-not-allowed h-[34px] ${isInvalid ? 'is-invalid border-red-500' : ''}`}>
                    {values[fieldName]}
                </div>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowSupplierModal(true)}>
                    <FaSearch />
                </button>
            </div>
        </>
    )
}

export default SupplierSelection
