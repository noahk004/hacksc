// TEST BUTTON START
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

          const elementData = [];
          elements.forEach((element) => {
            let content =
              element.tagName === "INPUT" ? element.value : element.innerText;
            elementData.push({
              tag: element.tagName.toLowerCase(),
              content: content.trim(),
            });
          });

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
});

// TEST BUTTON END
let stream;
let isRecording = false;

const startAudio = new Audio("start.wav");
const stopAudio = new Audio("stop.wav");
const recordingStatus = document.getElementById("recordingStatus");

function startRecording() {
  isRecording = true;
  recordingStatus.textContent = "Recording is ON";
  startStream();

  console.log("Recording started");
  startAudio.play();
}

function stopRecording() {
  isRecording = false;
  recordingStatus.textContent = "Recording is OFF";
  stopStream();

  console.log("Recording stopped");
  stopAudio.play();
}

// Function to start media stream
async function startStream() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        .then((data) => console.log(data))
    // const audioElement = document.getElementById("audioElement");
    // audioElement.srcObject = stream;
    // audioElement.play();
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
}

// Function to stop media stream
function stopStream() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop()); // Stop each track to end the stream
    document.getElementById("audioElement").srcObject = null;
    stream = null;
  }
}

// Add event listener for spacebar press to toggle recording
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    isRecording ? stopRecording() : startRecording();
  }
});