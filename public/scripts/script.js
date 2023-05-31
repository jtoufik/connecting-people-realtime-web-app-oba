const carousel = document.querySelector(".carousel");
firstImg = carousel.querySelectorAll(".book")[0];
const arrowIcons = document.querySelectorAll(".wrapper .arrow");

// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("mousemove", dragging);
// carousel.addEventListener("mouseup", dragStop);

// ---------------------------------------------------------------

// ChatArt room

let chat = document.getElementById('chat');
let draw = document.getElementById('draw');

chat.addEventListener('toggle', function(event) {
    if (chat.open) {
        draw.open = false;
    }
});

draw.addEventListener('toggle', function(event) {
    if (draw.open) {
        chat.open = false;
    }
});

function toggleDetails() {
    let detailsElement = document.getElementById("chat");
    detailsElement.open = !detailsElement.open;
}

// --------

let socket = io()
let messages = document.querySelector('.chat-box ul')
let input = document.querySelector('.chat-input')


document.querySelector('.chat-form').addEventListener('submit', (event) => {
    event.preventDefault()

    console.log(input, messages)
    if (input.value) {
        socket.emit('message', input.value)
        input.value = ''
    }
})

socket.on('message', (message) => {
    addMessage(message)
})

socket.on('whatever', (message) => {
    addMessage(message)
})

socket.on('history', (history) => {
    history.forEach((message) => {
        addMessage(message)
    })
})

function addMessage(message) {
    messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
    messages.scrollTop = messages.scrollHeight
}


