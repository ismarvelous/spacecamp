window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#options-list li").forEach((item) => {
        item.addEventListener("click", async (event) => {
            // Get the data-value attribute
            const dataValue = item.getAttribute('data-value');

            // Send the message to the content script
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "navigationItemClicked", value: dataValue });

                chrome.windows.update(tabs[0].windowId, { focused: true }, () => {
                    window.close();
                });
            });
        });
    });
});