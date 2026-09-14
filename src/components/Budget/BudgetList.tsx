import React, { Fragment } from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { currency } from '../../utils'
import BudgetTypeBadge from './BudgetTypeBadge'

const BudgetList = ({ budgets, showButtons=true, onRemoveBudget, onEditBudget, newFlagField }: any) => {
    return (
        <>
            <table className="table table-bordered table-striped table-hover text-sm mb-2">
                <thead>
                    <tr>
                        <th className="text-center w-[5%]">#</th>
                        <th>งบประมาณ</th>
                        <th className="text-center w-[15%]">จำนวนเงิน</th>
                        {showButtons && <th className="text-center w-[10%]">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {(budgets && budgets.length === 0) && (
                        <tr>
                            <td colSpan={showButtons ? 4 : 3} className="text-center">
                                <span className="text-red-500">-- ไม่มีรายการ --</span>
                            </td>
                        </tr>
                    )}
                    {budgets && budgets.map((data, index) => (
                        <Fragment key={data.id}>
                            {!data.removed && (
                                <tr className="font-thin">
                                    <td className="text-center">{index+1}</td>
                                    <td>
                                        <p className="font-thin text-xs">{data.budget?.activity?.project?.plan?.name}</p>
                                        <p className="text-xs font-semibold">{data.budget?.activity?.project?.name}</p>
                                        <p className="text-sm text-blue-500 font-semibold">
                                            {data.budget?.activity?.name}
                                            <BudgetTypeBadge type={data.budget.type} />
                                        </p>
                                        </td>
                                    <td className="text-right">{currency.format(data.total)}</td>
                                    {showButtons && (
                                        <td className="text-center">
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                {/* {(!edittingItem || edittingItem?.expense_id !== data.expense_id) && ( */}
                                                    {/* <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning"
                                                        onClick={() => onEditBudget(data)}
                                                    >
                                                        <FaPencilAlt />
                                                    </button> */}
                                                {/* )} */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger p-1"
                                                    onClick={() => onRemoveBudget(data.id, !data[newFlagField])}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default BudgetList