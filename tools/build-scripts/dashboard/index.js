const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../../..', 'package', 'apps');
const dest = path.join(__dirname, '../../..', 'package', 'apps');
const dashboardDest = path.join(__dirname, '../../..', 'dashboard', 'src', 'data');

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
                    return path.extname(f).toLowerCase() === '.json';
                });
                if (jsonFiles.length > 0) {
                    for (const jsonFile of jsonFiles) {
                        const filePath = path.join(dirPath, jsonFile);
                        const obj = await readJsonFile(filePath);
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

const init = async () => {
    try {
        console.log('Generating index.html...');
        const componentLists = await processDirectories(source);
        fs.promises.writeFile(`${dashboardDest}/projects.json`, JSON.stringify(componentLists, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
};

init();
