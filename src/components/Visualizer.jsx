import React, { useState, useEffect} from 'react'
import Node from './Node'

import './Visualizer.css'

const Visualizer = (props) => {

  const [startCoords, setStartCoords] = useState([12, 9]);
  const [endCoords, setEndCoords] = useState([12, 40]);

  const [grid, setGrid] = useState(initGrid());

  const [mouseDown, setMouseDown] = useState(false);
  const [moveStart, setMoveStart] = useState(false);
  const [moveEnd, setMoveEnd] = useState(false);

  useEffect(() => {
    updateGrid();
  }, [startCoords, endCoords, moveStart, moveEnd]);

  /**
   * Return a multidimensional array of node objects.
   * @returns Object[][]
   */
  function initGrid() {
    const g = []
    for (let row = 0; row < 25; row += 1) {
      const gridRow = []
      for (let col = 0; col < 50; col += 1) {
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
   * @returns 
   */
  function initNode(row, col) {
    return {
      row: row,
      col: col,
      isWall: false,
      isStartNode: false,
      isEndNode: false,
      isVisited: false,
    };
  }

  /**
   * Update grid with new states.
   */
  function updateGrid() {
    // hide start node while not placed
    let g = [...[...grid]];
    g[startCoords[0]][startCoords[1]]["isStartNode"] = true;
    g[endCoords[0]][endCoords[1]]["isEndNode"] = true;

    setGrid(g);
  }

  function handleMouseDown() {
    setMouseDown(true);
  }

  function handleMouseOver(row, col) {
    if (mouseDown) {
      toggleWall(row, col);
    }
  }

  function handleMouseClick(row, col) {
    toggleWall(row, col);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  return (
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
                  onMouseDown={() => handleMouseDown()}
                  onMouseOver={(row, col) => handleMouseOver(row, col)}
                  onClick={(row, col) => handleMouseClick(row, col)}
                  onMouseUp={() => handleMouseUp()}
                />
              )
            })}
          </div>
        );
      })}
    </div>
  )

  function toggleWall(row, col) {
    let g = [...[...grid]];
    g[row][col]["isWall"] = !g[row][col]["isWall"];
    setGrid(g);
  }
}

export default Visualizer;