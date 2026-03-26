import { FC } from 'react';
import SingleItem from './SingleItem';
import { Items as ItemsType } from '../App';

type ItemsProps = {
    items: ItemsType;
    removeItem: (itemId: string) => void;
    editItem: (itemId: string) => void;
};

const Items: FC<ItemsProps> = ({ items, removeItem, editItem }) => {
    return (
        <div className="items">
            {items.map((item) => {
                return <SingleItem key={item.id} item={item} removeItem={removeItem} editItem={editItem} />;
            })}
        </div>
    );
};
export default Items;
