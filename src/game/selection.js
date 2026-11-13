// Keyboard hole selection for the game grid.

export function nextSelectedHole(selectedIndex, dx, dy, rows, cols) {
  const row = Math.floor(selectedIndex / cols);
  const col = selectedIndex % cols;
  const newRow = Math.min(rows - 1, Math.max(0, row + dy));
  const newCol = Math.min(cols - 1, Math.max(0, col + dx));
  return newRow * cols + newCol;
}
