import React, { useEffect, useRef }from 'react'

import './Node.css'

const Node = (props) => {

  const classes= [
      "node",
      props.isStartNode ? "start" 
      : props.isEndNode ? "end" 
      : props.isWall ? "wall"
      : props.isVisited ? "visited"
      : props.isPath ? "path" : ""
    ].join(" ").trim();

  function dragStart(e) {
    e.preventDefault()
  }

  return (
    <div
      onDragStart={(e) => dragStart(e)}
      id={props.row + "-" + props.col}
      className={classes} 
      onMouseDown={() => props.onMouseDown(props.row, props.col)}
      onMouseUp={() => props.onMouseUp()}
      onMouseEnter={() => props.onMouseEnter(props.row, props.col)}
      onClick={() => props.onClick(props.row, props.col)}
    />
  )
}

export default Node;