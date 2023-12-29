import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const demosSection = document.getElementById("demos");
let gestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
const videoHeight = "360px";
const videoWidth = "480px";
let data = null;
let inputArray = null;
let user_streak=null;
let user_current_streak=0;
const socket = new WebSocket("ws://localhost:8000");
socket.addEventListener("open", function (event) {
  socket.send("Connection Established");
});

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
  demosSection.classList.remove("invisible");
};
createGestureRecognizer();

/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");
const button = document.getElementById("input_user");
const countdownElement = document.getElementById("countdown");
const storedUsername = localStorage.getItem("username");

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }
  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }
  // getUsermedia parameters.
  const constraints = {
    video: true,
  };
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}
let lastVideoTime = -1;
let results = undefined;
let categoryName = undefined;
async function predictWebcam() {
  const webcamElement = document.getElementById("webcam");
  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
  }
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);
  canvasElement.style.height = videoHeight;
  webcamElement.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  webcamElement.style.width = videoWidth;
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 5,
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
    }
  }
  canvasCtx.restore();
  if (results.gestures.length > 0) {
    gestureOutput.style.display = "none";
    gestureOutput.style.width = videoWidth;
    categoryName = results.gestures[0][0].categoryName;
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2);
    const handedness = results.handednesses[0][0].displayName;
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
  } else {
    gestureOutput.style.display = "none";
  }
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}
//----------------------------------------------------------------------
const element1 = document.getElementById("offline");
const element2 = document.getElementById("win");
const element3 = document.getElementById("tie");
const element4 = document.getElementById("lose");
const statusTextElement=document.getElementById("textstatus")
const loginpass=document.getElementById("links");
const logindetail=document.getElementById("loginpass");
const streakcurrentid=document.getElementById("current");
const streakhighid=document.getElementById("highest");
const streakid=document.getElementById("streak");
console.log(element2);
socket.onmessage = function (event) {
  // Handle incoming data from the server
  data = JSON.parse(event.data);
  console.log(data);
  if (typeof myVariable === "string") {
    console.log("myVariable is a string");
    if (data === "update success") {
      console.log(data);
    }
  } else if (Number.isInteger(data)) {
    console.log(data);
    user_streak=data;
    streakhighid.textContent = "Highest WinStreak : "+ user_streak;
    console.log("The value is an integer.");
  } else {
    inputArray = data;
    console.log(data);
    updateDataDiv();
    console.log("eeee");
    if (storedUsername != "null") {
      console.log("aaaa");
      socket.send(storedUsername);
      console.log(storedUsername);
      statusTextElement.textContent = "Login Detected";
      loginpass.style.display="none";
      logindetail.style.display="flex";
      logindetail.textContent ="Logged in as : "+storedUsername;
      logindetail.style.color="white";
      var link = document.createElement("a");
      link.href = "./login/login.html"; // Set the link's href attribute
      link.textContent = "Change?"; // Set the link's text
      link.style.color="white";
      link.style.fontSize="25px";
      link.style.marginLeft="30px";
// Append the link to the div
streakid.style.display="flex"
streakcurrentid.textContent = "Current WinStreak : "+ user_current_streak;
streakhighid.textContent = "Highest WinStreak : "+ user_streak;
      logindetail.appendChild(link);
      element1.style.display = "flex"; // Show the element
      element1.style.animation = "fadeOutUp 2s 5s forwards";
      

      // Add an event listener to detect the end of the CSS animation
      element1.addEventListener("animationend", function () {
        element1.style.animation = "none"; // Reset the animation
        element1.style.display = "none";
         // Hide the element
        element1.style.opacity = 1; // Reset the opacity for future use
        element1.style.transform = "translateY(0)"; // Reset the transform for future use
      });
      
    } else {
      
      element1.style.display = "flex"; // Show the element
      element1.style.animation = "fadeOutUp 2s 5s forwards";
      

      // Add an event listener to detect the end of the CSS animation
      element1.addEventListener("animationend", function () {
        element1.style.animation = "none"; // Reset the animation
        element1.style.display = "none";
         // Hide the element
        element1.style.opacity = 1; // Reset the opacity for future use
        element1.style.transform = "translateY(0)"; // Reset the transform for future use
      });
    }
  }

  // Handle other data types

  // Check the data type or format and handle it accordingly
};
//------------------------------------------------------------

