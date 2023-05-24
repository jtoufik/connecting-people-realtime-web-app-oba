
const carousel = document.querySelector(".carousel");
firstImg = carousel.querySelectorAll(".book")[0];
const arrowIcons = document.querySelectorAll(".wrapper .arrow");

// let isDragStart, prevPageX, prevScrollLeft = false;
// let firstImgWidth = firstImg.clientWidth + 14;

// arrowIcons.forEach(icon => {
//     icon.addEventListener("click", () => {
//         carousel.scrollLeft += icon.id == "left" ? - firstImgWidth : firstImgWidth ;
//     })
// });

//     const dragStart = (e) => {
//         isDragStart = true;
//         prevPageX = e.pageX;
//         prevScrollLeft = carousel.scrollLeft;
//     }


//     const dragging = (e) => {
//         if(!isDragStart) return;
//         e.preventDefault();
//         carousel.classList.add("dragging");
//         let positionDiff = e.pageX - prevPageX;
//         carousel.scrollLeft = prevScrollLeft - positionDiff;
//     }

//     const dragStop = () => {
//         isDragStart = false;
//         carousel.classList.remove("dragging");
//     }

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);

// ChatArt room

const openButton = document.querySelector("[data-open-modal]")
const closeButton = document.querySelector("[data-close-modal]")
const modal = document.querySelector("[data-modal]")

openButton.addEventListener("click", () =>{
    modal.showModal() 
    
    console.log(openButton)
})

closeButton.addEventListener("click", () =>{
    modal.close()
})
