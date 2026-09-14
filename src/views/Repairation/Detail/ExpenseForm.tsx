import React, { useState } from 'react'

const initialExpense = { id: '', total: '' };

const ExpenseForm = ({ onAdd }: any) => {
    const [expense, setExpense] = useState(initialExpense);

    return (
        <div className="flex flex-row mb-1">
            <select
                name="id"
                value={expense.id}
                onChange={(e) => setExpense({ ...expense, [e.target.name]: parseInt(e.target.value, 10) })}
                className="form-control text-sm font-thin mr-1" 
            >
                <option value="">-- เลือกรายการ --</option>
                <option value="1">ค่าซ่อม/ค่าบริการ</option>
                <option value="2">ค่าอะไหล่</option>
                <option value="3">ค่าอื่นๆ</option>
            </select>
            <input
                type="text"
                name="total"
                value={expense.total}
                onChange={(e) => setExpense({ ...expense, [e.target.name]: parseFloat(e.target.value) })}
                className="form-control text-sm text-center font-thin mr-1 w-[40%]"
                placeholder="ค่าใช้จ่าย"
            />
            <button
                type="button"
                className="btn btn-outline-primary text-sm"
                onClick={() => {
                    onAdd(expense);

                    setExpense(initialExpense);
                }}
            >
                เพิ่ม
            </button>
        </div>
    )
}

export default ExpenseForm
