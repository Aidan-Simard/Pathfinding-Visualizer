import { useEffect, useState } from 'react';

import bfs from '../algorithms/bfs';
import dfs from '../algorithms/dfs';
import dijkstras from '../algorithms/dijkstras';
import Node from './Node';

import './Visualizer.css';

const NUM_ROWS = 25;
const NUM_COLS = 50;

const Visualizer = (props) => {

  const [moveStart, setMoveStart] = useState(false);
  const [moveEnd, setMoveEnd] = useState(false);
  const [startCoords, setStartCoords] = useState([Math.floor(NUM_ROWS/2), 9]);
  const [endCoords, setEndCoords] = useState([Math.floor(NUM_ROWS/2), 40]);
  const [grid, setGrid] = useState(initGrid());
  const [mouseDown, setMouseDown] = useState(false);
  const [startVis, setStartVis] = useState(false);

  useEffect(() => {
    updateGrid();
  }, [startCoords, endCoords]);

  /**
   * Return a multidimensional array of node objects.
   * @returns {Object[][]}
   */
  function initGrid() {
    const g = []
    for (let row = 0; row < NUM_ROWS; row += 1) {
      const gridRow = []
      for (let col = 0; col < NUM_COLS; col += 1) {
        gridRow.push(initNode(row, col));
      }
      g.push(gridRow);
    }

    // set start & end node
    g[startCoords[0]][startCoords[1]]["isStartNode"] = true;
    g[endCoords[0]][endCoords[1]]["isEndNode"] = true;

    return g;
  }

  /**
   * Return a node object.
   * @param {Number} row 
   * @param {Number} col 
   * @returns {Object}
   */
  function initNode(row, col) {
    let toString = row.toString() + "-" + col.toString();
    return {
      row: row,
      col: col,

      isWall: false,
      isVisited: false,
      isPath: false,

      isStartNode: false,
      isEndNode: false,
      weight: 1,
      
      toString: toString,
      getNodeNeighbors:   
        (graph, node) => {
        let row = node[0];
        let col = node[1];

        let n = [];

        if (row+1 < NUM_ROWS) {
          n.push(graph[row+1][col])
        }

        if (col+1 < NUM_COLS) {
          n.push(graph[row][col+1])
        }
        
        if (row-1 >= 0) {
          n.push(graph[row-1][col])
        }
        
        if (col-1 >= 0) {
          n.push(graph[row][col-1])
        }
        
        n = n.filter((node) => !node["isWall"] && !node["isStartNode"]);
    
        return n
      }
    };
  }


  /**
   * Update grid.
   */
  function updateGrid() {
    let g = [...[...grid]];
    g[startCoords[0]][startCoords[1]]["isStartNode"] = true;
    g[endCoords[0]][endCoords[1]]["isEndNode"] = true;

    setGrid(g);
  }

  /**
   * Animate Dijkstra's algorithm.
   */
  function animateDijkstras() {
    const [journey, path] = dijkstras(grid, grid[startCoords[0]][startCoords[1]]);
    animatePath(journey, path);
  }

  /**
   * Animate BFS.
   */
  function animateBFS() {
    const [journey, path] = bfs(grid, grid[startCoords[0]][startCoords[1]]);
    animatePath(journey, path)
  }
  
  /**
   * Animate DFS.
   */
   function animateDFS() {
    const [journey, path] = dfs(grid, grid[startCoords[0]][startCoords[1]]);
    animatePath(journey, path)
  }

  /**
   * Animate a journey (visited nodes) and path.
   * @param {Object[]} journey 
   * @param {Object[]} path 
   */
  function animatePath(journey, path) {

    setStartVis(true);
    clearGrid();

    let start = document.getElementById(startCoords[0]+"-"+startCoords[1]);
    let end = document.getElementById(endCoords[0]+"-"+endCoords[1]);

    start.classList.add("visited");

    for (let i = 0; i < journey.length; i++) {
      setTimeout(() => {
        let row = journey[i]["row"];
        let col = journey[i]["col"];
        document.getElementById(row+"-"+col).classList.add("visited");
      }, 10 * i);
    }
    setTimeout(() => {

      end.classList.remove("visited");
      end.classList.add("path");

      for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
          let row = path[i]["row"];
          let col = path[i]["col"];
          let node = document.getElementById(row+"-"+col);
          node.classList.remove("visited")
          node.classList.add("path");
        }
        , 50 * i);
      }

      setTimeout(() => {
        start.classList.add("path");
        setStartVis(false);
      }, 50 * path.length)
      
    }, 10 * journey.length);

  }

  return (
    <div>
      <button className="btn" onClick={() => reset()}>Reset</button>
      <button className="btn" onClick={() => randomWeight()}>Random Weight</button>
      <button className="btn" onClick={() => animateDijkstras()}>Dijkstra's</button>
      <button className="btn" onClick={() => animateBFS()}>BFS</button>
      <button className="btn" onClick={() => animateDFS()}>DFS</button>
      <div className="visualizer">
        {grid.map((row, rowIndex) => {
          return (
            <div className="row" key={rowIndex}>
              {row.map((node, nodeIndex) => {
                const {row, col, weight, isWall, isStartNode, isEndNode, isVisited } = node;
                return (
                  <Node 
                    row={row}
                    col={col}
                    isWall={isWall}
                    isStartNode={isStartNode}
                    isEndNode={isEndNode}
                    isVisited={isVisited}
                    weight={weight}
                    key={rowIndex.toString() + "-" + nodeIndex.toString()}
                    onMouseDown={() => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onClick={(row, col) => handleMouseClick(row, col)}
                    onMouseUp={() => handleMouseUp()}
                  />
                )
              })}
            </div>
          );
        })}
      </div>
    </div>
  )

  function handleMouseDown(row, col) {
    if (startVis) { return; }
    setMouseDown(true);

    if (grid[row][col].isStartNode) {
      setMoveStart(true);
    } else if (grid[row][col].isEndNode) {
      setMoveEnd(true);
    } else {
      toggleWall(row, col);
    }
  }

  function handleMouseUp() {
    if (startVis) { return; }

    // clean start/end artifacts
    let g = [...[...grid]];
    clearAllOfType(g, "isStartNode");
    clearAllOfType(g, "isEndNode");
    updateGrid();

    setMoveStart(false);
    setMoveEnd(false);
    setMouseDown(false);
  }

  function handleMouseEnter(row, col) {
    if (startVis) { return; }

    if (mouseDown) {
      if (moveStart) {
        moveStartNode(row, col);
      } else if (moveEnd) {
        moveEndNode(row, col)
      } else {
        toggleWall(row, col);
      }
    }
  }

  function handleMouseClick(row, col) {
    if (startVis) { return; }

    toggleWall(row, col);
    toggleWall(row, col);
  }

  function toggleWall(row, col) {
    if (startVis) { return; }

    let g = [...[...grid]];
    g[row][col]["isWall"] = !g[row][col]["isWall"];
    setGrid(g);
  }

  function moveStartNode(row, col) {
    if (startVis) { return; }

    let g = [...[...grid]];
    g = clearAllOfType(g, "isStartNode");
    g[row][col]["isStartNode"] = true;
    setStartCoords([row, col])
    setGrid(g);
  }

  function moveEndNode(row, col) {
    if (startVis) { return; }

    let g = [...[...grid]];

    g = clearAllOfType(g, "isEndNode");
    g[row][col]["isEndNode"] = true;
    setEndCoords([row, col])
    setGrid(g);
  }

  function clearAllOfType(g, s) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        g[i][j][s] = false;
      }
    }

    return g;
  }

  function clearGrid() {
    if (startVis) { return; }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        let node = document.getElementById(row+"-"+col)

        if (node.classList.contains("path")) {
          node.classList.remove("path");
        }

        if (node.classList.contains("visited")) {
          node.classList.remove("visited");
        }
      }
    }
  }

  function randomWeight() {
    if (startVis) { return; }

    let g = [...[...grid]];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (Math.random() < 0.2 && !g[row][col]["isWall"]) {
          g[row][col]["weight"] = 4;
        }
      }
    }

    setGrid(g)
  }

  function reset() {
    if (startVis) { return; }

    clearGrid();
    setGrid(initGrid());
  }
}

export default Visualizer;