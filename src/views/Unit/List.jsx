import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AiFillBulb } from 'react-icons/ai'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { destroy } from '../../features/slices/unit/unitSlice';
import Loading from '../../components/ui/Loading';
import Pagination from '../../components/ui/Pagination'

const UnitList = ({ units, pager, onEditting, onPageClick, onDeleted }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.unit);

    const handleDelete = (id) => {
        if (window.confirm('คุณต้องการลบรายการหน่วยงานหรือไม่?')) {
            dispatch(destroy(id));

            onDeleted();
        }
    };

    return (
        <div className="mt-2">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th>ชื่อหน่วยนับ</th>
                        <th className="w-[10%] text-center">สถานะ</th>
                        <th className="w-[10%] text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={5} className="text-center"><Loading /></td>
                        </tr>
                    )}
                    {(!isLoading && units && units.length > 0) && units.map((unit, index) => (
                        <tr key={unit.id}>
                            <td className="text-center">{index + pager.from}</td>
                            <td>{unit.name}</td>
                            <td className="text-center">
                                {unit.status === 1 ? (
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
                                <button className="btn btn-sm btn-warning px-1 mr-1" onClick={() => onEditting(unit)}>
                                    <FaPencilAlt />
                                </button>
                                <button className="btn btn-sm btn-danger px-1" onClick={() => handleDelete(unit.id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                pager={pager}
                onPageClick={onPageClick}
            />
        </div>
    )
}

export default UnitList
