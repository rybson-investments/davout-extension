const version = chrome.runtime.getManifest().version

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (!request) {
    return
  }

  if (request.message === 'version') {
    sendResponse({ version })
  }
})
