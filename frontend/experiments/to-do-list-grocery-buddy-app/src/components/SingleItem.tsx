import { FC } from 'react';
import { SingleItem as SingleItemType } from '../App';

type SingleItemProps = {
    item: SingleItemType;
    removeItem: (itemId: string) => void;
    editItem: (itemId: string) => void;
};

const SingleItem: FC<SingleItemProps> = ({ item, removeItem, editItem }) => {
    return (
        <div className="single-item">
            <input type="checkbox" checked={item.completed} onChange={() => editItem(item.id)} />
            <p
                style={{
                    textTransform: 'capitalize',
                    textDecoration: item.completed ? 'line-through' : 'none',
                }}
            >
                {item.name}
            </p>
            <button className="btn remove-btn" type="button" onClick={() => removeItem(item.id)}>
                delete
            </button>
        </div>
    );
};
export default SingleItem;
