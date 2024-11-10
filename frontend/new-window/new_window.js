let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

startBtn.addEventListener("click", async () => {
  const sound = new Audio("start.wav");
  sound.play();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  audioChunks = []; // Clear previous recordings

  // Request access to the microphone
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  // Capture audio data
  mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

  // Start recording
  mediaRecorder.start();
});

stopBtn.addEventListener("click", () => {
    const sound = new Audio("stop.wav");
    sound.play();
  startBtn.disabled = false;
  stopBtn.disabled = true;

  // Stop recording
  mediaRecorder.stop();

  // Save the recording as a file
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    // Convert the Blob to a Base64 string if needed (optional)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(",")[1]; // Strip the base64 header

      // Send the Base64-encoded audio data to the extension
      chrome.runtime.sendMessage({ audioPrompt: base64data }, (response) => {
        console.log("Audio data sent to extension:", response);
      });
    };
    reader.readAsDataURL(audioBlob);
    // Clean up
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  };
});
