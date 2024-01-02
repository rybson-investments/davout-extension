import { ManifestV3Export, crx, defineManifest } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import zipPack from 'vite-plugin-zip-pack'
import firefoxManifest from './src/manifest.firefox'
import chromeManifest from './src/manifest.chrome'

const browserTarget = process.env.BROWSER_TARGET

const prepareConfig = (manifest: ManifestV3Export) => {
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
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  if (browserTarget === 'chrome') {
    return prepareConfig(chromeManifest)
  }

  if (browserTarget === 'firefox') {
    return prepareConfig(firefoxManifest)
  }
})
