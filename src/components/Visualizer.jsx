import React, { useState, useEffect} from 'react'

import ReactHoverObserver from 'react-hover-observer';

import Node from './Node'
import dijkstras from '../algorithms/dijkstras';

import './Visualizer.css'
import { selectOptions } from '@testing-library/user-event/dist/select-options';

const NUM_ROWS = 25;
const NUM_COLS = 50;

const Visualizer = (props) => {

  const [startCoords, setStartCoords] = useState([Math.floor(NUM_ROWS/2), 9]);
  const [endCoords, setEndCoords] = useState([Math.floor(NUM_ROWS/2), 40]);

  const [grid, setGrid] = useState(initGrid());

  const [mouseDown, setMouseDown] = useState(false);

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
        
        n = n.filter((node) => !node["isWall"] && !node["isVisited"] && !node["isStartNode"]);
    
        return n
      }
    };
  }


  /**
   * Update grid with new start and end states.
   */
  function updateGrid() {
    // hide start node while not placed
    let g = [...[...grid]];
    g[startCoords[0]][startCoords[1]]["isStartNode"] = true;
    g[endCoords[0]][endCoords[1]]["isEndNode"] = true;

    setGrid(g);
  }

  function animateDijkstras() {
    const [journey, path] = dijkstras(grid, grid[startCoords[0]][startCoords[1]]);
    animatePath(journey, path);
  }

  function animatePath(journey, path) {

    for (let i = 0; i < journey.length; i++) {
      setTimeout(() => {
        let row = journey[i]["row"];
        let col = journey[i]["col"];
        document.getElementById(row+"-"+col).className += " visited"
      }, 10 * i);
    }
    setTimeout(() => {
      for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
          let row = path[i]["row"];
          let col = path[i]["col"];
          document.getElementById(row+"-"+col).className += " path";
        }
        , 50 * i);
      }
    }, 10 * journey.length);

  }

  return (
    <div>
      <button onClick={() => animateDijkstras()}>Visualize!</button>
      <div className="visualizer">
        {grid.map((row, rowIndex) => {
          return (
            <div className="row" key={rowIndex}>
              {row.map((node, nodeIndex) => {
                const {row, col, isWall, isStartNode, isEndNode, isVisited } = node;
                return (
                  <Node 
                    row={row}
                    col={col}
                    isWall={isWall}
                    isStartNode={isStartNode}
                    isEndNode={isEndNode}
                    isVisited={isVisited}
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
    toggleWall(row, col);
    setMouseDown(true);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleMouseEnter(row, col) {
    let node = grid[row][col];

    if (mouseDown) {
      if (node["isStartNode"]) {
        moveStartNode(row, col);
      } else if (node["isEndNode"]) {
        moveEndNode(row, col)
      } else {
        toggleWall(row, col);
      }
    }
  }

  function handleMouseClick(row, col) {
    toggleWall(row, col);
    toggleWall(row, col);
  }

  function toggleWall(row, col) {
    let g = [...[...grid]];
    g[row][col]["isWall"] = !g[row][col]["isWall"];
    setGrid(g);
  }

  function moveStartNode(row, col) {
    let g = [...[...grid]];
    g[startCoords[0]][startCoords[1]]["isStartNode"] = false;
    g[row][col]["isStartNode"] = true;
    setStartCoords([row, col])
    setGrid(g);
  }

  function moveEndNode(row, col) {
    let g = [...[...grid]];
    g[endCoords[0]][endCoords[1]]["isEndNode"] = false;
    g[row][col]["isEndNode"] = true;
    setEndCoords([row, col])
    setGrid(g);
  }
}

export default Visualizer;