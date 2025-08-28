chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEmailContent") {
        const emailContent = document.querySelector('.ii.gt') ? document.querySelector('.ii.gt').innerText : '';
        sendResponse({ content: emailContent });
    }
});