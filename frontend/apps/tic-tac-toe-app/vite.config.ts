import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeMetaPlugin } from './writeMeta.plugin';
import path from 'path';
import packageJson from './package.json';

const PROJECT_NAME = packageJson.name.split('/').pop();
const BASE_URL = process.env.BASE_URL || '/';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const config = {
        plugins: [react(), writeMetaPlugin()],
        base: '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    };

    if (command !== 'serve') {
        config.base = `${BASE_URL}apps/${PROJECT_NAME}`;
    }

    return config;
});
