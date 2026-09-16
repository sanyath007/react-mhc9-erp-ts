import React, { useState } from 'react'
import { Col, FormGroup, Row } from 'react-bootstrap'
import moment from 'moment'
import YearPicker from '../../../components/ui/Forms/YearPicker'
import { generateQueryString } from '../../../utils'
import { useGetInitialFormDataQuery } from '../../../features/services/budget-activity/budgetActivityApi'
import Loading from '../../../components/ui/Loading'
import { usePlans, useProjects, useActivities } from '../../../hooks/useBudget'

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);
    const { data: formData, isFetching } = useGetInitialFormDataQuery();

    const [selectedYear, setSelectedYear] = useState(initialFilters?.year)
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);

    const { data: plans, isLoading: plansLoading } = usePlans(selectedYear);
    const { data: projects, isLoading: projectsLoading } = useProjects(selectedPlan);
    const { data: activities, isLoading: activitiesLoading } = useActivities(selectedProject);
    console.log(plans);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
    };

    const handleClear = () => {
        setFilters(initialFilters);
        setSelectedYear(initialFilters?.year || moment().year());
        onFilter(generateQueryString(initialFilters));
    };

    return (
        <div className="filtering-wrapper border rounded-md py-3 px-4 mb-2">
            <Row>
                <Col lg={11}>
                    <Row>

                        <Col className="px-1 mb-2" md={8}>
                            <FormGroup>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleInputChange}
                                    placeholder="ชื่อกิจกรรม"
                                    className="form-control text-sm"
                                />
                            </FormGroup>
                        </Col>
                        <Col className="px-1 mb-2" md={4}>
                            <FormGroup>
                                <YearPicker
                                    value={selectedYear}
                                    onChange={(year: string) => {
                                        setSelectedYear(year);
                                        setFilters(prev => ({
                                            ...prev,
                                            project: '',
                                            year: year
                                        }));
                                    }}
                                    inputCss="!bg-white !h-[34px] !py-1 !px-3 !rounded-[0.375rem] !border-[#dee2e6] !text-sm w-full"
                                />
                            </FormGroup>
                        </Col>
                        <Col className="px-1 mb-2" md={6}>
                            <FormGroup>
                                <select
                                    name="plan"
                                    value={filters.plan}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setSelectedPlan(Number(e.target.value));
                                    }}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- แผนงาน --</option>
                                    {plans?.map(plan => (
                                        <option value={plan.id} key={plan.id}>
                                            {plan.plan_no} {plan.name}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                        <Col className="px-1 max-lg:mb-2" md={6}>
                            <FormGroup>
                                {projectsLoading && <div className="form-control text-sm"><Loading /></div>}
                                {!projectsLoading && (
                                    <select
                                        name="project"
                                        value={filters?.project}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setSelectedProject(Number(e.target.value));
                                        }}
                                        className="form-control text-sm"
                                    >
                                        <option value="">-- โครงการ/ผลผลิต --</option>
                                        {projects?.map(project => (
                                            <option value={project.id} key={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </FormGroup>
                        </Col>
                        <Col className="px-1 max-lg:mb-2" md={6}>
                            <FormGroup>
                                {activitiesLoading && <div className="form-control text-sm"><Loading /></div>}
                                {!activitiesLoading && (
                                    <select
                                        name="activity"
                                        value={filters?.activity}
                                        onChange={handleInputChange}
                                        className="form-control text-sm"
                                    >
                                        <option value="">-- กิจกรรม --</option>
                                        {activities?.map(activity => (
                                            <option value={activity.id} key={activity.id}>
                                                {activity.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </FormGroup>
                        </Col>
                        <Col className="px-1 max-md:mb-2" md={6}>
                            <FormGroup>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleInputChange}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- ประเภท --</option>
                                    {formData && formData.types.map(type => (
                                        <option value={type.id} key={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col lg={1} className="max-lg:pr-1 lg:pl-1">
                    <div className="max-lg:float-right">
                        <button type="button" className="btn btn-outline-secondary btn-sm lg:mb-1 px-[0.7rem]" onClick={() => handleFilter()}>
                            ค้นหา
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm max-lg:ml-1" onClick={() => handleClear()}>
                            เคลียร์
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default FilteringInputs