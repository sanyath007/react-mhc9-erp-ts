import React, { useState } from 'react'
import { currency, toShortTHDate, replaceExpensePattern } from '../../../utils'
// import ModalDetailList from './ModalDetailList'

const LoanListDetail = ({ items }: any) => {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className="detail__list-container">
            <ul className="overflow-hidden text-sm font-thin">
                {items && items.map((item, index) => {
                    if (index < 2) {
                        return (
                            <li key={item.id} className="break-words text-xs">
                                <span className="mr-1">{index+1}.{item.expense?.name}</span>
                                {item.description && (
                                    <span className="text-red-500">
                                        {item.expense?.pattern
                                            ? replaceExpensePattern(item.expense?.pattern, item.description)
                                            : item.description
                                        }
                                    </span>
                                )}
                                <span className="ml-2">{currency.format(item.total)} บาท</span>
                            </li>
                        )
                    }
                })}
            </ul>
            {items.length > 2 && (
                <span className="cursor-pointer hover:underline p-1 text-xs" onClick={() => setShowAll(true)}>
                    ดูเพิ่มเติม <i className="fas fa-arrow-circle-right"></i>
                </span>
            )}

            {/* <ModalDetailList
                isShow={showAll}
                onHide={() => setShowAll(false)}
                items={items}
            /> */}
        </div>
    )
}

export default LoanListDetail