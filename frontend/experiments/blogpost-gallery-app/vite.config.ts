import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeMetaPlugin } from './writeMeta.plugin';
import path from 'path';
import packageJson from './package.json';

const SLUG = packageJson.name.split('/').pop();

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const DOMAIN_PATH = command === 'serve' ? '/' : `/wbk--reactjs-playground/apps/${SLUG}`;

    const config = {
        plugins: [react(), writeMetaPlugin()],
        base: DOMAIN_PATH,
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        define: {
            'import.meta.env.VITE_DOMAIN_PATH': JSON.stringify(DOMAIN_PATH),
        },
    };

    return config;
});
