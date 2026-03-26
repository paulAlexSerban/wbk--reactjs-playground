import { competency_types_map } from './competency_types';
const competencies = [
    {
        id: 1,
        name: 'Programming Languages',
        slug: 'programming-languages',
        competency_type: competency_types_map['technical'],
    },
    {
        id: 2,
        name: 'Data Structures & Algorithms',
        slug: 'data-structures-algorithms',
        competency_type: competency_types_map['technical'],
    },
    {
        id: 3,
        name: 'Web Development',
        slug: 'web-development',
        competency_type: competency_types_map['technical'],
    },
    {
        id: 4,
        name: 'Mobile Development',
        slug: 'mobile-development',
        competency_type: competency_types_map['technical'],
    },
    {
        id: 5,
        name: 'Software Design Patterns',
        slug: 'software-design-patterns',
        competency_type: competency_types_map['technical'],
    },
];

const competencies_map = competencies.reduce((acc: { [key: string]: (typeof competencies)[0] }, competency) => {
    acc[competency.slug] = competency;
    return acc;
}, {});

export { competencies, competencies_map };
