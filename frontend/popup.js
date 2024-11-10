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
                        content: content.trim()
                    });
                });
                
                return elementData;
            }
        }, (result) => {
            const elements = result[0].result;
            console.log(elements);
        });
    });
});