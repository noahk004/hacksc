document.getElementById("logButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: () => {
          const elements = document.querySelectorAll(
            "button, input, select, textarea," +
              "h1, h2, h3, h4, h5, h6, p, a[href]"
          );

document.getElementById('executeButton').addEventListener('click', async () => {
  chrome.windows.create(
    {
      url: chrome.runtime.getURL("new_window.html"),
      type: "popup",
      width: 800,
      height: 600,
    },
    (newWindow) => {
      chrome.runtime.sendMessage(newWindow.id, { message: "HELLO!" });
    }
  );
  
    const inputField = document.getElementById('inputField');
    const user_command = inputField.value;
    let sampleData = "";
    
    try {
        const response = await fetch("http://localhost:5000/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_command })
        });
        const data = await response.json();
        console.log("Response from server:", data);
        sampleData = data;
    } catch (error) {
        console.error("Error sending command to server:", error);
    }
    console.log("Command:", sampleData);
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (sampleData) => {
                if (sampleData.action === 'input') {
                    // Handle input action
                    const inputs = document.querySelectorAll('input');
                    inputs.forEach(input => {
                        if (input.name === sampleData.input_name) {
                            input.value = sampleData.text_value;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    });
                } 
                else if (sampleData.action === 'click') {
                    // Handle button click action
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(button => {
                        if (button.textContent.trim() === sampleData.button_content) {
                            button.click();
                        }
                    });
                }
            },
            args: [sampleData]
        });
        
        console.log(`Action '${sampleData.action}' executed successfully`);
    } catch (error) {
        console.error("Error:", error);
    }
    
});
  
  
  

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (sampleData) => {
        if (sampleData.action === "input") {
          // Handle input action
          const inputs = document.querySelectorAll("input");
          inputs.forEach((input) => {
            if (input.name === sampleData.input_name) {
              input.value = sampleData.text_value;
              input.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });
        } else if (sampleData.action === "click") {
          // Handle button click action
          const buttons = document.querySelectorAll("button");
          buttons.forEach((button) => {
            if (button.textContent.trim() === sampleData.button_content) {
              button.click();
            }
          });
        }
      },
      args: [sampleData],
    });

    console.log(`Action '${sampleData.action}' executed successfully`);
  } catch (error) {
    console.error("Error:", error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Audio file received from new window:", message.audioPrompt);
  sendResponse({ response: "Hello from the extension!" });
});
