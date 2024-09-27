## Look&Lock:

This project implements a face-based screen lock system, automatically locking the screen after a predefined time without detecting a face in the webcam feed. 

### Project Structure

```
├── models/                     # Directory for face detection models
├── captured_images.jpg             # Directory for storing captured frames
├── app.js                     # Main application script
├── package.json                 # Node.js dependencies and scripts
└── README.md                    # Project documentation
```

### Features

* **Face Detection:** Uses `face-api.js` library for real-time face detection in webcam feed.
* **Time-Based Locking:** Monitors the webcam for face presence and locks the screen after a specified time without detecting a face.
* **Platform Compatibility:** Supports Windows, macOS, and Linux operating systems.

### Installation Guide

**Prerequisites:**

* Node.js and npm installed.
* A webcam connected to your computer.
* Face detection AI Models(face-api).

**Steps:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MaThanMiThun1999/look-lock.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd look-lock
   ```
3. **Install dependencies:**
   ```bash
   npm install 
   ```
4. **Run the application:**
   ```bash
   node app.js
   ```

### Usage

1. Ensure your webcam is connected and functional.
2. Run the application using the command `npm start`.
3. The application will start capturing frames from your webcam and continuously monitor for faces.
4. If no face is detected for the specified time (2 seconds by default), the screen will lock.
5. To unlock the screen, simply face the webcam.

### Configuration

* **`lockTimeLimit`:** The time in seconds after which the screen will be locked if no face is detected. This value can be modified within the `index.js` file.
* **`webcamOptions`:** You can adjust webcam settings like resolution, delay, and image quality within the `webcamOptions` object in the `index.js` file.

### Diagrams

**Face Detection Flow:**

```
+-------------------+
|  Start Application |
+-------------------+
        |
        v
+-------------------+
| Load Face Models  |
+-------------------+
        |
        v
+-------------------+
|  Start Webcam     |
+-------------------+
        |
        v
+-------------------------+
|  Capture Image from Cam |
+-------------------------+
        |
        v
+------------------------------+
|  Detect Face in Captured Img  |
+------------------------------+
      /    \
     /      \
    v        v
+--------+   +-------------------------+
| Face   |   | No Face Detected         |
| Detected |   +-----------------------+
+--------+         |
   |               v
   |     +--------------------------+
   |     | Increment No Face Counter |
   |     +--------------------------+
   |               |
   |               v
   |     +----------------------------+
   |     | Lock Screen if Counter >= X |
   |     +----------------------------+
   |               |
   v               v
+-------------------+
| Reset No Face Time|
+-------------------+

```

### Additional Notes

* The `models` folder contains the face recognition models required for the application to function. These models are downloaded automatically during installation.
* The `lockScreen` function utilizes different commands depending on the operating system to lock the screen. These commands may vary depending on your specific system configuration.
* This application is a basic implementation for demonstration purposes. You may want to further customize it based on your specific needs, such as adding user authentication, different locking methods, or more advanced features like face recognition.
