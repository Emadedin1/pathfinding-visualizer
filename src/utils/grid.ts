import type { GridNode, Position, NodeType } from '../algorithms/types';

// Create an empty grid with given dimensions
export const createEmptyGrid = (rows: number, cols: number): GridNode[][] => {
  const grid: GridNode[][] = [];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = {
        position: { row: r, col: c },
        type: 'empty',
        weight: 1,
      };
    }
  }

  return grid;
};

// Clone a grid
export const cloneGrid = (grid: GridNode[][]): GridNode[][] => {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      position: { ...node.position },
    }))
  );
};

// Get a node from the grid
export const getNode = (grid: GridNode[][], pos: Position): GridNode | null => {
  if (pos.row < 0 || pos.row >= grid.length || pos.col < 0 || pos.col >= grid[0].length) {
    return null;
  }
  return grid[pos.row][pos.col];
};

// Set a node type in the grid
export const setNodeType = (
  grid: GridNode[][],
  pos: Position,
  type: NodeType
): void => {
  if (pos.row >= 0 && pos.row < grid.length && pos.col >= 0 && pos.col < grid[0].length) {
    grid[pos.row][pos.col].type = type;
  }
};

// Set a node weight
export const setNodeWeight = (
  grid: GridNode[][],
  pos: Position,
  weight: number
): void => {
  if (pos.row >= 0 && pos.row < grid.length && pos.col >= 0 && pos.col < grid[0].length) {
    grid[pos.row][pos.col].weight = weight;
  }
};

// Clear visited and path nodes
export const clearVisualization = (grid: GridNode[][]): GridNode[][] => {
  const newGrid = cloneGrid(grid);

  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[0].length; c++) {
      if (newGrid[r][c].type === 'visited' || newGrid[r][c].type === 'path') {
        newGrid[r][c].type = 'empty';
      }
    }
  }

  return newGrid;
};

// Clear all walls and weights
export const clearWallsAndWeights = (grid: GridNode[][]): GridNode[][] => {
  const newGrid = cloneGrid(grid);

  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[0].length; c++) {
      if (newGrid[r][c].type === 'wall' || newGrid[r][c].type === 'weight') {
        newGrid[r][c].type = 'empty';
        newGrid[r][c].weight = 1;
      }
    }
  }

  return newGrid;
};

// Reset entire grid
export const resetGrid = (rows: number, cols: number, start: Position, target: Position): GridNode[][] => {
  const grid = createEmptyGrid(rows, cols);
  grid[start.row][start.col].type = 'start';
  grid[target.row][target.col].type = 'target';
  return grid;
};

// Get grid dimensions
export const getGridDimensions = (rows: number, cols: number): { rows: number; cols: number } => {
  return { rows, cols };
};

// Calculate appropriate grid size for responsive design
export const calculateResponsiveGridSize = (
  windowWidth: number
): { rows: number; cols: number } => {
  if (windowWidth < 768) {
    // Mobile
    return { rows: 15, cols: 25 };
  } else if (windowWidth < 1024) {
    // Tablet
    return { rows: 20, cols: 40 };
  } else {
    // Desktop
    return { rows: 25, cols: 50 };
  }
};
