import React from 'react'
import { currency } from '../../utils'

const BudgetBullet = ({ budgets, total }: any) => {
    return (
        <div className="ml-1 w-[88%]">
            <ul>
                {budgets && budgets.map((item, index) => (
                    <li className="flex" key={item.id}>
                        <div className="flex flex-col">
                            <span className="mr-1">
                                {index+1}.<span className="text-blue-500">{item.budget?.activity?.name}</span>
                            </span>
                            <span className="font-thin text-xs ml-2">
                                ({item.budget?.activity?.project?.plan?.name})
                                {/* / {item.budget?.activity?.project?.name} */}
                            </span>
                        </div>
                        <span className="ml-1">
                            <b>งบประมาณ</b> {currency.format(item?.total)} <b>บาท</b>
                        </span>
                    </li>
                ))}
            </ul>
            <p className="ml-2">
                <b>รวมงบประมาณทั้งสิ้น</b> {currency.format(total)} <b>บาท</b>
            </p>
        </div>
    )
}

export default BudgetBullet