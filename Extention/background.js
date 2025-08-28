chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeText') {
        isSpam(request.text).then(result => {
            sendResponse({ result: result });
        });
        return true; // Keep the message channel open for async response
    }
});

// Function to check if an email is spam
async function isSpam(email) {
    try {
        const response = await fetch('http://127.0.0.1:8000/predict', { // Change to your server's address
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: email }),
        });
        const data = await response.json();
        return data.result; // Should return 'Spam' or 'Not Spam'
    } catch (error) {
        console.error("Error during prediction:", error);
        return 'Error during prediction';
    }
}