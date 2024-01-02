import { extendBaseManifest } from './manifest.base'

export default extendBaseManifest({
  background: {
    service_worker: 'src/background/index.ts',
  },
})
