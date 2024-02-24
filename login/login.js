const socket = new WebSocket("ws://localhost:8888");
socket.addEventListener("open", function (event) {
  socket.send("Connection Established");
});
let UserNameList = null;
let data = null;
let username = null;
let i = 0;
socket.onmessage = function (event) {
  // Handle incoming data from the server
  data = JSON.parse(event.data);

  if (i === 0) {
    UserNameList = data;
    i = 1;
  }
  console.log(data);
  if (data === "login true") {
    updateLoginStatus(true);
  } else if (data === "login false") {
    updateLoginStatus(false);
  }

  // Handle other data types

  // Check the data type or format and handle it accordingly
};

function validateForm() {
  username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  console.log(username);
  const userAlreadyExistsMessage = document.querySelector("#useralrexist");
  userAlreadyExistsMessage.style.display = "none";
  let checkuser = isUserAlreadyExists(username);
  console.log(checkuser);
  // Replace this logic with your actual check for existing usernames
  if (checkuser) {
    userAlreadyExistsMessage.style.display = "block";
  } else {
    userAlreadyExistsMessage.style.display = "none";
  }

  if (!checkuser) {
    //finialize
    let arr = [username, password];
    socket.send(arr);
    console.log("Sent message:", arr);
  }
}

function isUserAlreadyExists(username) {
  // Your logic to check if the user exists goes here
  // Return true if the user exists, false otherwise
  if (UserNameList === null) {
    window.alert("issue with getting the usernames from server");
    return true;
  }
  console.log(UserNameList);
  for (let i = 0; i < UserNameList.length; i++) {
    if (UserNameList[i] === username) {
      return false;
    }
  }
  return true;
}
document.addEventListener("DOMContentLoaded", function () {
  const signInButton = document.querySelector('input[type="submit"]');
  signInButton.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the form from submitting
    validateForm();
  });
});
function updateLoginStatus(isSuccessful) {
  const pswdWrong = document.getElementById("pswdwrong");
  const loginSuccess = document.getElementById("loginsuccess");
  pswdWrong.style.display = "none";
  if (isSuccessful) {
    // If login is successful, show the "Login Successful" message and hide the "Incorrect Password Fool" message
    pswdWrong.style.display = "none";
    loginSuccess.style.display = "block";
    localStorage.setItem("username", username);
    setTimeout(function () {
      window.location.replace("../index.html");
    }, 1000);
  } else {
    // If login is unsuccessful, show the "Incorrect Password Fool" message and hide the "Login Successful" message
    pswdWrong.style.display = "block";
    loginSuccess.style.display = "none";
  }
}
