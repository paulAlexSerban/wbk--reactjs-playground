import type { FC } from 'react';
import { Data } from './Data.type';

const Base: FC<{ data: Data }> = ({ data }) => {
    return (
        <div>
            {data.map((item) => (
                <div key={item.id} className="post">
                    <h3>
                        {item.title} - {item.id}
                    </h3>
                    <p>{item.body}</p>
                </div>
            ))}
        </div>
    );
};

export default Base;
