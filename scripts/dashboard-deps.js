const fs = require('fs');
const path = require('path');

const dashboardDest = path.join(__dirname, '..', 'dashboard', 'src', 'data');
const serveConfigPath = path.join(__dirname, '..', 'package', 'serve.json');
const frontendAppsSource = path.join(__dirname, '..', 'frontend', 'apps');
const frontendExperimentsSource = path.join(__dirname, '..', 'frontend', 'experiments');

const BASE_PATH = '/wbk--reactjs-forge/';
const DEFAULT_CREATED_AT = new Date(0).toISOString();
const ALLOWED_CATEGORIES = new Set([
    'Web App',
    'API',
    'Mobile',
    'Mobile App',
    'CLI Tool',
    'Library',
    'DevOps',
    'AI/ML',
    'Blockchain',
    'Game',
    'Other',
]);

const readJsonFile = async (filePath) => {
    try {
        const jsonContent = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(jsonContent);
    } catch (err) {
        console.error('Error reading the JSON file:', err);
        return null;
    }
};

const normalizeString = (value, fallback = '') => {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim();
    return normalized || fallback;
};

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.map((item) => normalizeString(item)).filter(Boolean))];
};

const isValidIsoDate = (value) => {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
};

const normalizeBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') return true;
        if (normalized === 'false') return false;
    }
    return Boolean(value);
};

const pushWarning = (warnings, warning) => {
    warnings.push(warning);
};

const normalizeCategory = (value, context, warnings) => {
    const category = normalizeString(value);
    if (!category) {
        pushWarning(warnings, `${context}: missing category. Falling back to "Web App".`);
        return 'Web App';
    }
    if (!ALLOWED_CATEGORIES.has(category)) {
        pushWarning(
            warnings,
            `${context}: unsupported category "${category}". Keeping original value; consider standardizing.`
        );
    }
    return category;
};

const normalizeCreatedAt = (value, context, warnings) => {
    if (!isValidIsoDate(value)) {
        pushWarning(warnings, `${context}: invalid or missing createdAt. Falling back to ${DEFAULT_CREATED_AT}.`);
        return DEFAULT_CREATED_AT;
    }
    return value;
};

const normalizeId = (value, slug, context, warnings) => {
    const normalized = normalizeString(value);
    if (!normalized) {
        const fallback = `${slug}-01`;
        pushWarning(warnings, `${context}: missing id. Falling back to "${fallback}".`);
        return fallback;
    }
    return normalized;
};

const normalizeSlug = (value, fallbackSlug, context, warnings) => {
    const slug = normalizeString(value, fallbackSlug);
    if (!slug) {
        pushWarning(warnings, `${context}: missing slug and folder fallback.`);
    }
    return slug;
};

const buildProjectFromPackage = (pkg, fallbackSlug, sourceType, warnings) => {
    const context = `${sourceType}/${fallbackSlug}`;
    const slug = normalizeSlug(pkg.slug, fallbackSlug, context, warnings);
    const isApp = sourceType === 'app';
    const name = normalizeString(pkg.formattedName || pkg.name || slug, slug);
    const version = normalizeString(pkg.version, '0.0.0');
    const description = normalizeString(pkg.description);
    const shortDescription = normalizeString(pkg.shortDescription, description);
    const techStack = normalizeStringArray(pkg.techStack);
    const images = normalizeStringArray(pkg.images);
    const tags = normalizeStringArray(pkg.tags);
    const demoUrl = isApp ? normalizeString(pkg.demoUrl, path.join(BASE_PATH, `${slug}/`)) : '';

    return {
        name,
        version,
        description,
        slug,
        id: normalizeId(pkg.id, slug, context, warnings),
        shortDescription,
        category: normalizeCategory(pkg.category, context, warnings),
        sourceType,
        techStack,
        images,
        sourceUrl: normalizeString(pkg.sourceUrl),
        demoUrl,
        docsUrl: normalizeString(pkg.docsUrl),
        featured: normalizeBoolean(pkg.featured),
        createdAt: normalizeCreatedAt(pkg.createdAt, context, warnings),
        tags,
    };
};

const processDirectories = async (source, sourceType) => {
    const projects = [];
    const warnings = [];
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
                        projects.push(buildProjectFromPackage(pkg, file, sourceType, warnings));
                    }
                } else {
                    pushWarning(warnings, `${sourceType}/${file}: missing package.json, skipped.`);
                }
            }
        }
    } catch (err) {
        console.error('Error reading the directory:', err);
    }
    return { projects, warnings };
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
        console.log('Generating dashboard metadata and serve.json...');
        const { projects: appProjects, warnings: appWarnings } = await processDirectories(frontendAppsSource, 'app');
        const { projects: experimentProjects, warnings: experimentWarnings } = await processDirectories(
            frontendExperimentsSource,
            'experiment'
        );
        const warnings = [...appWarnings, ...experimentWarnings];
        const sortedApps = [...appProjects].sort((a, b) => a.name.localeCompare(b.name));
        const sortedExperiments = [...experimentProjects].sort((a, b) => a.name.localeCompare(b.name));
        const projects = [...appProjects, ...experimentProjects].sort((a, b) => a.name.localeCompare(b.name));

        // Write split metadata for scalable loading strategies.
        await fs.promises.writeFile(`${dashboardDest}/projects.apps.json`, JSON.stringify(sortedApps, null, 2));
        await fs.promises.writeFile(
            `${dashboardDest}/projects.experiments.json`,
            JSON.stringify(sortedExperiments, null, 2)
        );

        // Write merged projects.json for backward compatibility.
        await fs.promises.writeFile(`${dashboardDest}/projects.json`, JSON.stringify(projects, null, 2));

        // Generate and write serve.json for routing
        const serveConfig = generateServeConfig(appProjects);

        await fs.promises.writeFile(serveConfigPath, JSON.stringify(serveConfig, null, 2));

        console.log('Generated serve.json with rewrites for:', appProjects.map((c) => c.slug).join(', '));
        console.log(
            `Generated metadata files: projects.json, projects.apps.json, projects.experiments.json (${projects.length} total projects).`
        );
        if (warnings.length > 0) {
            console.warn(`Metadata normalization warnings (${warnings.length}):`);
            for (const warning of warnings) {
                console.warn(` - ${warning}`);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
};

init();
