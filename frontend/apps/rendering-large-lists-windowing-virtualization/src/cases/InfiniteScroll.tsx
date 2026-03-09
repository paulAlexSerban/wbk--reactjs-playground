import { type FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Data } from './Data.type';

// Type assertion to bypass React 18 compatibility issues
const InfiniteScrollWrapper = InfiniteScroll as any;

const InfiniteScrollComponent: FC<{ data: Data }> = ({ data }) => {
    const showItems = (posts: Data) => {
        var items = [];
        for (var i = 0; i < records; i++) {
            items.push(
                <div className="post" key={posts[i].id}>
                    <h3>{`${posts[i].title} - ${posts[i].id}`}</h3>
                    <p>{posts[i].body}</p>
                </div>
            );
        }
        return items;
    };

    const itemsPerPage = 20;
    const [hasMore, setHasMore] = useState(true);
    const [records, setRecords] = useState(itemsPerPage);
    const loadMore = () => {
        if (records === data.length) {
            setHasMore(false);
        } else {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 2000);
        }
    };
    return (
        <InfiniteScrollWrapper
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={<h4 className="loader">Loading...</h4>}
            useWindow={false}
        >
            {showItems(data)}
        </InfiniteScrollWrapper>
    );
};

export default InfiniteScrollComponent;
