import type { AnimationSpeed } from '../algorithms/types';

// Get delay between animation frames based on speed
export const getAnimationDelay = (speed: AnimationSpeed): number => {
  switch (speed) {
    case 'slow':
      return 50;
    case 'normal':
      return 20;
    case 'fast':
      return 5;
    case 'instant':
      return 0;
    default:
      return 20;
  }
};

// Create animation frames for visited nodes
export const createVisitedAnimation = async (
  positions: { row: number; col: number }[],
  onFrame: (index: number) => void,
  delay: number
): Promise<void> => {
  if (delay === 0) {
    // Instant mode
    for (let i = 0; i < positions.length; i++) {
      onFrame(i);
    }
  } else {
    // Animated mode
    for (let i = 0; i < positions.length; i++) {
      onFrame(i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Create animation frames for path nodes
export const createPathAnimation = async (
  positions: { row: number; col: number }[],
  onFrame: (index: number) => void,
  delay: number
): Promise<void> => {
  if (delay === 0) {
    // Instant mode
    for (let i = 0; i < positions.length; i++) {
      onFrame(i);
    }
  } else {
    // Animated mode
    for (let i = 0; i < positions.length; i++) {
      onFrame(i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Easing function for smooth animations
export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// Linear interpolation
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};
