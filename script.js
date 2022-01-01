let canvas;
let ctx;
let grid;
let gridAnimation;

class Cell {
  constructor(ctx, row, col, size, isWall) {
    this.ctx = ctx;
    this.row = row;
    this.col = col;
    this.size = size;
    this.isWall = isWall;
  }

  draw() {
    ctx.beginPath();

    ctx.strokeStyle = "white";
    ctx.rect(this.col * this.size, this.row * this.size, this.size, this.size);
    ctx.stroke();

    if (this.isWall) {
      ctx.fillStyle = "orangered";
      ctx.fill();
    }

    ctx.fillStyle = "white";
    ctx.fillText(
      `${this.row}-${this.col}`,
      this.col * this.size + 5,
      this.row * this.size + 15
    );
  }
}

class Grid {
  constructor(ctx, cellSize, grid) {
    this.ctx = ctx;
    this.grid = grid.map((row) =>
      row.map(
        (cell) => new Cell(ctx, cell.row, cell.col, cellSize, cell.isWall)
      )
    );
  }

  draw() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        this.grid[row][col].draw();
      }
    }
  }
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cellSize = canvas.width / 20;
  const rows = Math.floor(canvas.height / cellSize);
  const cols = Math.floor(canvas.width / cellSize);

  grid = new Grid(ctx, cellSize, createGrid([], rows, cols));
  grid.draw();
}

window.onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  init();
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(gridAnimation);

  init();
});
