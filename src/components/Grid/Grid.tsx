import React, { useState, useCallback } from 'react';
import type { GridNode as GridNodeType, Position } from '../../algorithms/types';
import GridNode from './GridNode';
import './Grid.css';

interface GridProps {
  grid: GridNodeType[][];
  onNodeMouseDown: (pos: Position, button: number) => void;
  onNodeMouseEnter: (pos: Position, button: number | null) => void;
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
  const [mouseButton, setMouseButton] = useState<number | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, pos: Position) => {
      if (!isVisualizing) {
        setIsMouseDown(true);
        setMouseButton(e.button);
        onNodeMouseDown(pos, e.button);
      }
    },
    [onNodeMouseDown, isVisualizing]
  );

  const handleMouseEnter = useCallback(
    (pos: Position) => {
      if (isMouseDown && !isVisualizing) {
        onNodeMouseEnter(pos, mouseButton);
      }
    },
    [isMouseDown, mouseButton, onNodeMouseEnter, isVisualizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setMouseButton(null);
    onNodeMouseUp();
  }, [onNodeMouseUp]);

  return (
    <div
      className="grid-container"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: '100%',
        maxWidth: '100%',
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
        gridAutoRows: 'auto',
      }}
    >
      {grid.map((row) =>
        row.map((node) => (
          <GridNode
            key={`${node.position.row}-${node.position.col}`}
            node={node}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => onNodeContextMenu(e, node.position)}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
