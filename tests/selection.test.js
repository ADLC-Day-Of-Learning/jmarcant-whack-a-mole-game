import { describe, expect, it } from 'vitest';
import { nextSelectedHole } from '../src/game/selection.js';
import { GRID_ROWS, GRID_COLS } from '../src/game/constants.js';

describe('nextSelectedHole', () => {
  it('moves right within a row', () => {
    expect(nextSelectedHole(0, 1, 0, GRID_ROWS, GRID_COLS)).toBe(1);
    expect(nextSelectedHole(4, 1, 0, GRID_ROWS, GRID_COLS)).toBe(5);
  });

  it('moves left within a row', () => {
    expect(nextSelectedHole(2, -1, 0, GRID_ROWS, GRID_COLS)).toBe(1);
  });

  it('moves down between rows', () => {
    expect(nextSelectedHole(0, 0, 1, GRID_ROWS, GRID_COLS)).toBe(3);
    expect(nextSelectedHole(4, 0, 1, GRID_ROWS, GRID_COLS)).toBe(7);
  });

  it('moves up between rows', () => {
    expect(nextSelectedHole(8, 0, -1, GRID_ROWS, GRID_COLS)).toBe(5);
  });

  it('clamps at every edge of the grid', () => {
    expect(nextSelectedHole(0, -1, 0, GRID_ROWS, GRID_COLS)).toBe(0);
    expect(nextSelectedHole(0, 0, -1, GRID_ROWS, GRID_COLS)).toBe(0);
    expect(nextSelectedHole(2, 1, 0, GRID_ROWS, GRID_COLS)).toBe(2);
    expect(nextSelectedHole(6, 0, 1, GRID_ROWS, GRID_COLS)).toBe(6);
    expect(nextSelectedHole(8, 1, 0, GRID_ROWS, GRID_COLS)).toBe(8);
    expect(nextSelectedHole(8, 0, 1, GRID_ROWS, GRID_COLS)).toBe(8);
  });

  it('clamps diagonal moves that would leave the grid', () => {
    // Top-left corner moving up-left stays put.
    expect(nextSelectedHole(0, -1, -1, GRID_ROWS, GRID_COLS)).toBe(0);
    // Bottom-right corner moving down-right stays put.
    expect(nextSelectedHole(8, 1, 1, GRID_ROWS, GRID_COLS)).toBe(8);
  });

  it('keeps the column when moving vertically', () => {
    // Moving up from the top row is clamped and stays in place.
    expect(nextSelectedHole(1, 0, -1, GRID_ROWS, GRID_COLS)).toBe(1);
    expect(nextSelectedHole(2, 0, -1, GRID_ROWS, GRID_COLS)).toBe(2);
    // Moving up from the middle row keeps the column.
    expect(nextSelectedHole(5, 0, -1, GRID_ROWS, GRID_COLS)).toBe(2);
    expect(nextSelectedHole(7, 0, -1, GRID_ROWS, GRID_COLS)).toBe(4);
  });

  it('navigates correctly on non-square grids', () => {
    const rows = 2;
    const cols = 3;

    // Move right in top row: (0, 0) -> (0, 1)
    expect(nextSelectedHole(0, 1, 0, rows, cols)).toBe(1);

    // Move down to bottom row: (0, 2) -> (1, 2)
    expect(nextSelectedHole(2, 0, 1, rows, cols)).toBe(5);

    // Clamping at boundaries
    expect(nextSelectedHole(3, -1, 0, rows, cols)).toBe(3);

    // Ensure all transitions stay strictly within valid bounds [0, rows * cols - 1]
    const moves = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, -1],
    ];
    for (let idx = 0; idx < rows * cols; idx++) {
      for (const [dx, dy] of moves) {
        const next = nextSelectedHole(idx, dx, dy, rows, cols);
        expect(next).toBeGreaterThanOrEqual(0);
        expect(next).toBeLessThan(rows * cols);
      }
    }
  });

  it('navigates correctly when rows > cols on non-square grids', () => {
    const rows = 3;
    const cols = 2;

    // (1, 1) [index 3] moving down -> (2, 1) [index 5]
    expect(nextSelectedHole(3, 0, 1, rows, cols)).toBe(5);

    for (let idx = 0; idx < rows * cols; idx++) {
      const nextDown = nextSelectedHole(idx, 0, 1, rows, cols);
      expect(nextDown).toBeGreaterThanOrEqual(0);
      expect(nextDown).toBeLessThan(rows * cols);
    }
  });
});
