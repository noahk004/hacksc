document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("logButton");
    
    button.addEventListener("click", async function() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    // Find all input elements
                    const inputs = document.querySelectorAll('input');
                    
                    // Set each input's value to "aaa"
                    inputs.forEach(input => {
                        input.value = 'aaa';
                        // Trigger input event to ensure any listeners are notified
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                }
            });
            
            console.log("Inputs modified successfully");
        } catch (error) {
            console.error("Error:", error);
        }
    });
});