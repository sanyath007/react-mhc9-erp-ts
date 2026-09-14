import React from 'react'
import { Link } from 'react-router-dom';

const ProcurementReport = () => {
    return (
        <div className='text-center'>
            <h1 className='text-xl font-bold mb-6'>รายงานการจัดซื้อจัดจ้าง</h1>
            
            <div className='flex flex-col items-center gap-4'>
                <Link to="/procurement/report/summary" className="text-blue-500 underline">
                    แบบสรุปผลการดำเนินการจัดซื้อจัดจ้าง
                </Link>

                <Link to="/procurement/report/attachment" className="text-blue-500 underline">
                    รายละเอียดแนบท้ายประกาศผลผู้ชนะการจัดซื้อจัดจ้าง
                </Link>
            </div>
        </div>
    )
}

export default ProcurementReport