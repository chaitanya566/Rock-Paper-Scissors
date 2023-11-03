const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', function (event) {
    socket.send('Connection Established');
});
socket.onmessage = function(event) {
    // Handle incoming data from the server
    const data = event.data;
    console.log(data)
    // Check the data type or format and handle it accordingly

};