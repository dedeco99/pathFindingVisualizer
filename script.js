let canvas;
let ctx;
let gridVisualization;
let gridVisualizationAnimation;

class Cell {
  constructor(ctx, row, col, size, isStart, isEnd, isWall, isPath) {
    this.ctx = ctx;
    this.row = row;
    this.col = col;
    this.size = size;
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.isWall = isWall;
    this.isPath = isPath;
    this.isVisited = false;
  }

  draw(color) {
    ctx.beginPath();

    ctx.strokeStyle = "white";
    ctx.rect(this.col * this.size, this.row * this.size, this.size, this.size);
    ctx.stroke();

    if (this.isStart) {
      ctx.fillStyle = "orange";
      ctx.fill();
    } else if (this.isEnd) {
      ctx.fillStyle = "purple";
      ctx.fill();
    } else if (this.isWall) {
      ctx.fillStyle = "orangered";
      ctx.fill();
    } else if (this.isPath) {
      ctx.fillStyle = "darkblue";
      ctx.fill();
    } else if (this.isVisited) {
      ctx.fillStyle = "darkcyan";
      ctx.fill();
    } else if (color) {
      ctx.fillStyle = color;
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
  constructor(ctx, cellSize, grid, states) {
    this.ctx = ctx;
    this.grid = grid.map((row) =>
      row.map(
        (cell) =>
          new Cell(
            ctx,
            cell.row,
            cell.col,
            cellSize,
            cell.isStart,
            cell.isEnd,
            cell.isWall,
            cell.isPath
          )
      )
    );
    this.states = states;
    this.lastTimestamp = 0;
    this.interval = 1000 / 30;
    this.timer = 0;

    this.animatingStateIndex = 0;
    this.animatingPathIndex = 0;
    this.isFinished = false;
  }

  draw() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        this.grid[row][col].draw();
      }
    }

    const currentState = this.states[this.animatingStateIndex];

    if (currentState) {
      if (currentState.path) {
        const currentPathNode = currentState.path[this.animatingPathIndex];

        if (currentPathNode) {
          this.grid[currentPathNode.row][currentPathNode.col].draw("darkblue");
          this.grid[currentPathNode.row][currentPathNode.col].isPath = true;

          this.animatingPathIndex++;
        } else {
          this.animatingStateIndex++;
        }
      } else {
        for (const node of currentState.openSet) {
          this.grid[node.row][node.col].draw("darkturquoise");
        }

        for (const node of currentState.closedSet) {
          this.grid[node.row][node.col].draw("darkcyan");
          this.grid[node.row][node.col].isVisited = true;
        }

        this.animatingStateIndex++;
      }
    } else {
      cancelAnimationFrame(gridVisualizationAnimation);

      this.isFinished = true;
    }
  }

  animate(timestamp) {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (this.timer > this.interval) {
      // Clear the whole canvas every animation
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      this.draw();

      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    if (!this.isFinished) {
      gridVisualizationAnimation = requestAnimationFrame(
        this.animate.bind(this)
      );
    }
  }
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cellSize = canvas.width / 20;
  const rows = Math.floor(canvas.height / cellSize);
  const cols = Math.floor(canvas.width / cellSize);

  const originalGrid = createGrid([], rows, cols, false);
  const grid = createGrid([], rows, cols, false);

  const startNodePosition = { row: 0, col: 0 };
  const endNodePosition = { row: rows - 1, col: cols - 1 };

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (startNodePosition.row == row && startNodePosition.col == col) {
        grid[row][col].isStart = true;
        originalGrid[row][col].isStart = true;
      } else if (endNodePosition.row === row && endNodePosition.col === col) {
        grid[row][col].isEnd = true;
        originalGrid[row][col].isEnd = true;
      } else {
        const isWall = Math.random(1) < 0.3;

        grid[row][col].isWall = isWall;
        originalGrid[row][col].isWall = isWall;
      }
    }
  }

  const startNode = grid[0][0];
  const endNode = grid[rows - 1][cols - 1];

  const states = aStar(startNode, endNode);

  gridVisualization = new Grid(ctx, cellSize, originalGrid, states);
  gridVisualization.animate(0);
}

window.onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  init();
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(gridVisualizationAnimation);

  init();
});
