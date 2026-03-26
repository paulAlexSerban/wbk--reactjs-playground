import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

import packageJson from './package.json';
const PROJECT_NAME = packageJson.name.split('/').pop();

type ProjectCategory =
    | 'Web App'
    | 'API'
    | 'Mobile'
    | 'CLI Tool'
    | 'Library'
    | 'DevOps'
    | 'AI/ML'
    | 'Blockchain'
    | 'Game'
    | 'Other';

interface Project {
    id: string;
    version: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: ProjectCategory;
    techStack: string[];
    images: string[];
    sourceUrl?: string;
    demoUrl?: string;
    docsUrl?: string;
    featured: boolean;
    createdAt: string;
    tags: string[];
}

// Custom plugin to write package.json data to meta.json
export const writeMetaPlugin = (): Plugin => {
    return {
        name: 'vite-plugin-write-meta',
        enforce: 'post',
        apply: 'build', // This ensures the plugin is only applied during build and not during serve
        writeBundle() {
            const packageJsonPath = path.resolve(__dirname, './package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            // Define the data you want to include in meta.json
            const metaData: Project = {
                name: packageJson?.formattedName,
                version: packageJson.version,
                description: packageJson.description,
                slug: PROJECT_NAME || '',
                id: packageJson.id || '',
                shortDescription: packageJson?.shortDescription || '',
                category: packageJson?.category || 'Other',
                techStack: packageJson?.techStack || [],
                images: packageJson?.images || [],
                sourceUrl: packageJson?.repository?.url || '',
                demoUrl: packageJson?.demoUrl || '',
                docsUrl: packageJson?.docsUrl || '',
                featured: packageJson?.featured || false,
                createdAt: packageJson?.createdAt || new Date().toISOString(),
                tags: packageJson?.tags || [],
            };
            const outputPath = path.resolve(__dirname, 'dist', 'meta.json');
            // Ensure directory exists or create it
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify(metaData, null, 2));
            console.log(`Meta data written to ${outputPath}`);
        },
    };
};
