import type { Position } from '../algorithms/types';

const isStartOrTarget = (pos: Position, start: Position, target: Position): boolean => {
  return (
    (pos.row === start.row && pos.col === start.col) ||
    (pos.row === target.row && pos.col === target.col)
  );
};

const chooseOrientation = (
  width: number,
  height: number,
  preferHorizontal: boolean
): boolean => {
  if (width < height) return true;
  if (height < width) return false;
  return preferHorizontal;
};

export const recursiveDivisionMaze = (
  rows: number,
  cols: number,
  start: Position,
  target: Position
): Position[] => {
  const walls: Position[] = [];

  const divide = (
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    horizontal: boolean
  ) => {
    const height = rowEnd - rowStart;
    const width = colEnd - colStart;

    if (height < 3 || width < 3) {
      return;
    }

    const splitHorizontal = chooseOrientation(width, height, horizontal);

    if (splitHorizontal) {
      const wallRow = rowStart + Math.floor(Math.random() * (height - 2)) + 1;
      const passageCol = colStart + Math.floor(Math.random() * (width - 2)) + 1;

      for (let col = colStart; col < colEnd; col++) {
        if (col === passageCol) continue;
        const pos = { row: wallRow, col };
        if (!isStartOrTarget(pos, start, target)) {
          walls.push(pos);
        }
      }

      divide(rowStart, wallRow, colStart, colEnd, false);
      divide(wallRow + 1, rowEnd, colStart, colEnd, false);
    } else {
      const wallCol = colStart + Math.floor(Math.random() * (width - 2)) + 1;
      const passageRow = rowStart + Math.floor(Math.random() * (height - 2)) + 1;

      for (let row = rowStart; row < rowEnd; row++) {
        if (row === passageRow) continue;
        const pos = { row, col: wallCol };
        if (!isStartOrTarget(pos, start, target)) {
          walls.push(pos);
        }
      }

      divide(rowStart, rowEnd, colStart, wallCol, true);
      divide(rowStart, rowEnd, wallCol + 1, colEnd, true);
    }
  };

  divide(0, rows, 0, cols, rows <= cols);
  return walls;
};

export const randomWallsMaze = (
  rows: number,
  cols: number,
  start: Position,
  target: Position,
  density: number = 0.25
): Position[] => {
  const walls: Position[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = { row: r, col: c };
      if (!isStartOrTarget(pos, start, target) && Math.random() < density) {
        walls.push(pos);
      }
    }
  }

  return walls;
};

export const randomWeightsMaze = (
  rows: number,
  cols: number,
  start: Position,
  target: Position,
  density: number = 0.20
): Position[] => {
  const weights: Position[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = { row: r, col: c };
      if (!isStartOrTarget(pos, start, target) && Math.random() < density) {
        weights.push(pos);
      }
    }
  }

  return weights;
};

export const stairsPattern = (
  rows: number,
  cols: number,
  start: Position,
  target: Position
): Position[] => {
  const walls: Position[] = [];
  const stepHeight = Math.max(2, Math.floor(rows / 10));
  const stepWidth = Math.max(4, Math.floor(cols / 12));

  let row = 2;
  let col = 2;

  while (row < rows - 1 && col < cols - 1) {
    const endCol = Math.min(col + stepWidth, cols - 2);
    for (let c = col; c <= endCol; c++) {
      const pos = { row, col: c };
      if (!isStartOrTarget(pos, start, target)) {
        walls.push(pos);
      }
    }

    const endRow = Math.min(row + stepHeight, rows - 2);
    for (let r = row; r <= endRow; r++) {
      const pos = { row: r, col: endCol };
      if (!isStartOrTarget(pos, start, target)) {
        walls.push(pos);
      }
    }

    row += stepHeight + 1;
    col += stepWidth + 1;
  }

  return walls;
};
