import React from 'react'

const EmployeeCard = ({
    employee,
    avatarStyle = 'rounded',
    showAvatar = true,
    showPosition = true,
    showDuty = false
}: any) => {
    return (
        <div className="flex flex-row gap-2">
            {showAvatar && (
                <div className={`border ${avatarStyle === 'rounded' ? 'rounded-full w-[40px] h-[40px] ' : 'rounded-md w-[100px] max-h-[120px]'} overflow-hidden object-cover object-center`}>
                    {employee?.avatar_url
                        ? <img src={`${process.env.REACT_APP_API_URL}/uploads/${employee?.avatar_url}`} alt="employee-pic" />
                        : <img src="/img/avatar-heroes.png" alt="employee-pic" className="avatar-img" />}
                </div>
            )}
            <div>
                <p className="font-bold">{employee?.prefix.name}{employee?.firstname} {employee?.lastname}</p>
                {showPosition && (
                    <p>{employee?.position.name}{employee?.level?.name}</p>
                )}
                {showDuty && employee?.member_of.length > 0 && (
                    <p className="text-sm">
                        {employee?.member_of[0]?.department?.name}
                        <span className="ml-1">({employee?.member_of[0]?.duty?.name})</span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default EmployeeCard
