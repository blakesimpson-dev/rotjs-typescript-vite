import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    https: true,
  },
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {},
  //     },
  //   },
  // },
})
