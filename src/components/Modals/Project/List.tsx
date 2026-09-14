import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Pagination } from 'react-bootstrap'
import { getProjects } from '../../../features/slices/project/projectSlice';
import Loading from '../../ui/Loading';

const ModalProjectList = ({ isShow, onHide, onSelect }: any) => {
    const dispatch = useDispatch<any>();
    const { projects, pager, isLoading } = useSelector((state: any) => state.project);

    useEffect(() => {
        dispatch(getProjects({ url: '/api/projects/search?page=&year=2567' }));
    }, []);

    const handlePageClick = (url: string) => {
        if (url) dispatch(getProjects({ url }));
    };

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='xl'
        >
            <Modal.Header closeButton>
                <Modal.Title>รายการโครงการ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <table className="table table-bordered text-sm">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                {/* <th className="text-center w-[15%]">เลขที่พัสดุ</th> */}
                                <th>โครงการ</th>
                                <th className="text-center w-[10%]">ปีงบ</th>
                                <th className="text-center w-[10%]">เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            )}
                            {projects && projects.map((project, index) => (
                                <tr key={project?.id} className="font-thin">
                                    <td className="text-center">{index+pager.from}</td>
                                    {/* <td className="text-center">{project.project_no}</td> */}
                                    <td>
                                        {/* <p className="text-gray-400 text-sm">{project.project?.plan?.name}</p>
                                        <p className="text-gray-400 text-sm">{project.project?.name}</p> */}
                                        <p>{project?.name}</p>
                                    </td>
                                    <td className="text-center">{project.year}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                onHide();
                                                onSelect(project);
                                            }}
                                        >
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pager && (
                    <Pagination>
                        <Pagination.First disabled={pager.current_page === 1} onClick={() => handlePageClick(pager.first_page_url)} />
                        <Pagination.Prev disabled={!pager.prev_page_url} onClick={() => handlePageClick(pager.prev_page_url)} />
                        {/* <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Ellipsis />

                        <Pagination.Item>{10}</Pagination.Item>
                        <Pagination.Item>{11}</Pagination.Item>
                        <Pagination.Item active>{12}</Pagination.Item>
                        <Pagination.Item>{13}</Pagination.Item>
                        <Pagination.Item disabled>{14}</Pagination.Item>

                        <Pagination.Ellipsis />
                        <Pagination.Item>{20}</Pagination.Item> */}
                        <Pagination.Next disabled={!pager.next_page_url} onClick={() => handlePageClick(pager.next_page_url)} />
                        <Pagination.Last disabled={pager.current_page === pager.last_page} onClick={() => handlePageClick(pager.last_page_url)} />
                    </Pagination>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default ModalProjectList
