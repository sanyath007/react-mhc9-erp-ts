import React from 'react'

interface LoanStatusBadgeProps {
    status: number;
}

const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status }) => {
    return (
        <div className="text-lg text-center mt-1">
            {status === 1 && <span className="badge rounded-pill text-bg-secondary ml-1">รอดำเนินการ</span>}
            {status === 2 && <span className="badge rounded-pill text-bg-primary ml-1">ส่งสัญญาแล้ว</span>}
            {status === 3 && <span className="badge rounded-pill text-bg-success ml-1">อนุมัติแล้ว</span>}
            {status === 4 && <span className="badge rounded-pill text-bg-warning ml-1">โอนเงินแล้ว</span>}
            {status === 5 && <span className="badge rounded-pill text-bg-dark ml-1">เคลียร์แล้ว</span>}
            {status === 9 && <span className="badge rounded-pill text-bg-danger ml-1">ยกเลิก</span>}
        </div>
    )
}

export default LoanStatusBadge