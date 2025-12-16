const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, '../../..', 'package', 'apps');
const dest = path.join(__dirname, '../../..', 'package', 'apps');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL;
const templates = require('./templates');
const utils = require('./utils');

// if the destination directory does not exist, create it
if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
}

const generateHTML = (componentLists) => {
    const transformedComponentLists = Object.entries(componentLists).map(([dir, components]) => {
        return components;
    });

    fs.promises.writeFile(`${dest}/index.json`, JSON.stringify(transformedComponentLists, null, 2));

    const libraryHTML = transformedComponentLists.map((app) => templates.generateLibraryHTML(app, BASE_URL)).join('');

    let htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
          ${templates.headHTML}
          <body class="container">
              ${templates.headerHTML}
                <main class='row gx-3 gy-3'>
                ${libraryHTML}
                </main>
              ${templates.footerHTML}
          </body>
      </html>
    `;

    return htmlTemplate;
};

const init = async () => {
    try {
        console.log('Generating index.html...');
        const componentLists = await utils.processDirectories(source);
        const htmlContent = generateHTML(componentLists);

        await fs.promises.writeFile(`${dest}/index.html`, htmlContent);
        console.log('index.html has been generated!');
    } catch (err) {
        console.error('Error:', err);
    }
};

init();
