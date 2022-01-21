const socket = io();

let username;
let chats = document.querySelector(".chats");
let users_list = document.querySelector(".users-list");
let users_count = document.querySelector(".users-count");
let users_msg = document.querySelector("#users-msg");
let users_send = document.querySelector("#users-send");

username = prompt("Enter your name");

socket.emit("new-user-joined", username);
// Emit is the way to send events between server and client
// here "new-user-joined" is the name of the event

// User connection
socket.on("user-connected", (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});


function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b> ${name} </b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
}
// User disconnection
socket.on("user-disconnected", (user) => {
    userJoinLeft(user, 'left');
});


function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b> ${name} </b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
}

// user-list
socket.on("user-list", (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for (let i = 0; i < users_arr.length; i++) {
        let li = document.createElement('li');
        li.innerText = users_arr[i];
        users_list.appendChild(li);

    }
    users_count.innerHTML = users_arr.length;
});

// sending message
users_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: users_msg.value
    };
    if (users_msg.value != '') {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        users_msg.value = '';

    }
});

function appendMessage(data, status) {
    let div = document.createElement("div");
    div.classList.add('message', status);
    let content = `<h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;

}
socket.on('message', (data) => {
    appendMessage(data, "incoming");
})