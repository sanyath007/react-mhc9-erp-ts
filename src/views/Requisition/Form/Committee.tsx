import React, { Fragment, useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { removeItemWithFlag } from '../../../utils';
import ModalEmployeeList from '../../../components/Modals/EmployeeList';

const Committee = ({ defaultValue, onUpdate }: any) => {
    const [committees, setCommittees] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (defaultValue) setCommittees(defaultValue);
    }, [defaultValue]);

    const handleSelect = (employee) => {
        if (committees.filter(comm => !comm.removed).find(committee => committee.employee_id === employee.id)) {
            window.alert('คุณเลือกรายการซ้ำ กรณาเลือกใหม่!!');
            return;
        }

        const newCommittees = [...committees, { id: employee.id, employee_id : employee.id, employee }];
        setCommittees(newCommittees);
        onUpdate(newCommittees);
    };

    const handleRemove = (id, isNew = false) => {
        const newCommittees = removeItemWithFlag(committees, id, isNew);

        setCommittees(newCommittees);
        onUpdate(newCommittees);
    };

    return (
        <div className="border w-full p-2 rounded-md">
            <ModalEmployeeList
                isShow={showModal}
                onHide={() => setShowModal(false)}
                onSelect={handleSelect}
            />

            <h3 className="font-bold text-lg mb-1">ผู้ตรวจรับพัสดุ</h3>
            <ul className="flex flex-col text-sm ml-2">
                {(committees.filter(comm => !comm.removed).length > 0)
                    ? committees.filter(comm => !comm.removed).map((committee, index) => (
                        <Fragment key={committee.id}>
                            {!committee.removed && (
                                <li className="flex flex-row gap-2 w-full p-1">
                                    <div className="w-[80%] max-lg:w-[60%] flex flex-row gap-2">
                                        <span>
                                            {index+1}. {committee.employee?.prefix.name}{committee.employee?.firstname} {committee.employee?.lastname}
                                        </span>
                                        <span className="max-md:hidden">
                                            <b>ตำแหน่ง</b> {committee.employee?.position?.name}{committee.employee?.level && committee.employee?.level?.name}
                                        </span>
                                    </div>
                                    <div className="min-w-[10%]">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm px-1"
                                            onClick={() => handleRemove(committee.id, !committee.requisition_id)}
                                        >
                                            <FaMinus size={'12px'} />
                                        </button>
                                        {index === committees.filter(comm => !comm.removed).length - 1 && (
                                            <button type="button" className="btn btn-outline-primary btn-sm px-1" onClick={() => setShowModal(true)}>
                                                <FaPlus size={'12px'} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            )}
                        </Fragment>
                    )) : (
                        <li className="flex flex-row w-full p-1">
                            <span className="min-w-[50%] text-red-500">ยังไม่มีรายการ</span>
                            <button type="button" className="btn btn-outline-primary btn-sm px-1" onClick={() => setShowModal(true)}>
                                <FaPlus size={'12px'} />
                            </button>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default Committee