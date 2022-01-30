import Draggable from 'react-draggable';
import { useRef } from 'react';

import './Node.css'

const Node = (props) => {

  const nodeRef = useRef(null);

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

  let node =     
    <div
      ref={nodeRef}
      onDragStart={(e) => dragStart(e)}
      id={props.row + "-" + props.col}
      className={classes} 
      onMouseDown={() => props.onMouseDown(props.row, props.col)}
      onMouseUp={() => props.onMouseUp()}
      onMouseEnter={() => props.onMouseEnter(props.row, props.col)}
      onClick={() => props.onClick(props.row, props.col)}
    >
      { props.isStartNode ? <i className="fas fa-angle-right va" style={{verticalAlign: "50%"}}></i> 
      : props.isEndNode? <i className="fas fa-check va" style={{verticalAlign: "5%"}}></i>
      : props.weight > 1 ? <i className="fas fa-weight-hanging" style={{color: "#084b4c"}}></i>
      : <div/>}
    </div>;

  return (
    node
  )
  
}

export default Node;