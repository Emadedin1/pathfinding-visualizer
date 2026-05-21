import React, { memo } from 'react';
import type { GridNode as GridNodeType, Position } from '../../algorithms/types';
import './Grid.css';

interface GridNodeProps {
  node: GridNodeType;
  onMouseDown: (pos: Position) => void;
  onMouseEnter: (pos: Position) => void;
  onMouseUp: () => void;
  onContextMenu: (e: React.MouseEvent, pos: Position) => void;
}

const GridNode: React.FC<GridNodeProps> = memo(
  ({ node, onMouseDown, onMouseEnter, onMouseUp, onContextMenu }) => {
    const getNodeClass = (): string => {
      const classes = ['grid-node'];

      switch (node.type) {
        case 'start':
          classes.push('node-start');
          break;
        case 'target':
          classes.push('node-target');
          break;
        case 'wall':
          classes.push('node-wall');
          break;
        case 'weight':
          classes.push('node-weight');
          break;
        case 'visited':
          classes.push('node-visited');
          break;
        case 'path':
          classes.push('node-path');
          break;
        default:
          classes.push('node-empty');
      }

      return classes.join(' ');
    };

    return (
      <div
        className={getNodeClass()}
        onMouseDown={() => onMouseDown(node.position)}
        onMouseEnter={() => onMouseEnter(node.position)}
        onMouseUp={onMouseUp}
        onContextMenu={(e) => onContextMenu(e, node.position)}
        role="button"
        tabIndex={0}
        aria-label={`Node at row ${node.position.row}, col ${node.position.col}, type ${node.type}`}
      />
    );
  }
);

GridNode.displayName = 'GridNode';

export default GridNode;
