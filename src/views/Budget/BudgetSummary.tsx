import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaChartPie, FaLandmark, FaRegUser, FaRandom } from 'react-icons/fa'
import { getAllBudgetsOfYear } from '../../features/slices/budget/budgetSlice'
import { currency } from '../../utils/index'
import StatCard from '../../components/ui/StatCard'
const BudgetSummary = ({ year }: any) => {
    const dispatch = useDispatch<any>();
    const { budgets, isLoading } = useSelector((state: any) => state.budget);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        dispatch(getAllBudgetsOfYear({ url: `/api/budgets?year=${year}` }));
        setSummary(null);
    }, [year]);

    useEffect(() => {
        if (!isLoading && (budgets && budgets.length > 0)) {
            const personnel = budgets.reduce((sum, budget) => sum += budget.budget_type_id === 1 ? parseFloat(budget.total) : 0, 0);
            const operation = budgets.reduce((sum, budget) => sum += budget.budget_type_id === 2 ? parseFloat(budget.total) : 0, 0);
            const investment = budgets.reduce((sum, budget) => sum += budget.budget_type_id === 3 ? parseFloat(budget.total) : 0, 0);
            const external = budgets.reduce((sum, budget) => sum += budget.budget_type_id === 6 ? parseFloat(budget.total) : 0, 0);

            setSummary({ personnel, operation, investment, external })
        }
    }, [budgets]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {summary && Object.keys(summary).map((sum, index) => {
                const config = {
                    personnel: { title: 'งบบุคลากร', icon: <FaRegUser />, color: 'blue' },
                    operation: { title: 'งบดำเนินงาน', icon: <FaRandom />, color: 'green' },
                    investment: { title: 'งบลงทุน', icon: <FaChartPie />, color: 'amber' },
                    external: { title: 'เงินนอกงบประมาณ', icon: <FaLandmark />, color: 'purple' }
                }[sum];

                if (!config) return null;

                return (
                    <StatCard 
                        key={index}
                        title={config.title}
                        icon={config.icon}
                        target="0"
                        received={currency.format(summary[sum])}
                        colorTheme={config.color as any}
                    />
                );
            })}
        </div>
    )
}

export default BudgetSummary