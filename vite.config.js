import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@tabler/icons-react':
                '@tabler/icons-react/dist/esm/icons/index.mjs',
        },
    },
    server: {
        host: 'localhost',
        port: 5173,
    },
});
