import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'icons/logo-16.png',
    32: 'icons/logo-34.png',
    48: 'icons/logo-48.png',
    128: 'icons/logo-128.png',
  },
  content_scripts: [
    {
      matches: ['*://*.twitch.tv/*'],
      js: ['src/contentScript/index.ts'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'img/unranked.png',
        'img/loading.png',
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
      ],
      matches: ['*://*.twitch.tv/*'],
    },
  ],
  host_permissions: ['*://*.twitch.tv/*'],
  permissions: ['scripting', 'storage', 'activeTab'],
})
