import React from 'react'

const EmployeeAvatar = ({ avatarUrl, selectedImage }: any) => {
    return (
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden border">
            {selectedImage ? selectedImage && (
                <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="avatar"
                />
            ) : avatarUrl && (
                <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${avatarUrl}`}
                    alt="avatar"
                />
            )}
        </div>
    )
}

export default EmployeeAvatar
