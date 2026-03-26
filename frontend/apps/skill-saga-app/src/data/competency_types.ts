const competency_types = [
    {
        id: 1,
        name: 'Technical',
        slug: 'technical',
    },
    {
        id: 2,
        name: 'Soft Skills',
        slug: 'soft-skills',
    },
    {
        id: 3,
        name: 'Analytical',
        slug: 'analytical',
    },
    {
        id: 4,
        name: 'Problem Solving',
        slug: 'problem-solving',
    },
    {
        id: 5,
        name: 'Project Management',
        slug: 'project-management',
    },
    {
        id: 6,
        name: 'Collaboration',
        slug: 'collaboration',
    },
    {
        id: 7,
        name: 'Leadership',
        slug: 'leadership',
    },
    {
        id: 8,
        name: 'Mentoring',
        slug: 'mentoring',
    },
    {
        id: 9,
        name: 'Decision Making',
        slug: 'decision-making',
    },
    {
        id: 10,
        name: 'Communication',
        slug: 'communication',
    },
    {
        id: 11,
        name: 'Creativity',
        slug: 'creativity',
    },
    {
        id: 12,
        name: 'Business Acumen',
        slug: 'business-acumen',
    },
    {
        id: 13,
        name: 'Adaptability',
        slug: 'adaptability',
    },
    {
        id: 14,
        name: 'Innovation',
        slug: 'innovation',
    },
];

const competency_types_map = competency_types.reduce(
    (acc: { [key: string]: (typeof competency_types)[0] }, competency_type) => {
        acc[competency_type.slug] = competency_type;
        return acc;
    },
    {}
);

export { competency_types, competency_types_map };
