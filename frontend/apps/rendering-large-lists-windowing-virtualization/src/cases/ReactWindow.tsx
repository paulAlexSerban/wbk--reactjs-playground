import type { FC } from 'react';
import { type Data } from './Data.type';
// @ts-ignore - react-window has issues with TypeScript exports
import { FixedSizeList } from 'react-window';

const ReactWindow: FC<{ data: Data }> = ({ data }) => {
    // Define Row component
    const Row = ({ index, style }: any) => {
        const newStyle = {
            ...style,
            border: '1px solid black',
            padding: '1rem',
        };
        return (
            <div key={index} style={newStyle} className="post">
                <h3>{`${data[index].title}-${data[index].id}`}</h3>
                <p>{data[index].body}</p>
            </div>
        );
    };

    return (
        <FixedSizeList width={1400} height={700} itemCount={data.length} itemSize={220}>
            {Row}
        </FixedSizeList>
    );
};

export default ReactWindow;
