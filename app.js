// Node server which will handle the socket io connections
const io= require('socket.io')(8000);
const users= {};
const cors= require('cors')
const express= require('express')
const app= express();
const port= process.env.port;
const path= require('path');
app.use(cors());
// For Serving the Static files we have

app.use(express.static(`${__dirname}/public`)) // For Sendingl the Static File

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
})
io.on('connection', socket=>{
    // This is the first event that tell the clients which are connected to the server that the new User has joined.
    socket.on('new-user-joined', name=>{
            // This Statement to check which user has joined the chat and what to do with that user.
        users[socket.id]= name;  // This is used to append the array of the names which has joined the chat etc.
        socket.broadcast.emit('user-joined', name); // This is used to tell the others users that this user has joined the chat and ready to do the conversation.
    });
    // This is the event which is used to send the messages from the client and BroadCast to the other Users who are in the Server Already.
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]}); // This is used for sending the message to all the users at the same time.
    })

    // When the user disconnect the chat then the socket IO Will throw the disconnection message telling the other user that this user is disconnected.
    socket.on('disconnect', message=>{ // disconnect is the built-In Event and fires automatically when the user leaves the chat.
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id]
    })
})

// To Listen the Application and Serve it to the client

app.listen(port||80, ()=>{
    console.log("Application is sucessfully listening to the Port 80 or the given random Port and Serving to the client window.");
});