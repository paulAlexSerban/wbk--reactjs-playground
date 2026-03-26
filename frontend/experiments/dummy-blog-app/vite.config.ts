import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const PORT = parseInt(process.env.PORT) || 3000;

if (isNaN(PORT)) {
    throw new Error('Invalid PORT');
}

export default defineConfig(() => {
    const config = {
        plugins: [react()],
        base: '/',
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
    };

    return config;
});
