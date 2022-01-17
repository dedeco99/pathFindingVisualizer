let canvas;
let ctx;

let cellsInput;
let startButton;
let resetButton;

let cellSize;
let originalGrid;
let grid;
let startNode;
let endNode;

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
    this.isVisited = false;
    this.isPath = isPath;
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
  }
}

class Grid {
  constructor(ctx, cellSize, grid) {
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
    this.states = [];
    this.lastTimestamp = 0;
    this.interval = 1000 / 30;
    this.timer = 0;

    this.animatingStateIndex = 0;
    this.animatingPathIndex = 0;
    this.isRunning = false;
    this.isFinished = false;
  }

  setStartNode(row, col) {
    this.grid[row][col].isStart = true;

    this.grid[row][col].draw();
  }

  setEndNode(row, col) {
    this.grid[row][col].isEnd = true;

    this.grid[row][col].draw();
  }

  setWallNode(row, col) {
    this.grid[row][col].isWall = true;

    this.grid[row][col].draw();
  }

  setIsRunning(isRunning) {
    this.isRunning = isRunning;
  }

  setStates(states) {
    this.states = states;
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
    } else if (this.isRunning) {
      cancelAnimationFrame(gridVisualizationAnimation);

      this.isRunning = false;
      this.isFinished = true;

      startButton.disabled = true;
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

    if (this.isRunning) {
      gridVisualizationAnimation = requestAnimationFrame(
        this.animate.bind(this)
      );
    }
  }
}

function init() {
  let cells = cellsInput.value;

  container = document.getElementById("container");

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight - 80;

  cellSize = canvas.width / cells;
  const rows = Math.floor(canvas.height / cellSize);
  const cols = Math.floor(canvas.width / cellSize);

  originalGrid = createGrid([], rows, cols, false);
  grid = createGrid([], rows, cols, false);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const isWall = Math.random(1) < 0.3;

      grid[row][col].isWall = isWall;
      originalGrid[row][col].isWall = isWall;
    }
  }

  gridVisualization = new Grid(ctx, cellSize, originalGrid);

  gridVisualization.draw();
}

window.onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  cellsInput = document.getElementById("cells");
  startButton = document.getElementById("startButton");
  resetButton = document.getElementById("resetButton");

  cellsInput.addEventListener("change", (e) => {
    cells = e.target.value;

    cancelAnimationFrame(gridVisualizationAnimation);

    init();
  });

  startButton.addEventListener("click", () => {
    if (!gridVisualization.states.length) {
      gridVisualization.setStates(aStar(startNode, endNode));
    }

    gridVisualization.setIsRunning(!gridVisualization.isRunning);
    gridVisualization.animate(0);
  });

  resetButton.addEventListener("click", () => {
    originalGrid = null;
    grid = null;
    startNode = null;
    endNode = null;

    startButton.disabled = false;

    cancelAnimationFrame(gridVisualizationAnimation);

    init();
  });

  canvas.addEventListener("click", (e) => {
    if (!gridVisualization.isRunning && !gridVisualization.isFinished) {
      const row = Math.floor(e.offsetY / cellSize);
      const col = Math.floor(e.offsetX / cellSize);

      if (!startNode) {
        startNode = grid[row][col];

        originalGrid[row][col].isStart = true;
        grid[row][col].isStart = true;

        gridVisualization.setStartNode(row, col);
      } else if (!endNode) {
        if (grid[row][col] !== startNode) {
          endNode = grid[row][col];

          originalGrid[row][col].isEnd = true;
          grid[row][col].isEnd = true;

          gridVisualization.setEndNode(row, col);
        }
      } else {
        originalGrid[row][col].isWall = true;
        grid[row][col].isWall = true;

        gridVisualization.setWallNode(row, col);
      }
    }
  });

  init();
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(gridVisualizationAnimation);

  init();
});
