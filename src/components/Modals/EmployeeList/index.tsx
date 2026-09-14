import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from '../../../features/slices/employee/employeeSlice';
import { useGetInitialFormDataQuery } from '../../../features/services/employee/employeeApi';
import { generateQueryString } from '../../../utils';
import FilteringInputs from '../../Employee/FilteringInputs';
import Loading from '../../ui/Loading';
import Pagination from '../../ui/Pagination'

const initialFilters = {
    name: '',
    division: '',
    status: '1',
    limit: 8,
};

const initialFormData = {
    divisions: []
};

const ModalEmployeeList = ({ isShow, onHide, onSelect }: any) => {
    const dispatch = useDispatch<any>();
    const { employees, pager, isLoading } = useSelector((state: any) => state.employee)
    const { data: formData = initialFormData } = useGetInitialFormDataQuery();
    const [endpoint, setEndpoint] = useState('');
    const [params, setParams] = useState(generateQueryString(initialFilters));

    useEffect(() => {
        if (endpoint === '') {
            dispatch(getEmployees({ url: `/api/employees/search?page=${params}` }));
        } else {
            dispatch(getEmployees({ url: `${endpoint}${params}` }));
        }
    }, [endpoint]);

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            size='lg'
        >
            <Modal.Header closeButton className="py-1">
                <Modal.Title>รายการบุคลากร</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FilteringInputs
                    initialFilters={initialFilters}
                    onFilter={(queryStr) => {
                        setParams(queryStr)
                        setEndpoint(prev => prev === '' ? `/api/employees/search?page=` : '');
                    }}
                    formData={formData}
                />

                <div>
                    <table className="table table-bordered table-striped table-hover text-sm mb-0">
                        <thead>
                            <tr>
                                <th className="text-center w-[5%]">#</th>
                                <th>ชื่อ-สกุล</th>
                                <th className="text-center w-[40%]">ตำแหน่ง</th>
                                <th className="text-center w-[8%]">Actions</th>
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
                            {employees && employees.map((employee, index) => (
                                <tr key={employee.id} className="font-thin">
                                    <td className="text-center">{index + pager.from}</td>
                                    <td><span className="font-bold">{employee.prefix.name}{employee.firstname} {employee.lastname}</span></td>
                                    <td>{employee.position.name}{employee.level?.name}</td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => {
                                                onSelect(employee);
                                                onHide();
                                            }}
                                        >
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && employees.length <= 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        -- ไม่มีข้อมูล --
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className="py-1">
                <Pagination
                    pager={pager}
                    onPageClick={(url) => setEndpoint(url)}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEmployeeList
