import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import ModalEmployeeList from '../../../components/Modals/EmployeeList';

const Deputy = ({ defaultValue, onUpdate }: any) => {
    const [deputy, setDeputy] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (defaultValue) setDeputy(defaultValue);
    }, [defaultValue]);

    const handleSelect = (employee) => {
        if (deputy && deputy.id === employee.id) {
            window.alert('คุณเลือกรายการซ้ำ กรณาเลือกใหม่!!');
            return;
        }

        setDeputy(employee);
        onUpdate(employee);
    };

    const handleRemove = () => {
        setDeputy(null);
        onUpdate(null);
    };

    return (
        <div className="border w-full p-2 rounded-md">
            <ModalEmployeeList
                isShow={showModal}
                onHide={() => setShowModal(false)}
                onSelect={handleSelect}
            />

            <h3 className="font-bold text-lg mb-1">ผู้อนุมัติแทน ผอ. <span className="text-red-500 font-normal">(ถ้ามี)</span></h3>
            <ul className="flex flex-col text-sm ml-2">
                {deputy ? (
                    <li className="flex flex-row gap-2 w-full p-1">
                        <div className="w-[80%] max-lg:w-[60%] flex flex-row gap-2">
                            <span>{deputy.prefix.name}{deputy.firstname} {deputy.lastname}</span>
                            {/* <span className="max-md:hidden">
                                <b>ตำแหน่ง</b> {deputy.position?.name}{deputy.level && deputy.level?.name}
                            </span> */}
                        </div>
                        <div className="min-w-[10%]">
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm px-1"
                                onClick={() => handleRemove()}
                            >
                                <FaMinus size={'12px'} />
                            </button>
                            {!deputy && (
                                <button type="button" className="btn btn-outline-primary btn-sm px-1" onClick={() => setShowModal(true)}>
                                    <FaPlus size={'12px'} />
                                </button>
                            )}
                        </div>
                    </li>
                ) : (
                    <li className="flex flex-row w-full p-1">
                        <span className="min-w-[50%] text-red-500">ยังไม่มีรายการ</span>
                        <button type="button" className="btn btn-outline-primary btn-sm px-1" onClick={() => setShowModal(true)}>
                            <FaPlus size={'12px'} />
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Deputy