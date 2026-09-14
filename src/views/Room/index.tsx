import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getRooms } from '../../features/slices/room/roomSlice'
import RoomList from './List'
import RoomForm from './Form'

const Room = () => {
    const dispatch = useDispatch<any>();
    const { rooms, pager } = useSelector((state: any) => state.room);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        dispatch(getRooms(null));
    }, [dispatch]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item href="/">ข้อมูลพื้ฐาน</Breadcrumb.Item>
                <Breadcrumb.Item active>ห้อง</Breadcrumb.Item>
            </Breadcrumb>
        
            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl">ห้อง</h2>
                </div>

                <RoomForm
                    room={room}
                    handleCancel={() => setRoom(null)}
                />

                <RoomList
                    rooms={rooms}
                    pager={pager}
                    handleEditting={(room) => setRoom(room)}
                />
            </div>
        </div>
    )
}

export default Room
