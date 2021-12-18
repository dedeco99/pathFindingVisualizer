import React, { useState, useEffect } from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../utils/dijkstra";

import Node from "./Node";

function Visualizer() {
  const [nodes, setNodes] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [nodeType, setNodeType] = useState("start");

  useEffect(() => {
    const newNodes = [];

    for (let row = 0; row < 40; row++) {
      newNodes[row] = [];
      for (let col = 0; col < 40; col++) {
        newNodes[row].push({
          row,
          col,
          isStart: false,
          isEnd: false,
          distance: Infinity,
          isVisited: false,
          isPath: false,
          isWall: false,
          previousNode: null,
        });
      }
    }

    setNodes(newNodes);
  }, []);

  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (nodeType === "start") {
      if (startNode && startNode !== node) return;

      node.isStart = !node.isStart;
      setStartNode(node.isStart ? node : null);
    } else if (nodeType === "end") {
      if (endNode && endNode !== node) return;

      node.isEnd = !node.isEnd;
      setEndNode(node.isEnd ? node : null);
    } else if (nodeType === "wall") {
      node.isWall = !node.isWall;
    }

    newGrid[row][col] = node;

    setNodes(newGrid);
  }

  function handleMouseDown(row, col) {
    getNewGridWithWallToggled(nodes, row, col);

    if (nodeType === "wall") setMouseDown(true);
  }

  function handleMouseEnter(row, col) {
    if (!mouseDown) return;

    getNewGridWithWallToggled(nodes, row, col);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleNodeTypeChange(e) {
    setNodeType(e.target.value);
  }

  function animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
              const node = nodesInShortestPathOrder[i];
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node isPath";
            }, 25 * i);
          }
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node isVisited";
      }, 10 * i);
    }
  }

  function visualize() {
    const visitedNodes = dijkstra(
      nodes,
      nodes[startNode.row][startNode.col],
      nodes[endNode.row][endNode.col]
    );

    const path = getNodesInShortestPathOrder(nodes[endNode.row][endNode.col]);

    animate(visitedNodes, path);
  }

  return (
    <div>
      <button onClick={visualize}>Visualize</button>
      <br />
      <select onChange={handleNodeTypeChange} value={nodeType}>
        <option value="start">Start</option>
        <option value="end">End</option>
        <option value="wall">Wall</option>
      </select>
      <div className="grid">
        {nodes.map((row, index) => (
          <div key={index}>
            {row.map((node) => (
              <Node
                key={`${node.row}-${node.col}`}
                node={node}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visualizer;
