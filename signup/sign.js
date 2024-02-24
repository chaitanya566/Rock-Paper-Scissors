const socket = new WebSocket("ws://localhost:8080");
socket.addEventListener("open", function (event) {
  socket.send("Connection Established");
});
let UserNameList = null;
let i = 0;
socket.onmessage = function (event) {
  // Handle incoming data from the server
  data = JSON.parse(event.data);

  if (i === 0) {
    UserNameList = data;
    i = 1;
  }
  console.log(data);
  if (data === true) {
    updatesignStatus(true);
  } else if (data === false) {
    updateLoginStatus(false);
  }
  // Check the data type or format and handle it accordingly
};
function validateForm() {
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const confirmPassword = document.querySelector("#confirm_pw").value;

  const userAlreadyExistsMessage = document.querySelector("#useralrexist");
  const passwordsDontMatchMessage = document.querySelector("#pswddontmatch");
  let checkuser = isUserAlreadyExists(username);
  let checkpassword = password !== confirmPassword;
  // Replace this logic with your actual check for existing usernames
  if (checkuser) {
    userAlreadyExistsMessage.style.display = "block";
  } else {
    userAlreadyExistsMessage.style.display = "none";
  }

  if (checkpassword) {
    passwordsDontMatchMessage.style.display = "block";
  } else {
    passwordsDontMatchMessage.style.display = "none";
  }
  if (!checkuser && !checkpassword) {
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
  console.log(UserNameList[0]);
  for (let i = 0; i < UserNameList.length; i++) {
    if (UserNameList[i] === username) {
      return true;
    }
  }
  return false;
}
document.addEventListener("DOMContentLoaded", function () {
  const signInButton = document.querySelector('input[type="submit"]');
  signInButton.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the form from submitting
    validateForm();
  });
});

function updatesignStatus(isSuccessful) {
  const loginSuccess = document.getElementById("loginsuccess");
  if (isSuccessful) {
    // If login is successful, show the "Login Successful" message and hide the "Incorrect Password Fool" message
    loginSuccess.style.display = "block";
    setTimeout(function () {
      window.location.replace("../login/login.html");
    }, 1000);
  } else {
    // If login is unsuccessful, show the "Incorrect Password Fool" message and hide the "Login Successful" message

    loginSuccess.style.display = "none";
  }
}
