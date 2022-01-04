import React, { useState, useEffect } from 'react'

import './Node.css'

const Node = (props) => {

  const classes= [
      "node",
      props.row + "-" + props.col,
      props.isStartNode ? "start" 
      : props.isEndNode ? "end" 
      : props.isWall ? "wall" : "",
    ].join(" ").trim();

  return (
    <div 
      className={classes} 
      onMouseDown={() => props.onMouseDown()} 
      onMouseOver={() => props.onMouseOver(props.row, props.col)} 
      onMouseUp={() => props.onMouseUp()}
      onClick={() => props.onClick(props.row, props.col)}
    />
  )
}

export default Node;