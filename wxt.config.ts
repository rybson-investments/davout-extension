import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  manifestVersion: 3,
  manifest: {
    name: 'Davout',
    content_scripts: [
      {
        matches: ['*://*.twitch.tv/*'],
        js: ['contentScript.js'],
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
  },
  runner: {
    startUrls: ['https://www.twitch.tv/h2p_gucio/chat'],
  },
})
