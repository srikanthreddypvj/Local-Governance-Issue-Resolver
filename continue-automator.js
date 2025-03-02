// Configuration
const CONFIG = {
    inputText: 'continue',
    checkInterval: 60000,    // 60 seconds between main loops
    waitBeforeSend: 60000,   // 60 seconds wait after detecting "Run"
    inputDelay: 500,         // 0.5 seconds
    retryDelay: 2000         // 2 seconds
};

// State management
let isAutomationRunning = false;

// Helper function to simulate more natural input
function simulateUserInput(element, text) {
    // Focus the element
    element.focus();
    
    // Set the value
    element.value = text;
    
    // Dispatch multiple events to ensure the change is registered
    const events = ['input', 'change', 'blur'];
    events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    });
}

// Function to find elements with retry
async function findElement(selector, maxAttempts = 5) {
    for (let i = 0; i < maxAttempts; i++) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error(`Element not found: ${selector}`);
}

// Main automation function
async function startAutomation() {
    if (isAutomationRunning) {
        console.log('Automation is already running!');
        return;
    }

    isAutomationRunning = true;
    console.log('Automation started. Type stopAutomation() to stop.');

    while (isAutomationRunning) {
        try {
            // Find the textarea using the specific class and attributes
            const textarea = await findElement('textarea[cdktextareaautosize][class*="cdk-textarea-autosize"]');
            
            // Find the run button
            const runButton = await findElement('run-button button');
            const buttonText = runButton?.querySelector('.label')?.textContent?.trim();

            if (buttonText === 'Run') {
                console.log('Run button detected, waiting 60 seconds before sending continue...');
                
                // Wait 60 seconds after detecting "Run"
                await new Promise(resolve => setTimeout(resolve, CONFIG.waitBeforeSend));
                
                // Check if automation was stopped during the wait
                if (!isAutomationRunning) break;

                // Simulate user input
                simulateUserInput(textarea, CONFIG.inputText);
                console.log('Input text entered');

                // Wait a brief moment before clicking
                await new Promise(resolve => setTimeout(resolve, CONFIG.inputDelay));

                // Click the button
                runButton.click();
                console.log('Run button clicked');
            }

            // Wait before next iteration
            await new Promise(resolve => setTimeout(resolve, CONFIG.checkInterval));

        } catch (error) {
            console.error('Error in automation:', error);
            if (!isAutomationRunning) break;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
        }
    }
}

// Function to stop the automation
function stopAutomation() {
    isAutomationRunning = false;
    console.log('Automation stopped');
}

// Expose functions to global scope
window.startAutomation = startAutomation;
window.stopAutomation = stopAutomation;

// Initial setup message
console.log('Automation script loaded!');
console.log('Type startAutomation() to begin');
console.log('Type stopAutomation() to stop');
