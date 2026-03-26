import { fields_map } from './fields';

const categories = [
    {
        id: 1,
        name: 'Static Typing',
        slug: 'static-typing',
        fields: [fields_map['javascript']],
    },
];

const categories_map = categories.reduce((acc: { [key: string]: (typeof categories)[0] }, category) => {
    acc[category.slug] = category;
    return acc;
}, {});

export { categories, categories_map };
