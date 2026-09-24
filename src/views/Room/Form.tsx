import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import Loading from '../../components/ui/Loading'
import { store, update } from '../../features/slices/room/roomSlice'

const roomSchema = Yup.object().shape({
    name: Yup.string().required()
});

const RoomForm = ({ room, handleCancel }: any) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: any) => state.room);

    const handleSubmit = (values, props) => {
        if (room) {
            dispatch(update({ id: room.id, data: values }));

            handleCancel()
        } else {
            dispatch(store(values));
        }

        props.resetForm();
    };

    return (
        <div className="my-2">
            <Formik
                enableReinitialize
                initialValues={{
                    name: room ? room.name : '',
                    status: room ? (room.status === 1 ? true : false) : false,
                }}
                validationSchema={roomSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => {
                    return (
                        <Form className="form-inline">
                            <div className="flex flex-row items-center gap-4">
                                <div className="w-4/12">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="form-control w-full"
                                        placeholder="ห้อง"
                                    />
                                    {(formik.errors.name && formik.touched.name) && (
                                        <span className="text-red-500 text-sm">{formik.errors.name as string}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="status"
                                    /> ใช้งานอยู่
                                </div>
                                <div className="flex gap-1">
                                    <button type="submit" className={`btn ${room ? 'btn-outline-warning' : 'btn-outline-primary'}`}>
                                        {loading && <Loading />}
                                        {room ? 'แก้ไขห้อง' : 'เพิ่มห้อง'}
                                    </button>
                                    {room && (
                                        <button type="button" className="btn btn-outline-danger" onClick={handleCancel}>
                                            ยกเลิก
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default RoomForm
