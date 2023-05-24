// Boeken carousel

const carousel = document.querySelector(".carousel");
firstImg = carousel.querySelectorAll(".book")[0];
const arrowIcons = document.querySelectorAll(".wrapper .arrow");

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);

// ---------------------------------------------------------------

// ChatArt room

const openButton = document.querySelector("[data-open-modal]")
const closeButton = document.querySelector("[data-close-modal]")
const modal = document.querySelector("[data-modal]")

openButton.addEventListener("click", () =>{
    modal.showModal() 
})

closeButton.addEventListener("click", () =>{
    modal.close()
})
