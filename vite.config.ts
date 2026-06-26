import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import tailwindAutoReference from 'vite-plugin-vue-tailwind-auto-reference';

export default defineConfig({
  plugins: [vue(), tailwindcss(), tailwindAutoReference()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // @ 指向 src 目录
    }
  }
})