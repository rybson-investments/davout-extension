export default defineBackground(() => {
  const version = browser.runtime.getManifest().version

  browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (!request) {
      return
    }

    if (request.message === 'version') {
      sendResponse({ version })
    }
  })
})
