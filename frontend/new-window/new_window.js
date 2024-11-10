let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Add spacebar event listener
document.addEventListener('keydown', async (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // Prevent page scrolling
    if (!isRecording) {
      await startRecording();
    } else {
      stopRecording();
    }
  }
});

// Refactor the recording logic into separate functions
async function startRecording() {
  const sound = new Audio("start.wav");
  sound.play();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  audioChunks = [];

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
  mediaRecorder.start();
  isRecording = true;
}

function stopRecording() {
  const sound = new Audio("stop.wav");
  sound.play();
  
  startBtn.disabled = false;
  stopBtn.disabled = true;

  mediaRecorder.stop();
  isRecording = false;

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(",")[1];
      chrome.runtime.sendMessage({ audioPrompt: base64data }, (response) => {
        console.log("Audio data sent to extension:", response);
      });
    };
    reader.readAsDataURL(audioBlob);
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  };
}

// Keep the existing click event listeners
startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
