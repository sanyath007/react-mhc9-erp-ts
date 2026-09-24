import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Row, Col, FormGroup } from 'react-bootstrap'
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'
import moment from 'moment'
import OverWriteMomentBE from '../../utils/OverwriteMomentBE'
import { store, update } from '../../features/slices/task/taskSlice'
import { useGetInitialFormDataQuery } from '../../features/services/task/taskApi'
import TaskAssetList from './Asset/List'
import TaskAssetForm from './Asset/Form'
import Loading from '../../components/ui/Loading'
import ModalEmployeeList from '../../components/Modals/EmployeeList'

const taskSchema = Yup.object().shape({
    task_date: Yup.string().required(),
    task_time: Yup.string().required(),
    task_group_id: Yup.string().required(),
    problem: Yup.string().required(),
    priority_id: Yup.string().required(),
    reporter_id: Yup.string().required(),
});

const TaskForm = ({ task }: any) => {
    const dispatch = useDispatch<any>();
    const { data: formData, isLoading } = useGetInitialFormDataQuery();
    const [assets, setAssets] = useState([]);
    const [reporter, setReporter] = useState(null);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
    const [selectedTaskDate, setSelectedTaskDate] = useState(moment());
    const [selectedTaskTime, setSelectedTaskTime] = useState(moment());
    const [selectedUseDate, setSelectedUseDate] = useState(moment());
    const [selectedUseTime, setSelectedUseTime] = useState(moment());

    /** On mount component set initital value of asset local state by task prop */
    // useEffect(() => {
    //     if (task) {
    //         const taskAssets = task?.assets.map(item => item.asset);

    //         setAssets(taskAssets);
    //         setReporter(task.reporter);
    //     }
    // }, [task]);

    /** Initial data for form's dropdown input */
    // useEffect(() => {
    //     if (formData && task) setFilteredGroups(formData.groups);
    // }, [formData]);

    const handleTypeChange = (type) => {
        const newGroups = formData.groups.filter(group => group.task_type_id === parseInt(type, 10));

        setFilteredGroups(newGroups);
    };

    const handleAddAsset = (formik, asset) => {
        formik.setFieldValue('assets', [...formik.values.assets, asset]);
        setAssets([...assets, asset]);
    }

    const handleRemoveAsset = (formik, id) => {
        const newAssets = assets.filter(asset => parseInt(asset.id, 10) !== id);

        formik.setFieldValue('assets', newAssets.length > 0 ? [...newAssets] : [])
        setAssets(newAssets);
    };

    const handleSubmit = (values, formik) => {
        if (task) {
            dispatch(update({ id: '', data: values }));
        } else {
            dispatch(store(values));
        }

        /** Clear assigned input values */
        formik.resetForm();
        setReporter(null);
        setAssets([]);
    };

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{
                    task_date: task ? moment(task.task_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                    task_time: task ? '' : '',
                    task_type_id: task ? task.group.task_type_id : '',
                    task_group_id: task ? task.task_group_id : '',
                    problem: task ? task.problem : '',
                    priority_id: task ? task.priority_id : '1',
                    use_date: task ? moment(task.use_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                    use_time: task ? '' : '',
                    reporter_id: task ? task.reporter_id : '',
                    remark: task ? task.remark : '',
                    assets: task ? task.assets : [],
                }}
                validationSchema={taskSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => {
                    return (
                        <Form>
                            <ModalEmployeeList
                                isShow={openEmployeeModal}
                                onHide={() => setOpenEmployeeModal(false)}
                                onSelect={(employee) => {
                                    formik.setFieldValue("reporter_id", employee.id);
                                    setReporter(employee);
                                }}
                            />
                            <Row className="mb-2">
                                <Col md={2}>
                                    <FormGroup>
                                        <div className="flex flex-col">
                                            <label>วันที่แจ้ง</label>
                                            <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    value={selectedTaskDate}
                                                    onChange={(date) => {
                                                        setSelectedTaskDate(date);
                                                        formik.setFieldValue('task_date', date.format('YYYY-MM-DD'));

                                                        setSelectedUseDate(date);
                                                        formik.setFieldValue('use_date', date.format('YYYY-MM-DD'));
                                                    }}
                                                    inputVariant="outlined"
                                                />
                                            </MuiPickersUtilsProvider>
                                            {(formik.errors.task_date && formik.touched.task_date) && (
                                                <span className="text-red-500 text-sm">{formik.errors.task_date as string}</span>
                                            )}
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md={2}>
                                    <FormGroup>
                                        <div className="flex flex-col">
                                            <label>เวลาที่แจ้ง</label>
                                            <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                                <TimePicker
                                                    format="HH:mm"
                                                    ampm={false}
                                                    value={selectedTaskTime}
                                                    onChange={(time) => {
                                                        const dateStr = moment(selectedTaskDate).format('YYYY-MM-DD');
                                                        const timeStr = moment(time).format('HH:mm');

                                                        /** Create newTime from selectedTaskDate and selected time from input */
                                                        const newTaskTime = moment(`${dateStr}T${timeStr}`);
                                                        const newUseTime = moment(`${dateStr}T${timeStr}`).add(1, "hours");

                                                        /** Set newTime to selectedTaskTime state and task_time field */
                                                        setSelectedTaskTime(newTaskTime);
                                                        formik.setFieldValue('task_time', newTaskTime.format('HH:mm'));

                                                        setSelectedUseTime(newUseTime);
                                                        formik.setFieldValue('use_time', newUseTime.format('HH:mm'));
                                                    }}
                                                    inputVariant="outlined"
                                                />
                                            </MuiPickersUtilsProvider>
                                        </div>
                                        {(formik.errors.task_time && formik.touched.task_time) && (
                                            <span className="text-red-500 text-sm">{formik.errors.task_time as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <label>ประเภทปัญหา</label>
                                        {isLoading && <div className="form-control text-sm font-thin"><Loading /></div>}
                                        {!isLoading && <select
                                            name="task_type_id"
                                            value={formik.values.task_type_id}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                handleTypeChange(e.target.value);
                                            }}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกประเภทปัญหา --</option>
                                            {formData.types && formData.types.map((type, index) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>}
                                        {(formik.errors.task_type_id && formik.touched.task_type_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.task_type_id as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <label>กลุ่มอาการ</label>
                                        {isLoading && <div className="form-control text-sm font-thin"><Loading /></div>}
                                        {!isLoading && <select
                                            name="task_group_id"
                                            value={formik.values.task_group_id}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        >
                                            <option value="">-- เลือกกลุ่มอาการ --</option>
                                            {filteredGroups && filteredGroups.map((group, index) => (
                                                <option key={group.id} value={group.id}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>}
                                        {(formik.errors.task_group_id && formik.touched.task_group_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.task_group_id as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={2}>
                                    <FormGroup>
                                        <div className="flex flex-col">
                                            <label>วันที่จะใช้งาน</label>
                                            <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    value={selectedUseDate}
                                                    onChange={(date) => {
                                                        setSelectedUseDate(date);
                                                        formik.setFieldValue('use_date', date.format('YYYY-MM-DD'));
                                                    }}
                                                    inputVariant="outlined"
                                                />
                                            </MuiPickersUtilsProvider>
                                            {(formik.errors.use_date && formik.touched.use_date) && (
                                                <span className="text-red-500 text-sm">{formik.errors.use_date as string}</span>
                                            )}
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md={2}>
                                    <FormGroup>
                                        <div className="flex flex-col">
                                            <label>เวลาจะใช้งาน</label>
                                            <MuiPickersUtilsProvider utils={OverWriteMomentBE} locale="th">
                                                <TimePicker
                                                    format="HH:mm"
                                                    ampm={false}
                                                    value={selectedUseTime}
                                                    onChange={(time) => {
                                                        const dateStr = moment(selectedUseDate).format('YYYY-MM-DD');
                                                        const timeStr = moment(time).format('HH:mm');

                                                        /** Create newTime from selectedUseDate and selected time from input */
                                                        const newTime = moment(`${dateStr}T${timeStr}`);

                                                        /** Set newTime to selectedUseTime state and use_time field */
                                                        setSelectedUseTime(newTime);
                                                        formik.setFieldValue('use_time', newTime.format('HH:mm'));
                                                    }}
                                                    inputVariant="outlined"
                                                />
                                            </MuiPickersUtilsProvider>
                                        </div>
                                        {(formik.errors.use_time && formik.touched.use_time) && (
                                            <span className="text-red-500 text-sm">{formik.errors.use_time as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label>ผู้แจ้ง</label>
                                        <div className="input-group">
                                            <div className="form-control text-sm font-thin min-h-[34px] bg-gray-100">
                                                {reporter && `${reporter?.prefix?.name}${reporter?.firstname} ${reporter?.lastname}`}
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setOpenEmployeeModal(true)}
                                            >
                                                ค้นหา
                                            </button>
                                        </div>
                                        {(formik.errors.reporter_id && formik.touched.reporter_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.reporter_id as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label>ความเร่งด่วน</label>
                                        <label className="form-control text-sm font-thin">
                                            <Field
                                                type="radio"
                                                name="priority_id"
                                                value="1"
                                            />
                                            <span className="ml-1 mr-4">ปกติ</span>

                                            <Field
                                                type="radio"
                                                name="priority_id"
                                                value="2"
                                            />
                                            <span className="ml-1 mr-4">ด่วน</span>

                                            <Field
                                                type="radio"
                                                name="priority_id"
                                                value="3"
                                            />
                                            <span className="ml-1 mr-4">ด่วนมาก</span>
                                        </label>
                                        {(formik.errors.priority_id && formik.touched.priority_id) && (
                                            <span className="text-red-500 text-sm">{formik.errors.priority_id as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col>
                                    <FormGroup>
                                        <label>รายละเอียด</label>
                                        <textarea
                                            rows={3}
                                            name="problem"
                                            value={formik.values.problem}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        ></textarea>
                                        {(formik.errors.problem && formik.touched.problem) && (
                                            <span className="text-red-500 text-sm">{formik.errors.problem as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label>หมายเหตุ</label>
                                        <textarea
                                            rows={3}
                                            name="remark"
                                            value={formik.values.remark}
                                            onChange={formik.handleChange}
                                            className="form-control text-sm font-thin"
                                        ></textarea>
                                        {(formik.errors.remark && formik.touched.remark) && (
                                            <span className="text-red-500 text-sm">{formik.errors.remark as string}</span>
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <div className="flex flex-col border p-2 rounded-md">
                                        <h3 className="mb-1">รายการพัสดุ (ถ้ามี)</h3>
                                        <TaskAssetForm onAdd={(asset) => handleAddAsset(formik, asset)} />

                                        <TaskAssetList
                                            assets={assets}
                                            onRemove={(id) => {
                                                handleRemoveAsset(formik, id);
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <button
                                        type="submit"
                                        className={`btn ${task ? 'btn-outline-warning' : 'btn-outline-primary'} mt-2 float-right`}
                                        disabled={formik.isSubmitting}
                                    >
                                        {task ? 'บันทึกการแกไข' : 'บันทึก'}
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default TaskForm
