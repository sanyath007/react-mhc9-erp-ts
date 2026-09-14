import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { getMembersByEmployee } from '../../../../features/slices/member/memberSlice'
import { getDuty } from '../../../../utils'

const MemberList = ({ employee }: any) => {
    const dispatch = useDispatch<any>();
    const { members, isSuccess } = useSelector((state: any) => state.member);

    useEffect(() => {
        dispatch(getMembersByEmployee(employee.id));
    }, [dispatch, employee, isSuccess]);

    return (
        <table className="table table-bordered text-sm">
            <thead>
                <tr>
                    <th className="text-center w-[5%]">#</th>
                    <th>หน่วยงาน</th>
                    <th className="text-center w-[20%]">บทบาท/หน้าที่</th>
                    <th className="text-center w-[10%]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {members && members.map((member, index) => (
                    <tr key={member.id} className="font-thin">
                        <td className="text-center">{index+1}</td>
                        <td>{member.duty_id === 1 ? 'ผู้อำนวยการศูนย์สุขภาพจิตที่ 9' : (member.duty_id === 2 ? member.department?.name : member.division?.name)}</td>
                        <td className="text-center">{getDuty(member.duty_id)?.name}</td>
                        <td className="text-center">
                            <button className="btn btn-warning btn-sm px-1 mr-1">
                                <FaPencilAlt />
                            </button>
                            <button className="btn btn-danger btn-sm px-1">
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default MemberList