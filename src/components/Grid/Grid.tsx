import React, { useState, useCallback } from 'react';
import type { GridNode as GridNodeType, Position } from '../../algorithms/types';
import GridNode from './GridNode';
import './Grid.css';

interface GridProps {
  grid: GridNodeType[][];
  onNodeMouseDown: (pos: Position, button: number) => void;
  onNodeMouseEnter: (pos: Position) => void;
  onNodeMouseUp: () => void;
  onNodeContextMenu: (e: React.MouseEvent, pos: Position) => void;
  isVisualizing: boolean;
}

const Grid: React.FC<GridProps> = ({
  grid,
  onNodeMouseDown,
  onNodeMouseEnter,
  onNodeMouseUp,
  onNodeContextMenu,
  isVisualizing,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, pos: Position) => {
      if (!isVisualizing) {
        setIsMouseDown(true);
        onNodeMouseDown(pos, e.button);
      }
    },
    [onNodeMouseDown, isVisualizing]
  );

  const handleMouseEnter = useCallback(
    (pos: Position) => {
      if (isMouseDown && !isVisualizing) {
        onNodeMouseEnter(pos);
      }
    },
    [onNodeMouseEnter, isMouseDown, isVisualizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    onNodeMouseUp();
  }, [onNodeMouseUp]);

  return (
    <div
      className="grid-container"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 24px)`,
        gridAutoRows: '24px',
      }}
    >
      {grid.map((row) =>
        row.map((node) => (
          <div
            key={`${node.position.row}-${node.position.col}`}
            onMouseDown={(e) => handleMouseDown(e, node.position)}
            onMouseEnter={() => handleMouseEnter(node.position)}
            onContextMenu={(e) => onNodeContextMenu(e, node.position)}
            style={{ width: '100%', height: '100%' }}
          >
            <GridNode
              node={node}
              onMouseDown={() => {}}
              onMouseEnter={() => {}}
              onMouseUp={handleMouseUp}
              onContextMenu={(e) => onNodeContextMenu(e, node.position)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Grid;
