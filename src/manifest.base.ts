import { ManifestV3Export, defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export const extendBaseManifest = (manifest: Partial<ManifestV3Export>) =>
  defineManifest({
    ...baseManifest,
    ...manifest,
  })

const baseManifest = {
  name: 'Davout',
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'icons/logo-16.png',
    32: 'icons/logo-32.png',
    48: 'icons/logo-48.png',
    128: 'icons/logo-128.png',
  },
  content_scripts: [
    {
      matches: ['*://*.twitch.tv/*'],
      js: ['src/contentScript/index.ts'],
      css: ['css/index.css'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'img/iron.png',
        'img/bronze.png',
        'img/silver.png',
        'img/gold.png',
        'img/emerald.png',
        'img/platinum.png',
        'img/diamond.png',
        'img/master.png',
        'img/grandmaster.png',
        'img/challenger.png',
        'img/unranked.png',
        'css/index.css',
      ],
      matches: ['*://*.twitch.tv/*'],
    },
  ],
  host_permissions: ['*://*.twitch.tv/*'],
  externally_connectable: {
    matches: ['https://davout.io/*'],
  },
}
