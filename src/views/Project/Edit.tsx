import React, { useEffect } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getProject, update } from '../../features/slices/project/projectSlice';
import Form from './Form';
import Loading from '../../components/ui/Loading';

const EditProject = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { project, isLoading } = useSelector((state: any) => state.project);

    useEffect(() => {
        if (id) {
            dispatch(getProject({ id }));
        }
    }, [dispatch, id]);

    const handleSubmit = async (data: any) => {
        try {
            await dispatch(update({ id: id as string, data })).unwrap();
            toast.success('แก้ไขข้อมูลโครงการสำเร็จ');
            navigate('/project');
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
        }
    };

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/project' }}>โครงการ/กิจกรรม</Breadcrumb.Item>
                <Breadcrumb.Item active>แก้ไขข้อมูล</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">แก้ไขโครงการ/กิจกรรม</h2>
                    <Link to="/project" className="btn btn-secondary text-sm">
                        <i className="fas fa-arrow-left mr-1"></i> กลับหน้าหลัก
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                    {isLoading || !project ? (
                        <div className="flex justify-center p-8">
                            <Loading />
                        </div>
                    ) : (
                        <Form
                            project={project}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProject;
