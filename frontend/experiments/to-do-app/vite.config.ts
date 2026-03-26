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
        server: {
            proxy: {
                // Proxying API requests
                '/api': {
                    target: 'http://node-api:5000',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    };

    // if (command !== 'serve') {
    //     config.base = `${BASE_URL}apps/${PROJECT_NAME}`;
    // }

    return config;
});
