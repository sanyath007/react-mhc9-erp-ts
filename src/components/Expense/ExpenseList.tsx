import React, { Fragment } from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { currency, replaceExpensePatternFromDesc, toLongTHDateRange } from '../../utils'

const ExpenseList = ({ items, courses, showButtons=true, edittingItem, onEditItem, onRemoveItem }: any) => {
    const renderExpenseRow = (data, index) => {
        return (
            <tr className="font-thin">
                <td className="text-center">{index}</td>
                <td>
                    <p className="text-gray-500 font-thin">
                        {data.expense?.name}
                        {(data.description && data.expense?.pattern)
                            ? (
                                <span className="text-xs text-red-500 font-thin ml-1">
                                    {replaceExpensePatternFromDesc(data.expense?.pattern, data.description)}
                                </span>
                            ) : (
                                <span className="text-xs text-red-500 font-thin">
                                    {data.description && <span>({data.description})</span>}
                                </span>
                            )
                        }
                    </p>
                </td>
                <td className="text-right">{currency.format(data.total)}</td>
                {showButtons && (
                    <td className="text-center">
                        {(!edittingItem || edittingItem?.id !== data.id) && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-warning mr-1 p-1"
                                onClick={() => onEditItem(data)}
                            >
                                <FaPencilAlt />
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger p-1"
                            onClick={() => onRemoveItem(data.id, data.loan_id === '')}
                        >
                            <FaTrash />
                        </button>
                    </td>
                )}
            </tr>
        )
    };

    return (
        <table className="table table-bordered table-striped table-hover text-sm mb-2">
            <thead>
                <tr>
                    <th className="w-[5%] text-center">#</th>
                    <th>รายการ</th>
                    <th className="w-[15%] text-center">รวมเป็นเงิน</th>
                    {showButtons && <th className="w-[10%] text-center">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {(items && items.length === 0) && (
                    <tr>
                        <td colSpan={showButtons ? 5 : 4} className="text-center">
                            <span className="text-red-500">-- ไม่มีรายการ --</span>
                        </td>
                    </tr>
                )}

                {(courses && courses.length > 1)
                    ? courses.map(course => {
                        let seq = 0;

                        return (
                            <Fragment key={course.id} >
                                <tr>
                                    <td colSpan={showButtons ? 4 : 3}>
                                        {/* รุ่นที่ {course.seq_no} */}
                                        {course?.course_date && <span className="mr-1">วันที่ {toLongTHDateRange(course?.course_date, course?.course_edate)}</span>} 
                                        ณ {course?.place?.name} จ.{course?.place?.changwat?.name}
                                        <span className="ml-1">{course?.remark && course?.remark}</span>
                                    </td>
                                </tr>
                                {items && items.map((data, index) => (
                                    <Fragment key={data.id}>
                                        {(parseInt(data.course_id) === course.id && !data.removed) && renderExpenseRow(data, ++seq)}
                                    </Fragment>
                                ))}
                            </Fragment>
                        )})
                    : items && items.map((data, index) => (
                        <Fragment key={data.id}>
                            {!data.removed && renderExpenseRow(data, ++index)}
                        </Fragment>
                    ))}
            </tbody>
        </table>
    )
}

export default ExpenseList
