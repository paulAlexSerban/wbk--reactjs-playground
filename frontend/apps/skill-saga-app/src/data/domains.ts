import { competencies_map } from './competencies';

const domains = [
    {
        id: 1,
        name: 'Programming',
        slug: 'programming',
        competencies: [
            competencies_map['programming-languages'],
            competencies_map['data-structures-algorithms'],
            competencies_map['web-development'],
            competencies_map['mobile-development'],
            competencies_map['software-design-patterns'],
        ],
    },
];

const domains_map = domains.reduce((acc: { [key: string]: (typeof domains)[0] }, domain) => {
    acc[domain.slug] = domain;
    return acc;
}, {});

export { domains, domains_map };
