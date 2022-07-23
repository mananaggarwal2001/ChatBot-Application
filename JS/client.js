const socket = io('http://localhost:8000') // This link is used to establish the connection between the client and the server.
// Get DOM elements in the JS Variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById("message-Inp");
const messagecontainer = document.querySelector(".container");

// Audio That will play on the receiving the message.
let audio = new Audio('../music/Messenger.mp3');
const append = (message, position) => {
    const messageApplication = document.createElement('div');
    messageApplication.innerText = message;
    messageApplication.classList.add('message');
    messageApplication.classList.add(position);
    messagecontainer.append(messageApplication);
    if (position == 'left') {
        audio.play();
    }
}

// If the form gets subimitted send the server the messsage so that the server will BroadCast this message to the others users etc.
form.addEventListener('submit', e => {
    e.preventDefault(); // This will not allow to submit the form and reload the page etc.
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';

})

// Ask the user for his/her name etc.
const PersonName = prompt("Enter your name to join the chat");


// To Send the name of the user to the server who is willing to join the chat.
socket.emit('new-user-joined', PersonName);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});  // This  is ued for telling the application that how many user joined the chat and display the message below.

// To Listen to the messages that are received to the client Browser so that the client will not to reload continuesly and the gets the message directly.
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

socket.on('left', PersonName => {
    append(`${PersonName} left the chat`, 'right');
})


