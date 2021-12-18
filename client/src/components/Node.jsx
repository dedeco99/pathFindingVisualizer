import React from "react";

function Node({ node, onMouseDown, onMouseEnter, onMouseUp }) {
  return (
    <div
      id={`node-${node.row}-${node.col}`}
      className={`node ${
        node.isStart
          ? "isStart"
          : node.isEnd
          ? "isEnd"
          : node.isWall
          ? "isWall"
          : ""
      }`}
      onMouseDown={() => onMouseDown(node.row, node.col)}
      onMouseEnter={() => onMouseEnter(node.row, node.col)}
      onMouseUp={() => onMouseUp(node.row, node.col)}
    />
  );
}

export default Node;
