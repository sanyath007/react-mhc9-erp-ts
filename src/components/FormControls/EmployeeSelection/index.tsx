import React, { useEffect, useState } from 'react'
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa'
import ModalEmployeeList from '../../Modals/EmployeeList'

const EmployeeSelection = ({ data, fieldName }: any) => {
    const { setFieldValue } = useFormikContext();
    const { loggedInUser } = useSelector((state: any) => state.auth);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        if (loggedInUser) {
            setEmployee(loggedInUser.employee);
            setFieldValue(fieldName, data ? data?.id : loggedInUser.employee?.id);
        }
    }, [loggedInUser]);

    useEffect(() => {
        if (data) setEmployee(data);
    }, [data]);

    return (
        <>
            <ModalEmployeeList
                isShow={showEmployeeModal}
                onHide={() => setShowEmployeeModal(false)}
                onSelect={(employee) => {
                    setEmployee(employee);
                    setFieldValue(fieldName, employee.id);
                }}
            />

            <div className="input-group">
                <div className="form-control text-sm text-gray-500 bg-gray-200 cursor-not-allowed h-[34px]">
                    {employee?.firstname} {employee?.lastname}
                </div>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEmployeeModal(true)}>
                    <FaSearch />
                </button>
            </div>
        </>
    )
}

export default EmployeeSelection