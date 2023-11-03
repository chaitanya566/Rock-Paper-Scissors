const socket = new WebSocket('ws://localhost:8000');
socket.addEventListener('open', function (event) {
    socket.send('Connection Established');
});

const contactServer = () => {
    socket.send("Initialize");
}
button1.addEventListener('click', function() {
    const message = "button1";
    console.log("Sent message:", message);
    socket.send(message);
});
button2.addEventListener('click', function() {
    const message = "button2";
    console.log("Sent message:", message);
    socket.send(message);
});
button3.addEventListener('click', function() {
    const message = "button3";
    console.log("Sent message:", message);
    socket.send(message);
});
//onmessage: Triggered when the server sends data. Inside this event listener, you can check the data type or format and handle it accordingly.
socket.onmessage = function(event) {
    // Handle incoming data from the server
    const data = event.data;
    console.log(data)
    // Check the data type or format and handle it accordingly
    if (typeof data === 'string') {
      // Handle string data
      console.log("Received string:", data);
      if (data==="you pressed button 1"){
        document.body.style.backgroundColor = 'black';
      }
      else if (data==="you pressed button 2"){
        document.body.style.backgroundColor = 'blue';
      }
      else if (data==="you pressed button 3"){
        document.body.style.backgroundColor = 'green';
      }

    } else if (typeof data === 'object') {
      // Handle object data (e.g., JSON)
      console.log("Received object:", JSON.parse(data));
    } else {
      // Handle other data types or error cases
      console.log("Received unknown data type:", data);
    }
};