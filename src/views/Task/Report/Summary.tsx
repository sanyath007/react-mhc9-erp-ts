import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumb, Row } from 'react-bootstrap';
import { DatePicker, TimePicker } from '@material-ui/pickers'
import moment from 'moment';
import { useStyles } from '../../../hooks/useStyles'
import { getAllTasks } from '../../../features/slices/task/taskSlice'
import TaskGroup from './Group';
import Loading from '../../../components/ui/Loading'

const TaskSummary = () => {
    const classes = useStyles();
    const dispatch = useDispatch<any>();
    const { tasks, isLoading } = useSelector((state: any) => state.task);
    const [selectedTaskDate, setSelectedTaskDate] = useState(moment());

    useEffect(() => {
        dispatch(getAllTasks({ url: `/api/tasks?year=${selectedTaskDate.year()}` }));
    }, [selectedTaskDate]);

    return (
        <div className="content-wrapper">
            {/* breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item active>บริการ</Breadcrumb.Item>
                <Breadcrumb.Item active>รายงานการให้บริการ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <h2 className="text-xl font-bold">รายงานการให้บริการ</h2>

                <div className="flex flex-row items-center gap-2 border rounded-md py-2 px-4 my-2">
                    <label htmlFor="">ปีงบประมาณ : </label>
                    <div className="w-[120px]">
                        <DatePicker
                            format="YYYY"
                            views={['year']}
                            value={selectedTaskDate}
                            onChange={(date) => {
                                setSelectedTaskDate(date);
                            }}
                            className={classes.muiTextFieldInput}
                        />
                    </div>
                </div>

                {isLoading && <div className="text-center"><Loading /></div>}

                {(!isLoading && tasks) && (
                    <Row className="px-2">
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 1)}
                            name="คอมพิวเตอร์"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 2)}
                            name="เครื่องพิมพ์/สแกนเนอร์"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 5)}
                            name="โปรแกรม/ระบบงาน"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 8)}
                            name="เครื่องสำรองไฟฟ้า"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 6)}
                            name="ข้อมูล/สารสนเทศ"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 7)}
                            name="อุปกรณ์แท็บเล็ต/ไอแพด/สมาร์ทโฟน"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 3)}
                            name="ระบบเครือข่าย (LAN/WiFi/อินเตอร์เน็ต)"
                        />
                        <TaskGroup
                            tasks={tasks.filter(task => task.group?.task_type_id === 4)}
                            name="โสตทัศนอุปกรณ์"
                        />
                    </Row>
                )}
            </div>
        </div>
    )
}

export default TaskSummary