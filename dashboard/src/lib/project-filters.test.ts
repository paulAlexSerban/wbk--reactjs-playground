import assert from 'node:assert/strict';
import test from 'node:test';
import { FilterState, Project } from '@/types/project';
import { filterProjects, fuzzyMatch, paginateProjects, sortProjects } from './project-filters';

const baseFilters: FilterState = {
    search: '',
    categories: [],
    techStack: [],
    sortBy: 'featured',
    sortOrder: 'desc',
    sourceType: 'all',
};

const sampleProjects: Project[] = [
    {
        id: 'alpha-01',
        name: 'Alpha App',
        slug: 'alpha-app',
        description: 'A React learning app',
        shortDescription: 'React app',
        category: 'Web App',
        sourceType: 'app',
        techStack: ['React', 'TypeScript'],
        images: [],
        sourceUrl: '',
        demoUrl: '/apps/alpha-app/',
        docsUrl: '',
        featured: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        tags: ['react'],
    },
    {
        id: 'beta-01',
        name: 'Beta Experiment',
        slug: 'beta-experiment',
        description: 'Virtualized list benchmark',
        shortDescription: 'Perf experiment',
        category: 'Web App',
        sourceType: 'experiment',
        techStack: ['React', 'Vite'],
        images: [],
        sourceUrl: '',
        demoUrl: '',
        docsUrl: '',
        featured: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        tags: ['performance'],
    },
    {
        id: 'gamma-01',
        name: 'Gamma Tool',
        slug: 'gamma-tool',
        description: 'API helper utilities',
        shortDescription: 'Utilities',
        category: 'API',
        sourceType: 'app',
        techStack: ['Node', 'TypeScript'],
        images: [],
        sourceUrl: '',
        demoUrl: '/apps/gamma-tool/',
        docsUrl: '',
        featured: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        tags: ['api'],
    },
];

test('fuzzyMatch supports in-order fuzzy matching', () => {
    assert.equal(fuzzyMatch('virtualization', 'vrtlzn'), true);
    assert.equal(fuzzyMatch('react', 'rctx'), false);
});

test('filterProjects filters by sourceType', () => {
    const filtered = filterProjects(sampleProjects, { ...baseFilters, sourceType: 'experiment' });
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, 'beta-01');
});

test('filterProjects combines search and tech stack filters', () => {
    const filtered = filterProjects(sampleProjects, {
        ...baseFilters,
        search: 'react',
        techStack: ['TypeScript'],
    });

    assert.deepEqual(
        filtered.map((project) => project.id),
        ['alpha-01']
    );
});

test('sortProjects sorts by date ascending and descending', () => {
    const asc = sortProjects(sampleProjects, { ...baseFilters, sortBy: 'date', sortOrder: 'asc' });
    const desc = sortProjects(sampleProjects, { ...baseFilters, sortBy: 'date', sortOrder: 'desc' });

    assert.deepEqual(
        asc.map((project) => project.id),
        ['gamma-01', 'alpha-01', 'beta-01']
    );
    assert.deepEqual(
        desc.map((project) => project.id),
        ['beta-01', 'alpha-01', 'gamma-01']
    );
});

test('paginateProjects returns stable pages', () => {
    const page1 = paginateProjects(sampleProjects, 1, 2);
    const page2 = paginateProjects(sampleProjects, 2, 2);

    assert.deepEqual(
        page1.map((project) => project.id),
        ['alpha-01', 'beta-01']
    );
    assert.deepEqual(
        page2.map((project) => project.id),
        ['gamma-01']
    );
});
