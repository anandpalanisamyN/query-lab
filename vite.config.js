import { cpSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';

const rootJsFiles = readdirSync('.').filter(
  (file) => file.endsWith('.js') && file !== 'vite.config.js'
);

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  server: {
    allowedHosts: ['.ngrok-free.app'],
  },
  plugins: [
    {
      name: 'copy-root-js',
      closeBundle() {
        for (const file of rootJsFiles) {
          cpSync(file, join('dist', file));
        }
      },
    },
  ],
});
