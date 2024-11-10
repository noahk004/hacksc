document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("logButton");
    
    button.addEventListener("click", async function() {
        try {
            const response = await fetch("http://localhost:5000/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    someData: "example data" 
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Response from server:", data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
});