document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const analyzeButton = document.getElementById('analyzeButton');
    const fetchEmailButton = document.getElementById('fetchEmailButton');
    const textInput = document.getElementById('textInput');
    const resultDiv = document.getElementById('result');
    const toggleOptionsButton = document.getElementById('toggleOptionsButton');
    const advancedOptionsContainer = document.getElementById('advancedOptionsContainer');
    const resetSettingsButton = document.getElementById('reset-settings');
    const riskFill = document.getElementById('risk-fill');
    const riskText = document.getElementById('risk-text');

    // State variables
    let isOptionsVisible = false;
    let scannedCount = 0;
    let threatCount = 0;

    // Show loading state
    function showLoading() {
        resultDiv.className = 'result loading';
        resultDiv.innerHTML = '<div class="spinner"></div>Analyzing email content...';
        analyzeButton.disabled = true;
    }

    // Hide loading state
    function hideLoading() {
        analyzeButton.disabled = false;
    }

    // Update statistics display
    function updateStats() {
        document.getElementById('scanned-count').textContent = scannedCount;
        document.getElementById('threat-count').textContent = threatCount;
    }

    // Update risk meter visualization
    function updateRiskMeter(risk) {
        const percentage = Math.round(risk * 100);
        riskFill.style.width = percentage + '%';
        
        let riskLevel = 'Low';
        if (percentage >= 70) riskLevel = 'High';
        else if (percentage >= 50) riskLevel = 'Medium';
        
        riskText.textContent = `Risk Level: ${riskLevel} (${percentage}%)`;
    }

    // Main analyze function
    analyzeButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            resultDiv.className = 'result error';
            resultDiv.textContent = 'Please enter email content to analyze.';
            return;
        }

        showLoading();
        scannedCount++;
        updateStats();

        try {
            // Make API call to spam detection service
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            hideLoading();

            // Determine if email is spam based on response
            const isSpam = data.prediction.toLowerCase().includes('spam');
            const riskScore = isSpam ? 0.85 : 0.15;
            
            // Display results
            if (isSpam) {
                threatCount++;
                resultDiv.className = 'result spam';
                resultDiv.innerHTML = `<strong>${data.prediction}</strong><br>`;
                resultDiv.style.background="red"
                resultDiv.style.color="black"
            } else {
                resultDiv.className = 'result not-spam';
                resultDiv.innerHTML = `<strong>${data.prediction}</strong><br>`  ;
                resultDiv.style.background="green"
                resultDiv.style.color="black"
            }

            updateStats();
            updateRiskMeter(riskScore);

        } catch (error) {
            hideLoading();
            console.error("Error during analysis:", error);
            resultDiv.className = 'result error';
            resultDiv.textContent = ' Analysis failed. Please check your connection and try again.';
        }
    });

    // Fetch email from active tab
    fetchEmailButton.addEventListener('click', () => {
        // Check if Chrome extension APIs are available
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "getEmailContent" }, (response) => {
                    if (chrome.runtime.lastError) {
                        resultDiv.className = 'result error';
                        resultDiv.textContent = "Error: " + chrome.runtime.lastError.message;
                        return;
                    }

                    if (response && response.content) {
                        textInput.value = response.content;
                        analyzeButton.click();
                    } else {
                        resultDiv.className = 'result error';
                        resultDiv.textContent = "Couldn't fetch email content. Make sure you're on a Gmail page with an open email.";
                    }
                });
            });
        } else {
            // Demo mode - simulate fetching email for testing
            const demoEmails = [
                "Congratulations! You've won $1,000,000! Click here to claim your prize now! This is a limited time offer that expires in 24 hours. Don't miss out!",
                "Hi there, I hope this email finds you well. I wanted to follow up on our meeting from last week and discuss the project timeline. Let me know when you're available.",
                "URGENT: Your account will be suspended! Click this link immediately to verify your information and prevent account closure. Act now!"
            ];
            
            const randomEmail = demoEmails[Math.floor(Math.random() * demoEmails.length)];
            textInput.value = randomEmail;
            analyzeButton.click();
        }
    });

    // Toggle advanced options visibility
    toggleOptionsButton.addEventListener('click', () => {
        isOptionsVisible = !isOptionsVisible;
        if (isOptionsVisible) {
            advancedOptionsContainer.classList.add('visible');
            toggleOptionsButton.textContent = 'Hide Advanced Options';
        } else {
            advancedOptionsContainer.classList.remove('visible');
            toggleOptionsButton.textContent = 'Advanced Options';
        }
    });

    // Reset all settings to defaults
    resetSettingsButton.addEventListener('click', () => {
        // Hide advanced options
        advancedOptionsContainer.classList.remove('visible');
        toggleOptionsButton.textContent = 'Advanced Options';
        isOptionsVisible = false;
        
        // Reset all toggle switches to active state
        document.querySelectorAll('.toggle').forEach(toggle => {
            toggle.classList.add('active');
        });
        
        // Reset threshold selector
        document.getElementById('scan-threshold').value = '0.7';
        
        // Reset risk meter
        updateRiskMeter(0);
        
        // Show success message
        resultDiv.className = 'result not-spam';
        resultDiv.textContent = 'Settings reset to defaults successfully.';
        
        // Clear after 3 seconds
        setTimeout(() => {
            if (resultDiv.textContent.includes('Settings reset')) {
                resultDiv.textContent = '';
                resultDiv.className = '';
            }
        }, 3000);
    });

    // Handle toggle switch interactions
    document.querySelectorAll('.toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            
            // Optional: Save setting state to storage
            const settingId = toggle.id;
            const isActive = toggle.classList.contains('active');
            
            // You can implement storage logic here if needed
            console.log(`Setting ${settingId} changed to: ${isActive}`);
        });
    });

    // Handle threshold change
    document.getElementById('scan-threshold').addEventListener('change', (e) => {
        const threshold = e.target.value;
        console.log(`Risk threshold changed to: ${threshold}`);
        // You can implement additional logic here
    });

    // Initialize risk meter
    updateRiskMeter(0);
    
    // Optional: Load saved settings on startup
    loadSavedSettings();
});

// Function to load saved settings (implement as needed)
function loadSavedSettings() {
    // You can implement Chrome storage API here to load saved settings
    // For now, we'll keep the defaults
    console.log('Loading saved settings...');
}

// Function to save settings (implement as needed)
function saveSettings() {
    // You can implement Chrome storage API here to save settings
    console.log('Saving settings...');
}