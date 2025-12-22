import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { writeMetaPlugin } from './writeMeta.plugin';

const PORT = parseInt(process.env.PORT) || 3000;

import packageJson from './package.json';
const SLUG = packageJson.name.split('/').pop();

if (isNaN(PORT)) {
    throw new Error('Invalid PORT');
}

export default defineConfig(({ command }) => {
    const DOMAIN_PATH = command === 'serve' ? '/' : `/wbk--reactjs-playground/apps/${SLUG}`;
    const config = {
        plugins: [react(), writeMetaPlugin()],
        base: DOMAIN_PATH,
        server: {
            port: PORT,
        },
        preview: {
            port: PORT,
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
        define: {
            'import.meta.env.VITE_DOMAIN_PATH': JSON.stringify(DOMAIN_PATH),
        },
    };

    return config;
});