button.addEventListener("click", async function () {
  // Your code to handle the click event goes here
  // Example action, you can replace this with your own code
  let countdown = 3;
  countdownElement.textContent = `video will take input in : ${countdown}`;
  

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent =
      countdown > 0 ? `video will take input in : ${countdown}` : "Go!";
  }, 1000); // Update every 1 second (1000 milliseconds)

  // Stop the countdown after 3 seconds (3000 milliseconds)
  setTimeout(() => {
    clearInterval(countdownInterval);

    let ai_turn = chooseImage();
    console.log(ai_turn);
    let user_turn = null;
    let result;
    if (results.gestures.length > 0) {
      
      if (categoryName === "Closed_Fist") {
        user_turn = 1;
        
      } else if (categoryName === "Open_Palm") {
        
        user_turn = 2;
      } else if (categoryName === "Victory") {
        
        user_turn = 3;
      } else {
        console.log("invalid move");
      }
      if (user_turn === ai_turn) {
        result = "It's a tie!";
        countdownElement.textContent = `Click on play again!`
        element3.style.display = "flex";
        element3.style.animation = "fadeOutUp 2s 2s forwards";
  
        // Add an event listener to detect the end of the CSS animation
        element3.addEventListener("animationend", function () {
          element3.style.animation = "none"; // Reset the animation
          element3.style.display = "none"; // Hide the element
          element3.style.opacity = 1; // Reset the opacity for future use
          element3.style.transform = "translateY(0)"; // Reset the transform for future use
        });
      } else if (
        (user_turn === 1 && ai_turn === 3) ||
        (user_turn === 2 && ai_turn === 1) ||
        (user_turn === 3 && ai_turn === 2)
      ) {
        result = `You win!`;
        user_current_streak=user_current_streak+1;
        countdownElement.textContent = `Click on play again!`
        streakcurrentid.textContent = "Current WinStreak : "+ user_current_streak;
        //===========================================
      } else if (
        (user_turn === 1 && ai_turn === 2) ||
        (user_turn === 2 && ai_turn === 3) ||
        (user_turn === 3 && ai_turn === 1)
      ) {
        result = `AI wins!`;
        if(user_current_streak>user_streak){
          //==================================================================================================================
          let send_data=[storedUsername,user_current_streak]
          socket.send(send_data);
          console.log(send_data);
          console.log(user_current_streak);
          console.log(user_streak);
          user_streak=user_current_streak;
          user_current_streak=0;
          streakcurrentid.textContent = "Current WinStreak : "+ user_current_streak;
        }
        
        countdownElement.textContent = `Click on play again!`
        element4.style.display = "flex";
        element4.style.animation = "fadeOutUp 2s 2s forwards";
  
        // Add an event listener to detect the end of the CSS animation
        element4.addEventListener("animationend", function () {
          element4.style.animation = "none"; // Reset the animation
          element4.style.display = "none"; // Hide the element
          element4.style.opacity = 1; // Reset the opacity for future use
          element4.style.transform = "translateY(0)"; // Reset the transform for future use
        });
      } else {
        result = "Invalid choice.";
        countdownElement.textContent = `Click on play again!`
      }
    }
    console.log(result);
    if (result === `You win!`) {
  
       // Show the element
       element2.style.display = "flex";
      element2.style.animation = "fadeOutUp 2s 2s forwards";

      // Add an event listener to detect the end of the CSS animation
      element2.addEventListener("animationend", function () {
        element2.style.animation = "none"; // Reset the animation
        element2.style.display = "none"; // Hide the element
        element2.style.opacity = 1; // Reset the opacity for future use
        element2.style.transform = "translateY(0)"; // Reset the transform for future use
      });
      const duration = 2 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 20, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 20 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
    }
  }, 3000);
});
const images = ["./images/rock.svg", "./images/Paper.svg", "./images/Scissors.svg"];

// Function to choose a random image
function chooseImage() {
  const randomIndex = Math.floor(Math.random() * images.length);
  const chosenImage = images[randomIndex];

  // Display the chosen image
  const imageElement = document.getElementById("displayedImage");
  imageElement.src = chosenImage;

  return randomIndex + 1;
}

// Attach a click event to the button
const duration = 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 20, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const interval = setInterval(function () {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  const particleCount = 20 * (timeLeft / duration);

  // since particles fall down, start a bit higher than random
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  );
}, 250);

function updateDataDiv() {
  const dataDiv = document.getElementById("dataDiv");
  // dataDiv.innerHTML = ''; // Clear existing content

  // Limit the array to a maximum of 5 items
  const limitedArray = inputArray;
  console.log(limitedArray);

  limitedArray.forEach((item) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = `${item[0]}   ---------> ${item[1]}`;
    dataDiv.appendChild(paragraph);
  });
}
