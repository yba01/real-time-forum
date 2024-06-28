import { discussHistory, notification, notifsDisplay, retrieveStory } from "./discuss.js";
import { fetchForum } from "./forum.js";
import { routes, Redirect } from "./index.js";
import { forumHtml } from "./views.js";
import { OrganizeOnlineUser } from "./organizeUserOnline.js";

export let socket

export function createWebsocket() {
    console.log('creating socket');
    socket = new WebSocket('ws://localhost:8081/ws')
    const sendButton = document.getElementById('sendButton')
    let messageInput = document.getElementById('messageInput')
    socket.onopen = (e) => {
        console.log('web socket opened');
        sendButton.addEventListener('click', () => {
            sendMessage(socket)
            let sender = document.getElementById("user")
            setTimeout(() => {
                OrganizeOnlineUser(sender)
            }, 200)

        })
        setTimeout(() => {
            notification(socket)
        }, 200)
        messageInput.addEventListener('input', _.throttle(() => sendTyping(socket), 1000));
    }
    socket.onclose = () => {
        console.log("close socket");
    }
    socket.onmessage = (e) => {
        let data = JSON.parse(e.data)

        if (data.Type == "status") {
            console.log("online");
            insertUsers(data)
            return
        }

        if (data.Type == "typing") {
            console.log("typing");
            animeTyping(data);
            return
        }

        if (data.Type == "history") {
            console.log('retrieving the story');
            retrieveStory(data)
            return
        }

        if (data.Type == "notifs") {
            notifsDisplay(data)
            console.log('displaying notifs');
            return
        }
        OrganizeOnlineUser(data.Sender)
        setTimeout(() => {
            console.log(data.Receiver, data.Read, data.Sender);
            let output = document.getElementById(`WsChatroom${data.Sender}`)
            if (!(data.Read)) {
                let notif = document.getElementById(`notif${data.Sender}`)
                notif.style.display = 'flex'
            }
            output.innerHTML += `<p class="WsRight"> ${data.Content}</p>`
        }, 200)

    }

}


function sendMessage(socket) {
    let message = {
        Type: "message",
        Content: "",
        Sender: "",
        Receiver: "",
        Read: false,
    };
    let receiver = document.getElementById('WsUserMessage')
    let sender = document.getElementById("user")
    let now = new Date()
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let currentTime = `${hours}:${minutes}`;
    message.Receiver = receiver.textContent
    message.Content = `${sender.textContent}:${currentTime}:${messageInput.value}`
    message.Sender = sender.textContent
    displayMessage(messageInput, message.Receiver)
    socket.send(JSON.stringify(message))
    messageInput.value = ""
}

export function insertUsers(data) {
    let user = data.Me
    let isDisconnet = data.IsDisconnet
    let button = document.getElementById(`wsStatus${user}`)
    if (isDisconnet) {
        if (button) {
            button.classList.add("unactiveUsers")
            button.classList.remove("activeUsers")
        } else {
            routes['/'] = forumHtml
            Redirect('/')
            fetchForum('forum')
        }

    } else {
        if (button) {
            button.classList.add("activeUsers")
            button.classList.remove("unactiveUsers")
        } else {
            routes['/'] = forumHtml
            Redirect('/')
            fetchForum('forum')
        }
    }
    // <div class="chat-bubble">

    // </div>

}

export function openChatRoom(url) {
    let recievingUser = url.slice(2)
    let chatRoom = document.getElementById('chatOpened')
    let userSent = document.getElementById('WsUserMessage')
    let outChatroom = document.getElementById(`WsChatroom${recievingUser}`)
    let alloutChat = document.getElementsByClassName('WsChatroom')
    let notif = document.getElementById(`notif${recievingUser}`)
    notif.style.display = 'none'
    userSent.innerHTML = recievingUser
    let button = document.getElementById(`wsStatus${userSent.textContent}`)
    console.log(userSent);
    let sendbutton = document.getElementById(`WsMessageSend`)
    console.log(button.classList.contains('activeUsers'));
    if (button.classList.contains('activeUsers')) {
        sendbutton.style.display = 'flex'
    } else {
        sendbutton.style.display = 'none'
    }
    if (chatRoom.style.display != 'flex') {
        chatRoom.style.display = 'flex'
        outChatroom.style.display = 'flex'
        for (var i = 0; i < alloutChat.length; i++) {
            if (outChatroom != alloutChat[i]) {
                alloutChat[i].style.display = 'none';
            }
        }
        discussHistory(socket)
    } else {
        chatRoom.style.display = 'none'
        outChatroom.style.display = 'none'
    }
}

function displayMessage(message, receiver) {
    let output = document.getElementById(`WsChatroom${receiver}`)
    if (output) {
        let now = new Date()
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let currentTime = `${hours}:${minutes}`;
        output.innerHTML += `<p class="WsLeft">${currentTime}: ${message.value}</p>`
    }

}
function sendTyping(socket) {
    let message = {
        Type: "typing",
        Content: "",
        Sender: "",
        Receiver: "",
    };
    let receiver = document.getElementById('WsUserMessage')
    let sender = document.getElementById("user")
    message.Receiver = receiver.textContent
    message.Sender = sender.textContent
    socket.send(JSON.stringify(message))
}
function animeTyping(data) {
    let divType = document.getElementsByClassName(`anime`)
    for (var i = 0; i < divType.length; i++) {
        if (!divType[i].classList.contains("dot")) {
            divType[i].classList.add('dot')
        }
    }
    setTimeout(() => {
        for (var i = 0; i < divType.length; i++) {
            divType[i].classList.remove('dot')
        }
    }, 700)

}