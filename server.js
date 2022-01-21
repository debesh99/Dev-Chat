// Express
const express = require('express');
const app = express();
// Server
const http = require('http');
const server = http.createServer(app);
// socket
const { Server } = require("socket.io");
const io = new Server(server);
const port = 80;

// Webpage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/static'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// Socket setup
let users = {}; //here users is an object variable
io.on('connection', (socket) => {
    socket.on("new-user-joined", (username) => {
        users[socket.id] = username;
        // console.log(users);
        socket.broadcast.emit("user-connected", username);
        // socket.broadcast.emit is used to inform all other members except that member who has joineds the chat
        io.emit("user-list", users)
            // io.emit is used to send all the members
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit("user-disconnected", user = users[socket.id]);
        delete users[socket.id];
        io.emit("user-list", users)

        // Here connection and disconnect are predefined events
    })
    socket.on('message', (data) => {
        socket.broadcast.emit("message", { user: data.user, msg: data.msg });
    })
});



// Host
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
console.log('Server running at http://127.0.0.1:8081/');