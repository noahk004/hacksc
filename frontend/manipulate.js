document.getElementById('logButton').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: () => {
              const elements = document.querySelectorAll(
                  'button, input, select, textarea,' +
                  'h1, h2, h3, h4, h5, h6, p, a[href]'
              );
             
              const elementData = [];
              elements.forEach(element => {
                  let content = element.tagName === 'INPUT' ? element.value : element.innerText;
                  elementData.push({
                      tag: element.tagName.toLowerCase(),
                      content: content.trim(),
                      name: element.name,
                      type: element.type,
                  });
              });
              console.log(elementData);
              return elementData;
          }
      }, (result) => {
          const elements = result[0].result;
          console.log(elements);

          fetch("http://localhost:5000/elements", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ elements })
          })
          .then(response => response.json())
          .then(data => console.log("Response from server:", data))
          .catch(error => console.error("Error:", error));
      });
  });
});

document.getElementById('executeButton').addEventListener('click', async () => {

  const sampleData = {'action': 'input', 'input_name': 'username', 'text_value': 'justin.siek'};
  //const sampleData = {'action': 'click', 'button_content': 'Log in'};


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




