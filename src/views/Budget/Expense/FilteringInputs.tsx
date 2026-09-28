import React, { useState } from 'react'
import { Col, FormGroup, Row } from 'react-bootstrap'
import moment from 'moment'
import { generateQueryString } from '../../../utils'
import { useGetInitialFormDataQuery } from '../../../features/services/budget-activity/budgetActivityApi'
import Loading from '../../../components/ui/Loading'
import { usePlans, useProjects, useActivities } from '../../../hooks/useBudget'
import { X } from 'lucide-react'

const mockExpenseTypes = [
    { id: 1, label: 'ค่าตอบแทนใช้สอยและวัสดุ', name: 'ค่าตอบแทนใช้สอยและวัสดุ', budget_type_id: 2 },
    { id: 2, label: 'ค่าวัสดุ', name: 'ค่าวัสดุ', budget_type_id: 2 },
    { id: 3, label: 'ค่าสาธารณูปโภค', name: 'ค่าสาธารณูปโภค', budget_type_id: 2 },
    { id: 4, label: 'ค่าตอบแทนพนักงานราชการ', name: 'ค่าตอบแทนพนักงานราชการ', budget_type_id: 1 },
    { id: 5, label: 'เงินค่าครองชีพ', name: 'เงินค่าครองชีพ', budget_type_id: 1 },
    { id: 6, label: 'เงินสมทบกองทุนประกันสังคม', name: 'เงินสมทบกองทุนประกันสังคม', budget_type_id: 2 },
    { id: 7, label: 'ค่าล่วงเวลา', name: 'ค่าล่วงเวลา', budget_type_id: 99 },
    { id: 8, label: 'เงินช่วยการศึกษาบุตร', name: 'เงินช่วยการศึกษาบุตร', budget_type_id: 4 },
    { id: 9, label: 'ค่ารักษาพยาบาล', name: 'ค่ารักษาพยาบาล', budget_type_id: 4 },
    { id: 10, label: 'เงินนอกงบประมาณ', name: 'เงินนอกงบประมาณ', budget_type_id: 6 },
];

const FilteringInputs = ({ initialFilters, onFilter }: any) => {
    const [filters, setFilters] = useState(initialFilters);
    const { data: formData, isFetching } = useGetInitialFormDataQuery();

    const [selectedYear, setSelectedYear] = useState(initialFilters?.year)
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);

    const { data: plans, isLoading: plansLoading } = usePlans(selectedYear);
    const { data: projects, isLoading: projectsLoading } = useProjects(selectedPlan);
    const { data: activities, isLoading: activitiesLoading } = useActivities(selectedProject);

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
                        <Col className="px-1" md={8}>
                            <FormGroup className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleFilter()
                                        }
                                    }}
                                    placeholder='ค้นหาชื่อรายการ...'
                                    className='form-control text-sm'
                                />
                                {filters.name !== '' && <X
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition hover:text-gray-600 hover:font-bold cursor-pointer"
                                    onClick={() => {
                                        const updated = { ...filters, name: '' };
                                        setFilters(updated);
                                        onFilter(generateQueryString(updated));
                                    }}
                                />}
                            </FormGroup>
                        </Col>
                        <Col className="px-1" md={4}>
                            <FormGroup>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleInputChange}
                                    className="form-control text-sm"
                                >
                                    <option value="">-- ประเภท --</option>
                                    {mockExpenseTypes.map(type => (
                                        <option value={type.id} key={type.id}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col lg={1} className="max-lg:pr-1 lg:pl-1">
                    <div className="max-lg:float-right">
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm max-lg:ml-1"
                            onClick={() => handleClear()}
                        >
                            เคลียร์
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default FilteringInputs