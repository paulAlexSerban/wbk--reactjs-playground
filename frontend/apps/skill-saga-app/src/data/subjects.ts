import { categories_map } from './categories';

const subjects = [
    {
        id: 1,
        name: 'TypeScript',
        slug: 'typescript',
        categories: [categories_map['static-typing']],
    },
];

const subjects_map = subjects.reduce((acc: { [key: string]: (typeof subjects)[0] }, subject) => {
    acc[subject.slug] = subject;
    return acc;
}, {});

export { subjects, subjects_map };
