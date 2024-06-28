import { socket } from "./webSocket.js";


export function discussHistory(socket) {
    let message = {
        Type: "history",
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

let content
let end = 10
let preend = 10
export function retrieveStory(data) {
    console.log(end);
    content =data
    let output = document.getElementById(`WsChatroom${data.Sender}`)
    let sender = data.Sender
    if (!output) {
        output = document.getElementById(`WsChatroom${data.Receiver}`)
        sender = data.Receiver
    }
    output.innerHTML = ''
    if(data.Content){
        let reversedContent = data.Content.slice(0, end)
        for (let oneMess of (reversedContent).reverse()) {
            console.log('retrieving the story')
            if ((oneMess.Content).startsWith(sender)) {
                output.innerHTML += `<p class="WsRight">${oneMess.Content}</p>`
            } else {
                output.innerHTML += `<p class="WsLeft">${oneMess.Content}</p>`
            }
        }
        if (end > data.Content.length) {
            end =preend
        }
        preend = end
    }
}

export function loadMoreMessages() {
    let loading = document.getElementById('loading')
    loading.style.display = 'flex'
    setTimeout(() => {
        loading.style.display = 'none'
        end += 10
        discussHistory(socket);
    }, 1000);
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function notification(socket) {
    let message = {
        Type: "notification",
        Content: "",
        Sender: "",
        Receiver: "",
    };
    let sender = document.getElementById("user")
    message.Sender = sender.textContent
    socket.send(JSON.stringify(message))
}

export function notifsDisplay(data) {
    if (data.Content) {
        for (let unRead of data.Content) {
                console.log(unRead.Sender);
                let notif = document.getElementById(`notif${unRead.Sender}`)
                notif.style.display ='flex'
        }
    }
}