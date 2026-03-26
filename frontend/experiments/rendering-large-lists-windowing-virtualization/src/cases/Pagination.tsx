import type { FC } from 'react';
import { Data, DataItem } from './Data.type';
import { useState, useEffect } from 'react';

import ReactPaginate from 'react-paginate';

type Pagination = {
    offset: number;
    numberPerPage: number;
    pageCount: number;
    currentData: DataItem[];
};

const Pagination: FC<{ data: Data }> = ({ data }) => {
    const [pagination, setPagination] = useState<Pagination>({
        offset: 0,
        numberPerPage: 10,
        pageCount: Math.ceil(data.length / 10),
        currentData: [],
    });

    useEffect(() => {
        const endOffset = pagination.offset + pagination.numberPerPage;
        setPagination((prevState) => ({
            ...prevState,
            currentData: data.slice(pagination.offset, endOffset),
        }));
    }, [data, pagination.numberPerPage, pagination.offset]);

    const handlePageClick = (event: { selected: number }) => {
        const newOffset = event.selected * pagination.numberPerPage;
        setPagination({ ...pagination, offset: newOffset });
    };
    return (
        <div>
            {pagination.currentData &&
                pagination.currentData.map((item) => (
                    <div key={item.id} className="post">
                        <h3>{`${item.title} - ${item.id}`}</h3>
                        <p>{item.body}</p>
                    </div>
                ))}
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={pagination.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default Pagination;
