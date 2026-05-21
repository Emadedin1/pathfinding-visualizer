import type { Position } from '../algorithms/types';

// Recursive Division Maze Generation
// Divides the grid recursively and creates passages
export const recursiveDivisionMaze = (
  rows: number,
  cols: number,
  start: Position,
  target: Position
): Position[] => {
  const walls: Position[] = [];

  // Start with empty grid, recursively add walls
  const divide = (
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    horizontal: boolean
  ) => {
    if (rowEnd - rowStart < 2 || colEnd - colStart < 2) {
      return;
    }

    if (horizontal) {
      // Create horizontal wall
      const row = rowStart + Math.floor(Math.random() * (rowEnd - rowStart - 1));
      const passageCol =
        colStart + Math.floor(Math.random() * (colEnd - colStart));

      for (let c = colStart; c < colEnd; c++) {
        if (c !== passageCol) {
          const pos = { row, col: c };
          if (!isStartOrTarget(pos, start, target)) {
            walls.push(pos);
          }
        }
      }

      divide(rowStart, row, colStart, colEnd, false);
      divide(row + 1, rowEnd, colStart, colEnd, false);
    } else {
      // Create vertical wall
      const col = colStart + Math.floor(Math.random() * (colEnd - colStart - 1));
      const passageRow =
        rowStart + Math.floor(Math.random() * (rowEnd - rowStart));

      for (let r = rowStart; r < rowEnd; r++) {
        if (r !== passageRow) {
          const pos = { row: r, col };
          if (!isStartOrTarget(pos, start, target)) {
            walls.push(pos);
          }
        }
      }

      divide(rowStart, rowEnd, colStart, col, true);
      divide(rowStart, rowEnd, col + 1, colEnd, true);
    }
  };

  divide(0, rows, 0, cols, Math.random() > 0.5);
  return walls;
};

// Random Walls Maze Generation
export const randomWallsMaze = (
  rows: number,
  cols: number,
  start: Position,
  target: Position,
  density: number = 0.3
): Position[] => {
  const walls: Position[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = { row: r, col: c };
      if (
        !isStartOrTarget(pos, start, target) &&
        Math.random() < density
      ) {
        walls.push(pos);
      }
    }
  }

  return walls;
};

// Random Weights
export const randomWeightsMaze = (
  rows: number,
  cols: number,
  start: Position,
  target: Position,
  density: number = 0.1
): Position[] => {
  const weights: Position[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = { row: r, col: c };
      if (
        !isStartOrTarget(pos, start, target) &&
        Math.random() < density
      ) {
        weights.push(pos);
      }
    }
  }

  return weights;
};

// Stair Pattern
export const stairsPattern = (
  rows: number,
  cols: number,
  start: Position,
  target: Position
): Position[] => {
  const walls: Position[] = [];
  const stepSize = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = { row: r, col: c };
      if (isStartOrTarget(pos, start, target)) continue;

      // Create stair pattern
      const stairRow = Math.floor(r / stepSize);
      const stairCol = Math.floor(c / stepSize);

      // Draw stairs diagonally
      if (stairRow === stairCol) {
        const offset = r % stepSize;
        const colOffset = c % stepSize;

        // Create stair blocks
        if (colOffset < offset) {
          walls.push(pos);
        }
      }
    }
  }

  return walls;
};

// Helper function to check if position is start or target
const isStartOrTarget = (pos: Position, start: Position, target: Position): boolean => {
  return (
    (pos.row === start.row && pos.col === start.col) ||
    (pos.row === target.row && pos.col === target.col)
  );
};
