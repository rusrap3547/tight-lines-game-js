import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  publicDir: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
