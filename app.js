const faceapi = require('face-api.js');
const canvas = require('canvas');
const Webcam = require('node-webcam');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set up face detection and recognition
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load face detection and recognition models
const modelPath = './models';
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath),
  faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
  faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
]).then(startCamera);

// Configure webcam
const webcamOptions = {
  width: 320,
  height: 240,
  delay: 0,
  saveShots: true,
  output: 'jpeg',
  quality: 100,
  callbackReturn: 'location',
  verbose: false,
};

// Start camera and capture images periodically
async function startCamera() {
  const webcam = Webcam.create(webcamOptions);

  // Capture and process images every 2 seconds
  setInterval(async () => {
    webcam.capture('current_frame', async (err, data) => {
      if (err) {
        console.error('Error capturing webcam image:', err);
        return;
      }

      // Load the captured image for face detection
      const img = await canvas.loadImage(path.resolve(data));
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());

      if (detections.length === 0) {
        // No face detected, increment the time counter
        timeWithoutFace += 2; // Increment by 2 seconds
        if (timeWithoutFace >= lockTimeLimit) {
          // Lock the screen
          lockScreen();
          timeWithoutFace = 0; // Reset the timer
        }
      } else {
        // Face detected, reset the time counter
        timeWithoutFace = 0;
      }

      // Clean up: Delete the captured frame to avoid disk clutter
      fs.unlinkSync(path.resolve(data));
    });
  }, 2000); // Check every 2 seconds
}

// Lock the screen based on the operating system
function lockScreen() {
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows lock screen command
    exec('rundll32.exe user32.dll,LockWorkStation', (error) => {
      if (error) {
        console.error(`Error locking screen: ${error}`);
      }
    });
  } else if (platform === 'darwin') {
    // macOS lock screen command
    exec('pmset displaysleepnow', (error) => {
      if (error) {
        console.error(`Error locking screen: ${error}`);
      }
    });
  } else if (platform === 'linux') {
    // Linux lock screen command (Gnome or general)
    exec('xdg-screensaver lock || gnome-screensaver-command -l || dm-tool lock', (error) => {
      if (error) {
        console.error(`Error locking screen: ${error}`);
      }
    });
  } else {
    console.error('Unsupported platform');
  }
}

// Time variables
let timeWithoutFace = 0;
const lockTimeLimit = 2; 

// Main function
async function main() {
  try {
    console.log('Loading models...');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    ]);
    console.log('Models loaded successfully.');

    console.log('Starting camera...');
    await startCamera();
    console.log('Camera started.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();