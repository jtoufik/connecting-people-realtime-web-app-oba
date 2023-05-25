const canvas = document.querySelector('canvas');
const canvasToolButtons = document.querySelectorAll('.draw-tool');
const canvasContext = canvas.getContext('2d');

let previousMouseX, previousMouseY, snapshot,
  isDrawing = false,
  selectedTool = 'brush';
let brushWidth = 4;

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const drawRectangle = (e) => {
  canvasContext.strokeRect(e.offsetX, e.offsetY, previousMouseX - e.offsetX, previousMouseY - e.offsetY);
}

const drawCircle = (e) => {
    canvasContext.beginPath();
    let radius = Math.sqrt(Math.pow((previousMouseX - e.offsetX), 2) + Math.pow((previousMouseY - e.offsetY), 2));
    canvasContext.arc(previousMouseX, previousMouseY, radius, 0, 2 * Math.PI);
    canvasContext.stroke();
}

const startDraw = (e) => {
  isDrawing = true;
  previousMouseX = e.offsetX;
  previousMouseY = e.offsetY;
  canvasContext.beginPath();
  canvasContext.lineWidth = brushWidth;
  snapshot = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  canvasContext.putImageData(snapshot, 0, 0);

  if (selectedTool === 'brush') {
    canvasContext.lineTo(e.offsetX, e.offsetY);
    canvasContext.stroke();
  } else if (selectedTool === 'rectangle') {
    drawRectangle(e);
  } else if (selectedTool === 'eclipse'){
    drawCircle(e)
  }
}

canvasToolButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Verwijder de actieve klasse van alle knoppen
    canvasToolButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    // Voeg de actieve klasse toe aan de huidige knop
    button.classList.add('active');
    selectedTool = button.id;
    console.log(selectedTool);
  });
});



canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);