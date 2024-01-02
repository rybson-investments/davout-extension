export default {
  browser_specific_settings: {
    gecko: {
      id: 'contact@davout.io',
      strict_min_version: '109.0',
    },
  },
  background: {
    scripts: ['src/background/index.ts'],
    persistent: false,
    type: 'module',
  },
}
