// Boeken carousel

const carousel = document.querySelector(".carousel");
firstImg = carousel.querySelectorAll(".book")[0];
const arrowIcons = document.querySelectorAll(".wrapper .arrow");

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);

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