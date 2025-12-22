import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { writeMetaPlugin } from './writeMeta.plugin';
import { VitePWA } from 'vite-plugin-pwa';

import packageJson from './package.json';
const SLUG = packageJson.name.split('/').pop();

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    const DOMAIN_PATH = command === 'serve' ? '/' : `/wbk--reactjs-playground/apps/${SLUG}`;
    return {
        base: DOMAIN_PATH,
        server: {
            host: '::',
            port: 8080,
        },
        plugins: [
            react(),
            writeMetaPlugin(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
                manifest: {
                    name: 'Bloom Period Tracker',
                    short_name: 'Bloom',
                    description: 'Your private, supportive period tracking companion',
                    theme_color: '#e88a9e',
                    background_color: '#fdf8f9',
                    display: 'standalone',
                    orientation: 'portrait',
                    scope: '/',
                    start_url: '/',
                    icons: [
                        {
                            src: '/pwa-192x192.png',
                            sizes: '192x192',
                            type: 'image/png',
                        },
                        {
                            src: '/pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                        },
                        {
                            src: '/pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any maskable',
                        },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                    runtimeCaching: [
                        {
                            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'google-fonts-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 * 365,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'gstatic-fonts-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 * 365,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                    ],
                },
            }),
        ].filter(Boolean),
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
