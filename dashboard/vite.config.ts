import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const DOMAIN_PATH = command === 'serve' ? '/' : `/wbk--reactjs-playground/`;
    return {
        server: {
            host: '::',
            port: 8080,
        },
        plugins: [react()].filter(Boolean),
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
});
