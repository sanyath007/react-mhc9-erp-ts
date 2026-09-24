import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillBulb } from 'react-icons/ai'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Pagination } from 'react-bootstrap'
import Loading from '../../components/ui/Loading'
import { destroy } from '../../features/slices/department/departmentSlice'

const DepartmentList = ({ departments, pager, onEditting, onPageClick }) => {
    const dispatch = useDispatch<any>();
    const { isLoading } = useSelector((state: any) => state.department);

    const handleDelete = (id) => {
        if (window.confirm('คุณต้องการลบรายการกลุ่มงานหรือไม่?')) {
            dispatch(destroy(id));
        }
    };

    return (
        <div className="mt-2">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th>ชื่อกลุ่มงาน</th>
                        <th className="w-[10%] text-center">สถานะ</th>
                        <th className="w-[10%] text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={4} className="text-center"><Loading /></td>
                        </tr>
                    )}
                    {(!isLoading && departments) && departments.map((dep, index) => (
                        <tr key={dep.id}>
                            <td className="text-center">{index + pager.from}</td>
                            <td>{dep.name}</td>
                            <td className="text-center">
                                {dep.status === 1 ? (
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
                                <button onClick={() => onEditting(dep)} className="btn btn-sm btn-warning mr-1">
                                    <FaPencilAlt />
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dep.id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {(pager && pager.last_page > 1) && (
                <Pagination>
                    <Pagination.First disabled={pager.current_page === 1} onClick={() => onPageClick(pager.first_page_url)} />
                    <Pagination.Prev disabled={!pager.prev_page_url} onClick={() => onPageClick(pager.prev_page_url)} />
                    {/* <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis />

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item> */}
                    <Pagination.Next disabled={!pager.next_page_url} onClick={() => onPageClick(pager.next_page_url)} />
                    <Pagination.Last disabled={pager.current_page === pager.last_page} onClick={() => onPageClick(pager.last_page_url)} />
                </Pagination>
            )}
        </div>
    )
}

export default DepartmentList
