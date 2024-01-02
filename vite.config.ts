import { crx, defineManifest } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import zipPack from 'vite-plugin-zip-pack'
import baseManifest from './src/manifest'
import firefoxManifest from './src/manifest.firefox'
import chromeManifest from './src/manifest.chrome'

const browserTarget = process.env.BROWSER_TARGET
const manifest = baseManifest

if (browserTarget === 'chrome') {
  Object.assign(manifest, chromeManifest)
}

if (browserTarget === 'firefox') {
  Object.assign(manifest, firefoxManifest)
}

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
      crx({ manifest: defineManifest(manifest) }),
      zipPack({
        inDir: 'build/',
        outDir: './',
        outFileName: 'build.zip',
      }),
    ],
  }
})
