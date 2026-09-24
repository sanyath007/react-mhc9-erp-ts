import React from 'react'
import { AiFillBulb } from 'react-icons/ai'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useSelector } from 'react-redux';
import Loading from '../../components/ui/Loading'

const RoomList = ({ rooms, pager, handleEditting }) => {
    const { loading } = useSelector((state: any) => state.room);

    return (
        <div className="mt-2">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th>ชื่อห้อง</th>
                        <th className="w-[10%] text-center">สถานะ</th>
                        <th className="w-[10%] text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={4} className="text-center"><Loading /></td>
                        </tr>
                    )}
                    {rooms && rooms.map((room, index) => (
                        <tr key={room.id}>
                            <td className="text-center">{index + pager.from}</td>
                            <td>{room.name}</td>
                            <td className="text-center">
                                {room.status === 1 ? (
                                    <>
                                        <button type="button" className="text-success" data-tooltip-id="active">
                                            <AiFillBulb size={'1.5rem'} />
                                        </button>
                                        <ReactTooltip id='active' place="top">สถานะใช้งานอยู่</ReactTooltip>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="text-danger" data-tooltip-id="inactive">
                                            <AiFillBulb size={'1.5rem'} />
                                        </button>
                                        <ReactTooltip id='inactive' place="top">สถานะปิดการใช้งาน</ReactTooltip>
                                    </>
                                )}
                            </td>
                            <td className="text-center">
                                <button onClick={() => handleEditting(room)} className="btn btn-sm btn-warning mr-1">
                                    <FaPencilAlt />
                                </button>
                                <button className="btn btn-sm btn-danger">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RoomList
