import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Row, Col } from 'react-bootstrap';
import { getProject } from '../../features/slices/project/projectSlice';
import Loading from '../../components/ui/Loading';
import { toShortTHDate } from '../../utils';
import BudgetTypeBadge from '../../components/Badges/BudgetTypeBadge';

const ProjectDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const { project, isLoading } = useSelector((state: any) => state.project);

    useEffect(() => {
        if (id) {
            dispatch(getProject({ id }));
        }
    }, [dispatch, id]);

    if (isLoading) return <div className="text-center mt-5"><Loading /></div>;
    if (!project) return <div className="text-center mt-5">ไม่พบข้อมูลโครงการ</div>;

    return (
        <div className="content-wrapper">
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>หน้าหลัก</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/project' }}>โครงการ/กิจกรรม</Breadcrumb.Item>
                <Breadcrumb.Item active>รายละเอียดโครงการ</Breadcrumb.Item>
            </Breadcrumb>

            <div className="content">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold">รายละเอียดโครงการ/กิจกรรม</h2>
                    <Link to={`/project/${project?.id}/edit`} className="btn btn-warning text-sm">
                        แก้ไข
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 text-sm">
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">ชื่อโครงการ :</Col>
                        <Col md={10}>{project?.name}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">ปีงบประมาณ :</Col>
                        <Col md={10}>{project?.year ? project?.year + 543 : '-'}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">แผนงาน :</Col>
                        <Col md={10}>
                            <div className="bg-blue-50 rounded-md p-3 mb-3 border border-blue-200 text-sm">
                                <p className="mb-1">
                                    <span className="font-semibold text-gray-700 mr-1">แผนงาน:</span>
                                    {project?.budget?.activity?.project?.plan?.plan_no} {project?.budget?.activity?.project?.plan?.name}
                                </p>
                                <p className="mb-1">
                                    <span className="font-semibold text-gray-700 mr-1">โครงการ/ผลผลิต:</span>
                                    {project?.budget?.activity?.project?.name}
                                </p>
                                <p className="mb-1">
                                    <span className="font-semibold text-gray-700 mr-1">กิจกรรม:</span>
                                    {project?.budget?.activity?.name}
                                    <BudgetTypeBadge type={project?.budget?.type} />
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">วันที่ดำเนินการ :</Col>
                        <Col md={10}>
                            {project?.from_date ? toShortTHDate(project?.from_date) : '-'} ถึง {project?.to_date ? toShortTHDate(project?.to_date) : '-'}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">เจ้าของโครงการ :</Col>
                        <Col md={10}>
                            {project?.owner?.employee ? `${project?.owner.employee.firstname} ${project?.owner.employee.lastname}` : '-'}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">หน่วยงาน :</Col>
                        <Col md={10}>{project?.division?.name || '-'}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">หมายเหตุ :</Col>
                        <Col md={10}>{project?.description || '-'}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={2} className="font-bold text-gray-700">สถานะ :</Col>
                        <Col md={10}>
                            {project?.status === 1 ? (
                                <span className="badge bg-success">ใช้งาน</span>
                            ) : (
                                <span className="badge bg-danger">ยกเลิก</span>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
