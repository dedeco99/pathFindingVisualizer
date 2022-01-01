class Node {
  constructor(row, col, cost) {
    this.row = row;
    this.col = col;
    this.neighbors = [];
    this.f = Infinity;
    this.g = Infinity;
    this.cost = cost;
    this.previousNode = null;
    this.isWall = Math.random(1) < 0.3;
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
