import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { store } from '../../features/slices/project/projectSlice';
import Form from './Form';

const AddProject = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();

    const handleSubmit = async (data: any) => {
        try {
            await dispatch(store(data)).unwrap();
            toast.success('เพิ่มข้อมูลโครงการสำเร็จ');
            navigate('/project');
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
        }
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/project' }}>โครงการ/กิจกรรม</Breadcrumb.Item>
                <Breadcrumb.Item active>เพิ่มข้อมูล</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">เพิ่มโครงการ/กิจกรรมใหม่</h2>
                    <Link to="/project" className="btn btn-secondary text-sm">
                        <i className="fas fa-arrow-left mr-1"></i> กลับหน้าหลัก
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                    <Form
                        project={null}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddProject;
