let socket = io();

const canvas = document.querySelector('canvas');
const canvasToolButtons = document.querySelectorAll('.draw-tool');
const canvasContext = canvas.getContext('2d');

let previousMouseX, previousMouseY, snapshot,
  isDrawing = false,
  selectedTool = 'brush';
let brushWidth = 4;
let rectangles = [];
let circles = [];

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

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

  if (selectedTool === "brush") {
    canvasContext.lineTo(e.offsetX, e.offsetY);
    canvasContext.stroke();

    socket.emit("drawing", {
      tool: selectedTool,
      x: e.offsetX,
      y: e.offsetY,
      width: brushWidth,
    });
  } else if (selectedTool === "rectangle") {
    drawRectangle(e);
  } else if (selectedTool === "circle") {
    const circle = {
      x: previousMouseX,
      y: previousMouseY,
      radius: Math.sqrt(Math.pow(previousMouseX - e.offsetX, 2) + Math.pow(previousMouseY - e.offsetY, 2)),
    };

    drawCircle(circle);
  }
};

const drawRectangle = (e) => {
  const width = previousMouseX - e.offsetX;
  const height = previousMouseY - e.offsetY;

  const rectangle = {
    id: Date.now().toString(),
    x: e.offsetX,
    y: e.offsetY,
    width: width,
    height: height,
  };

  rectangles.push(rectangle);

  canvasContext.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

  socket.emit("drawRectangle", rectangle);
};

const drawCircle = (circle) => {
  circles.push(circle);

  canvasContext.beginPath();
  canvasContext.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  canvasContext.stroke();

  socket.emit("drawCircle", circle);
};

canvasToolButtons.forEach(button => {
  button.addEventListener('click', () => {
    canvasToolButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    button.classList.add('active');
    selectedTool = button.id;
    console.log(selectedTool);
  });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

socket.on("drawing", (data) => {
  if (data.tool === "brush") {
    canvasContext.beginPath();
    canvasContext.lineWidth = data.width;
    canvasContext.moveTo(previousMouseX, previousMouseY);
    canvasContext.lineTo(data.x, data.y);
    canvasContext.stroke();
    previousMouseX = data.x;
    previousMouseY = data.y;
  } else if (data.tool === "rectangle") {
    drawRectangle(data);
  } else if (data.tool === "circle") {
    drawCircle(data);
  }
});

socket.on("drawRectangle", (rectangle) => {
  rectangles.push(rectangle);
  canvasContext.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
});

socket.on("drawCircle", (circle) => {
  circles.push(circle);
  canvasContext.beginPath();
  canvasContext.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  canvasContext.stroke();
});

socket.on("connect", () => {
  console.log("Connected to server.");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});
