class Node {
  constructor(row, col, cost, diagonalsAllowed) {
    this.row = row;
    this.col = col;
    this.neighbors = [];
    this.diagonalsAllowed = diagonalsAllowed;
    this.f = Infinity;
    this.g = Infinity;
    this.cost = cost;
    this.previousNode = null;
    this.isStart = false;
    this.isEnd = false;
    this.isWall = false;
    this.isPath = false;
  }

  addNeighbors(grid) {
    if (grid[this.row - 1]) {
      this.neighbors.push(grid[this.row - 1][this.col]);
    }
    if (grid[this.row][this.col + 1]) {
      this.neighbors.push(grid[this.row][this.col + 1]);
    }
    if (grid[this.row + 1]) {
      this.neighbors.push(grid[this.row + 1][this.col]);
    }
    if (grid[this.row][this.col - 1]) {
      this.neighbors.push(grid[this.row][this.col - 1]);
    }

    if (this.diagonalsAllowed) {
      if (grid[this.row - 1] && grid[this.row - 1][this.col + 1]) {
        this.neighbors.push(grid[this.row - 1][this.col + 1]);
      }
      if (grid[this.row + 1] && grid[this.row + 1][this.col + 1]) {
        this.neighbors.push(grid[this.row + 1][this.col + 1]);
      }
      if (grid[this.row + 1] && grid[this.row + 1][this.col - 1]) {
        this.neighbors.push(grid[this.row + 1][this.col - 1]);
      }
      if (grid[this.row - 1] && grid[this.row - 1][this.col - 1]) {
        this.neighbors.push(grid[this.row - 1][this.col - 1]);
      }
    }
  }
}
