import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import topLevelAwait from 'vite-plugin-top-level-await'
import manifest from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },

    plugins: [
      topLevelAwait({
        promiseExportName: '__dv',
        promiseImportName: (i) => `__dv_${i}`,
      }),
      crx({ manifest }),
    ],
  }
})
