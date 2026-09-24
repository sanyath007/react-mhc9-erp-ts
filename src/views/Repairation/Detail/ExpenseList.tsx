import React from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { getExpense } from '../../../utils'

const ExpenseList = ({ expenses, onDelete }) => {
    return (
        <table className="table table-bordered text-sm mb-1">
            <thead>
                <tr>
                    <th className="text-center w-[5%]">#</th>
                    <th>รายการ</th>
                    <th className="text-center w-[25%]">ค่าใช้จ่าย</th>
                    <th className="text-center w-[10%]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {expenses.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center text-xs font-thin">
                            <span className="text-red-500">-- ไม่มีรายการ --</span>
                        </td>
                    </tr>
                )}

                {expenses.length > 0 && expenses.map((expense, index) => (
                    <tr key={expense.id} className="text-xs font-thin">
                        <td className="text-center">{index+1}</td>
                        <td>{getExpense(parseInt(expense.id, 10))?.name}</td>
                        <td className="text-center">{expense.total}</td>
                        <td className="text-center">
                            <button className="btn btn-sm btn-warning px-1 mr-1">
                                <FaPencilAlt />
                            </button>
                            <button className="btn btn-sm btn-danger px-1" onClick={() => onDelete(expense.id)}>
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ExpenseList
