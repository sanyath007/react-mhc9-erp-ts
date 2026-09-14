import React from 'react'

const StatusBadge = ({ status }: any) => {
    return (
        <>
            {status === 1 && <span className="badge rounded-pill text-bg-secondary">รอดำเนินการ</span>}
            {status === 2 && <span className="badge rounded-pill text-bg-primary">แต่งตั้ง ผตร.</span>}
            {status === 3 && <span className="badge rounded-pill text-bg-info">ประกาศผู้ชนะ</span>}
            {status === 4 && <span className="badge rounded-pill text-bg-danger">จัดซื้อแล้ว</span>}
            {status === 5 && <span className="badge rounded-pill text-bg-success">ตรวจรับแล้ว</span>}
            {status === 9 && <span className="badge rounded-pill text-bg-dark">ยกเลิก</span>}
        </>
    )
}

export default StatusBadge