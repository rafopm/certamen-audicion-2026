import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/certamen-audicion-2026/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        proyector: './proyector.html'
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true
  }
}));