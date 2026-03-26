import { domains_map } from './domains';

const fields = [
    {
        id: 1,
        name: 'JavaScript',
        slug: 'javascript',
        domains: [domains_map['programming']],
    },
];

const fields_map = fields.reduce((acc: { [key: string]: (typeof fields)[0] }, field) => {
    acc[field.slug] = field;
    return acc;
}, {});

export { fields, fields_map };
