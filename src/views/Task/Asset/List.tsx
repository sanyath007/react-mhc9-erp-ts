import React from 'react'
import { FaTrash } from 'react-icons/fa'

const TaskAssetList = ({ assets, onRemove }) => {
    return (
        <div>
            <table className="table table-bordered text-sm">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th className="w-[20%] text-center">หมายเลขพัสดุ</th>
                        <th>รายการ</th>
                        <th className="w-[8%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center font-thin">
                                <span className="text-red-500">-- ยังไม่มีข้อมูล --</span>
                            </td>
                        </tr>
                    )}
                    {assets && assets.map((asset, index) => (
                        <tr key={asset.id} className="font-thin">
                            <td className="text-center">{index+1}</td>
                            <td className="text-center">{asset.asset_no}</td>
                            <td>{asset.name}</td>
                            <td className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => onRemove(asset.id)}
                                >
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

export default TaskAssetList
