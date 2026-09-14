import React from 'react'
import { useDispatch } from 'react-redux'
import { upload } from '../../../features/slices/employee/employeeSlice';

const ChangeAvatar = ({ employee, selected, onSelect }: any) => {
    const dispatch = useDispatch<any>();

    const handleUpload = () => {
        const data = new FormData();
        data.append('avatar_url', selected);

        dispatch(upload({ id: employee.id, data }));

        onSelect(null);
    };

    return (
        <div>
            {!selected ? (
                <label>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onSelect(e.target.files[0])} />
                    <p className="hover:text-blue-600 mt-3 sm:mb-3 cursor-pointer">
                        เปลี่ยนรูป
                    </p>
                </label>
            ) : (
                <button type="button" className="btn btn-outline-success mt-3 sm:mb-3" onClick={handleUpload}>
                    อัพโหลด
                </button>
            )}
        </div>
    )
}

export default ChangeAvatar
