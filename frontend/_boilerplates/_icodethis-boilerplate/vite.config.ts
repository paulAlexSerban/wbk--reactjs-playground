import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const packageJson = require('./package.json');
const PROJECT_NAME = packageJson.name.split('/').pop();
const BASE_URL = process.env.BASE_URL || '/';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const config = {
        plugins: [react()],
        base: '/',
    };

    if (command !== 'serve') {
        config.base = `${BASE_URL}apps/${PROJECT_NAME}`;
    }

    return config;
});
