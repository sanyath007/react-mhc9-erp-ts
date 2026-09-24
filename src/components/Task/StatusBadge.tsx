import React, { useEffect, useState } from 'react'
import { useGetInitialFormDataQuery } from '../../features/services/task/taskApi';
import Loading from '../ui/Loading';
import api from '../../api';

const itemColors = ['secondary', 'success', 'primary', 'warning', 'danger'];

const TaskStatusBadge = ({ params = '', onClick }: any) => {
    const { data, isLoading } = useGetInitialFormDataQuery();
    const [statusCount, setStatusCount] = useState([]);

    useEffect(() => {
        getStatusCount();
    }, []);

    const getStatusCount = async () => {
        try {
            const res = await api.get('/api/tasks/count/status');

            setStatusCount(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCountByStatus = (id) => {
        const status = statusCount?.find(st => st.status === id);

        return status ? status.count : 0;
    };

    const handleClick = (status) => {
        if (params === '') {
            onClick(`&status=${status}`);
        } else {
            let qsArr = params.split('&');
            qsArr.shift(); // Remove 1st element of qsArr array (empty string)

            /** Get index of status param */
            const statusIndex = qsArr.findIndex(q => q.includes('status='));

            /** Create query string from qsArr array */
            const queryStr = qsArr.map((qs, index) => {
                if (statusIndex === index) {
                    return `status=${status}`;
                }

                return qs;
            }).join('&');

            onClick(`&${queryStr}`);
        }
    };

    return (
        <div className="py-1">
            {isLoading && <div className="text-center"><Loading /></div>}
            {!isLoading && (
                <div className="flex flex-row gap-2">
                    {data && data.statuses.map((status, index) => (
                        <button
                            type="button"
                            className={`btn btn-outline-${itemColors[index]} text-sm`} key={status.id}
                            onClick={() => handleClick(status.id)}
                        >
                            {status.name}
                            <span className={`badge rounded-pill bg-${itemColors[index]} ml-1`}>
                                {getCountByStatus(status.id)}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TaskStatusBadge