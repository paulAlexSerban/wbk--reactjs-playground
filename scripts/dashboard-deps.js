const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'package', 'wbk--reactjs-playground', 'apps');
const dest = path.join(__dirname, '..', 'package', 'wbk--reactjs-playground', 'apps');
const dashboardDest = path.join(__dirname, '..', 'dashboard', 'src', 'data');
const serveConfigPath = path.join(__dirname, '..', 'package', 'serve.json');

const BASE_PATH = '/wbk--reactjs-playground/apps/';

// if the destination directory does not exist, create it
if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
}

const readJsonFile = async (filePath) => {
    try {
        const jsonContent = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(jsonContent);
    } catch (err) {
        console.error('Error reading the JSON file:', err);
        return null;
    }
};

const processDirectories = async (source) => {
    const componentLists = [];
    try {
        const files = await fs.promises.readdir(source);
        for (const file of files) {
            const dirPath = path.join(source, file);
            const stats = await fs.promises.stat(dirPath);

            if (stats.isDirectory()) {
                const jsonFiles = (await fs.promises.readdir(dirPath)).filter((f) => {
                    return path.basename(f) === 'meta.json';
                });
                if (jsonFiles.length > 0) {
                    for (const jsonFile of jsonFiles) {
                        const filePath = path.join(dirPath, jsonFile);
                        const obj = await readJsonFile(filePath);
                        obj.demoUrl = obj.demoUrl === '' ? path.join(BASE_PATH, `${obj.slug}/`) : obj.demoUrl;
                        if (obj) {
                            componentLists.push(obj);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error reading the directory:', err);
    }
    return componentLists;
};

const generateServeConfig = (componentLists) => {
    const rewrites = componentLists.map((component) => {
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
        const componentLists = await processDirectories(source);

        // Write projects.json for dashboard
        await fs.promises.writeFile(`${dashboardDest}/projects.json`, JSON.stringify(componentLists, null, 2));

        // Generate and write serve.json for routing
        const serveConfig = generateServeConfig(componentLists);

        await fs.promises.writeFile(serveConfigPath, JSON.stringify(serveConfig, null, 2));

        console.log(
            'Generated serve.json with rewrites for:',
            componentLists.map((c) => c.name.split('/').pop()).join(', ')
        );
    } catch (err) {
        console.error('Error:', err);
    }
};

init();
