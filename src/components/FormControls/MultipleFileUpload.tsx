import React, { useState, ChangeEvent } from 'react'
import { filesizes } from '../../utils';

interface MultipleFileUploadProps {
    files: File[];
    onSelect: (files: File[]) => void;
    onDelete: (index: number) => void;
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({ files, onSelect, onDelete }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            onSelect([...files, file]);
        }
    };

    return (
        <div>
            <div className="file-upload">
                <div className="file-upload-box">
                    <input
                        type="file"
                        className="file-upload-input"
                        onChange={handleFileChange}
                        multiple
                    />

                    <span>Drag and Drop or <span className="file-upload-link">Choose your files</span></span>
                </div>
            </div>
            <div className="file-attach">
                {files.map((file, index) => {
                    const fileObj = file as any;
                    return (
                        <div className="file-attach-box" key={index}>
                            <div className="file-image">
                                <img src={URL.createObjectURL(file)} alt="" />
                            </div>
                            <div className="file-detail">
                                <h6>{file?.name}</h6>
                                <p>
                                    <span className="me-2">Size: {filesizes(file?.size)}</span>
                                    <span>Modified Time: {fileObj?.lastModifiedDate ? fileObj.lastModifiedDate.toLocaleString('en-IN') : new Date(file.lastModified).toLocaleString('en-IN')}</span>
                                </p>

                                <div className="file-actions">
                                    <button type="button" className="file-action-btn" onClick={() => onDelete(index)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* <div className="text-end">
                <button className="btn-upload">Upload</button>
            </div> */}
        </div>
    )
}

export default MultipleFileUpload
