import React from 'react'
import { Pagination as BsPagination } from 'react-bootstrap'

const Pagination = ({ pager, onPageClick }) => {
    const handlePageClick = (url) => {
        onPageClick(url);
    };

    return (
        <>
            {(pager && pager.last_page > 1) && (
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    <div className="text-sm font-thin flex flex-row items-center justify-between gap-4 w-3/5">
                        <span>หน้าที่ {pager.current_page}/{pager.last_page}</span>
                        <span>จำนวนทั้งสิ้น {pager.total} รายการ</span>
                    </div>

                    <BsPagination>
                        <BsPagination.First disabled={pager.current_page === 1} onClick={() => handlePageClick(pager.first_page_url)} />
                        <BsPagination.Prev disabled={!pager.prev_page_url} onClick={() => handlePageClick(pager.prev_page_url)} />
                        {/* <BsPagination.Item>{1}</BsPagination.Item>
                        <BsPagination.Ellipsis />

                        <BsPagination.Item>{10}</BsPagination.Item>
                        <BsPagination.Item>{11}</BsPagination.Item>
                        <BsPagination.Item active>{12}</BsPagination.Item>
                        <BsPagination.Item>{13}</BsPagination.Item>
                        <BsPagination.Item disabled>{14}</BsPagination.Item>

                        <BsPagination.Ellipsis />
                        <BsPagination.Item>{20}</BsPagination.Item> */}
                        <BsPagination.Next disabled={!pager.next_page_url} onClick={() => handlePageClick(pager.next_page_url)} />
                        <BsPagination.Last disabled={pager.current_page === pager.last_page} onClick={() => handlePageClick(pager.last_page_url)} />
                    </BsPagination>
                </div>
            )}
        </>
    )
}

export default Pagination