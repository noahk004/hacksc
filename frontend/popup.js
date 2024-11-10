document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // Prevent space from scrolling the page
    document.getElementById("startButton").click();
  }
});

document.getElementById("startButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: () => {
          const elements = document.querySelectorAll(
            "button, input, select, textarea," +
              "h1, h2, h3, h4, h5, h6, p, a[href]"
          );

          const elementData = [];
          elements.forEach((element) => {
            let content =
              element.tagName === "INPUT" ? element.value : element.innerText;
            elementData.push({
              tag: element.tagName.toLowerCase(),
              content: content.trim(),
              name: element.name,
              type: element.type,
            });
          });
          console.log(elementData);
          return elementData;
        },
      },
      (result) => {
        const elements = result[0].result;
        console.log(elements);

        fetch("http://localhost:5000/elements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ elements }),
        })
          .then((response) => response.json())
          .then((data) => console.log("Response from server:", data))
          .catch((error) => console.error("Error:", error));
      }
    );
  });

  chrome.windows.create(
    {
      url: chrome.runtime.getURL("new-window/new_window.html"),
      type: "popup",
      width: 400,
      height: 400,
    },
    (newWindow) => {
      chrome.runtime.sendMessage(newWindow.id, { message: "HELLO!" });
    }
  );

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Audio file received from new window:", message.audioPrompt);
  sendResponse({ response: "Hello from the extension!" });
  fetch("http://localhost:5000/userInput", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_command: message.audioPrompt }),
  })
  .then((response) => response.json())
  .then(async (text) => {
    console.log("Text from server:", text);
    user_command = text.text;

  
  try {
    const response = await fetch("http://localhost:5000/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_command }),
    });
    const data = await response.json();
    console.log("Response from server:", data);
    sampleData = data.action;
  
    if (data.summary) {
      console.log("it should play now");
      const audio = new Audio();
      const audioData = atob(data.summary);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });

      audio.src = URL.createObjectURL(audioBlob);
      await audio.play();
    }
  } catch (error) {
    console.error("Error sending command to server:", error);
  }
  console.log("Command:", sampleData);
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

  })
    .catch((error) => console.error("Error:", error));
  