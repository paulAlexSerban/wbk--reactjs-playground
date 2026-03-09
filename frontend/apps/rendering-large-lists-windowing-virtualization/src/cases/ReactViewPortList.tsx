import { FC, useRef } from 'react';
import { Data } from './Data.type';

import { ViewportList } from 'react-viewport-list';

const ReactViewPortList: FC<{ data: Data }> = ({ data }) => {
    const ref = useRef(null);

    // Create an array of indices from the data
    const dataIndices = Array.from({ length: data.length }, (_, i) => i);

    // Updated the children function to accept index
    const renderItem = (index: number) => {
        const item = data[index];
        return (
            <div key={item.id} className="post">
                <h3>{`${item.title} - ${item.id}`}</h3>
                <p>{item.body}</p>
            </div>
        );
    };

    return (
        <div className="scroll-container" ref={ref}>
            {/* Updated props according to the type definitions */}
            <ViewportList viewportRef={ref} items={dataIndices} itemSize={40}>
                {renderItem}
            </ViewportList>
        </div>
    );
};

export default ReactViewPortList;
