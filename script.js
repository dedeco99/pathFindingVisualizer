const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setCanvasDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawCircle(x, y) {
  ctx.fillStyle = "orangered";
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2);
  ctx.fill();
}

let toggleDraw = false;

window.addEventListener("resize", () => {
  setCanvasDimensions();
});

canvas.addEventListener("click", (event) => {
  toggleDraw = !toggleDraw;
});

canvas.addEventListener("mousemove", (event) => {
  if (toggleDraw) drawCircle(event.x, event.y);
});

setCanvasDimensions();
