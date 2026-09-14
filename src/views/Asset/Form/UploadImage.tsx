import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { upload, resetUploaded } from '../../../features/slices/asset/assetSlice';

const UploadImage = ({ asset, selectedImage, handleSelectedImage }) => {
    const dispatch = useDispatch<any>();
    const { isUploaded } = useSelector((state: any) => state.asset);

    useEffect(() => {
        if (isUploaded) {
            toast.success('อัพโหลดไฟล์เรียบร้อยแล้ว!!');

            dispatch(resetUploaded());
        }
    }, [isUploaded]);

    const handleUploadImage = (id) => {
        let data = new FormData();
        data.append('img_url', selectedImage);

        dispatch(upload({ id, data }));

        handleSelectedImage(null);
    };

    return (
        <div>
            <label>
                <input
                    type="file"
                    onChange={(e) => handleSelectedImage(e.target.files[0])}
                    className="hidden"
                />
                {!selectedImage && (
                    <p className="btn btn-outline-primary btn-sm">
                        เปลี่ยนรูป
                    </p>
                )}
            </label>
            {selectedImage && (
                <button type="button" className="btn btn-outline-success btn-sm" onClick={() => handleUploadImage(asset.id)}>
                    อัพโหลด
                </button>
            )}
        </div>
    )
}

export default UploadImage