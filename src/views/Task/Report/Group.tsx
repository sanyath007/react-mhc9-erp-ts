import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'

const TaskGroup = ({ tasks, ...props }) => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const uniqueGroups = Array.from<any>(
            new Map(tasks.map((task: any) => task.group)
                            .map((group: any) => [group['id'], group])).values()
        );

        setGroups(
            uniqueGroups.map(gp => {
                return {
                    ...gp,
                    total: tasks.filter(task => task.task_group_id === gp.id).length
                };
            })
        );
    }, [tasks]);

    return (
        <Col md={6} className="p-1">
            <div className="border rounded-md px-3 py-2">
                <h3 className="font-bold text-lg">{props.name}</h3>
                <ul className="">
                    {tasks && groups.map(group => (
                        <li className="flex flex-row justify-between items-center" key={group.id}>
                            <span>- {group.name}</span>
                            <span>{group.total}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Col>
    )
}

export default TaskGroup