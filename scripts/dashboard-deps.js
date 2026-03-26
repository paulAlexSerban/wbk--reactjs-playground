const fs = require('fs');
const path = require('path');

const dashboardDest = path.join(__dirname, '..', 'dashboard', 'src', 'data');
const serveConfigPath = path.join(__dirname, '..', 'package', 'serve.json');
const frontendAppsSource = path.join(__dirname, '..', 'frontend', 'apps');
const frontendExperimentsSource = path.join(__dirname, '..', 'frontend', 'experiments');

const BASE_PATH = '/wbk--reactjs-playground/apps/';

const readJsonFile = async (filePath) => {
    try {
        const jsonContent = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(jsonContent);
    } catch (err) {
        console.error('Error reading the JSON file:', err);
        return null;
    }
};

const normalizeArray = (value) => {
    return Array.isArray(value) ? value : [];
};

const buildProjectFromPackage = (pkg, fallbackSlug, sourceType) => {
    const slug = pkg.slug || fallbackSlug;
    const isApp = sourceType === 'app';

    return {
        name: pkg.formattedName || pkg.name || slug,
        version: pkg.version || '0.0.0',
        description: pkg.description || '',
        slug,
        id: pkg.id || `${slug}-01`,
        shortDescription: pkg.shortDescription || pkg.description || '',
        category: pkg.category || 'Web App',
        sourceType,
        techStack: normalizeArray(pkg.techStack),
        images: normalizeArray(pkg.images),
        sourceUrl: pkg.sourceUrl || '',
        demoUrl: isApp ? pkg.demoUrl || path.join(BASE_PATH, `${slug}/`) : '',
        docsUrl: pkg.docsUrl || '',
        featured: Boolean(pkg.featured),
        createdAt: pkg.createdAt || new Date(0).toISOString(),
        tags: normalizeArray(pkg.tags),
    };
};

const processDirectories = async (source, sourceType) => {
    const projects = [];
    try {
        const files = await fs.promises.readdir(source);
        for (const file of files) {
            const dirPath = path.join(source, file);
            const stats = await fs.promises.stat(dirPath);

            if (stats.isDirectory()) {
                const packageJsonPath = path.join(dirPath, 'package.json');
                if (fs.existsSync(packageJsonPath)) {
                    const pkg = await readJsonFile(packageJsonPath);
                    if (pkg) {
                        projects.push(buildProjectFromPackage(pkg, file, sourceType));
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error reading the directory:', err);
    }
    return projects;
};

const generateServeConfig = (appProjects) => {
    const rewrites = appProjects.map((component) => {
        const slug = component.slug;
        return {
            source: path.join(BASE_PATH, `${slug}/**`),
            destination: path.join(BASE_PATH, `${slug}/index.html`),
        };
    });
    return { rewrites };
};

const init = async () => {
    try {
        console.log('Generating projects.json and serve.json...');
        const appProjects = await processDirectories(frontendAppsSource, 'app');
        const experimentProjects = await processDirectories(frontendExperimentsSource, 'experiment');
        const projects = [...appProjects, ...experimentProjects].sort((a, b) => a.name.localeCompare(b.name));

        // Write projects.json for dashboard
        await fs.promises.writeFile(`${dashboardDest}/projects.json`, JSON.stringify(projects, null, 2));

        // Generate and write serve.json for routing
        const serveConfig = generateServeConfig(appProjects);

        await fs.promises.writeFile(serveConfigPath, JSON.stringify(serveConfig, null, 2));

        console.log('Generated serve.json with rewrites for:', appProjects.map((c) => c.slug).join(', '));
        console.log(
            `Generated projects.json with ${projects.length} total projects (${appProjects.length} apps, ${experimentProjects.length} experiments).`
        );
    } catch (err) {
        console.error('Error:', err);
    }
};

init();
