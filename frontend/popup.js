document.getElementById('logButton').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: () => {
                const elements = document.querySelectorAll(
                    'button, input, select, textarea, a[href], ' + 
                    '[onclick], [role="button"], [role="link"], ' +
                    '[role="menuitem"], [role="option"], [contenteditable="true"], ' +
                    'h1, h2, h3, h4, h5, h6'
                );
                
                const elementData = [];
                elements.forEach(element => {
                    // Get the content (for inputs, use value instead of innerText)
                    let content = element.tagName === 'INPUT' ? element.value : element.innerText;
                    elementData.push({
                        tag: element.tagName.toLowerCase(),
                        content: content.trim()
                    });
                });
                
                return elementData;
            }
        }, (result) => {
            const elements = result[0].result;
            elements.forEach(elem => {
                console.log(`<${elem.tag}>${elem.content}</${elem.tag}>`);
            });
        });
    });
});