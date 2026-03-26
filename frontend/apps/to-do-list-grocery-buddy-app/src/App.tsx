import { useState } from 'react';
import Form from './components/Form';
import { nanoid } from 'nanoid';
import Items from './components/Items';
import { ToastContainer, toast } from 'react-toastify';

export type SingleItem = {
    name: string;
    completed: boolean;
    id: string;
};

export type Items = SingleItem[];

// const getLocalStorage = () => {
//   let list = localStorage.getItem('list');
//   if (list) {
//     list = JSON.parse(localStorage.getItem('list'));
//   } else {
//     list = [];
//   }
//   return list;
// };

const setLocalStorage = (items: Items) => {
    localStorage.setItem('list', JSON.stringify(items));
};
const defaultList = JSON.parse(localStorage.getItem('list') || '[]');
const App = () => {
    const [items, setItems] = useState(defaultList);

    const addItem = (itemName: string) => {
        const newItem = {
            name: itemName,
            completed: false,
            id: nanoid(),
        };
        const newItems: Items = [...items, newItem];
        setItems(newItems);
        setLocalStorage(newItems);
        toast.success('item added to the list');
    };

    const removeItem = (itemId: string) => {
        const newItems = items.filter((item: SingleItem) => item.id !== itemId);
        setItems(newItems);
        setLocalStorage(newItems);
        toast.success('item deleted');
    };

    const editItem = (itemId: string) => {
        const newItems = items.map((item: SingleItem) => {
            if (item.id === itemId) {
                const newItem = { ...item, completed: !item.completed };
                return newItem;
            }
            return item;
        });
        setItems(newItems);
        setLocalStorage(newItems);
    };
    return (
        <section className="section-center">
            <ToastContainer position="top-center" />
            <Form addItem={addItem} />
            <Items items={items} removeItem={removeItem} editItem={editItem} />
        </section>
    );
};
export default App;
