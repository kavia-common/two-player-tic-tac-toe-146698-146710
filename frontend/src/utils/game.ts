export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[]; // 9 cells
export type WinResult =
  | { winner: Player; line: number[] }
  | { winner: null; line: null };

export const WIN_LINES: number[][] = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export function checkWinner(board: BoardState): WinResult {
  /** Checks if a player has won given a 3x3 board (array of length 9).
   * Returns { winner: 'X' | 'O', line: number[] } if win, otherwise { winner: null, line: null }.
   */
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export function isDraw(board: BoardState): boolean {
  /** Returns true if the board is full and there is no winner. */
  const { winner } = checkWinner(board);
  return !winner && board.every((c) => c !== null);
}

// PUBLIC_INTERFACE
export function getNextPlayer(current: Player): Player {
  /** Toggle turn between X and O. */
  return current === 'X' ? 'O' : 'X';
}

// PUBLIC_INTERFACE
export function emptyBoard(): BoardState {
  /** Returns a fresh, empty 3x3 board as a 1D array (length 9). */
  return Array<CellValue>(9).fill(null);
}
