chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openTimeRegistrationUrl") {
        chrome.tabs.create({ url: request.url });
    }
});
