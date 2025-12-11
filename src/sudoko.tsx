import React, { useState, useEffect } from "react";

// Generate an empty board (2D array) filled with zeros.
function generateEmptyBoard(size: number): number[][] {
  return Array.from({ length: size }, () => new Array(size).fill(0));
}

const Sudoku: React.FC = () => {
  // "blockSize" represents the square root of the board dimension.
  // For a standard sudoku, blockSize = 3 (i.e. board is 9×9).
  const [blockSize, setBlockSize] = useState<number>(3);
  const gridSize = blockSize * blockSize;

  // "board" holds the sudoku board data.
  const [board, setBoard] = useState<number[][]>(generateEmptyBoard(gridSize));
  // "solveTime" holds the amount of time the algorithm took (in ms).
  const [solveTime, setSolveTime] = useState<number | null>(null);

  // Regenerate the board whenever the blockSize (and thus gridSize) changes.
  useEffect(() => {
    setBoard(generateEmptyBoard(gridSize));
    setSolveTime(null);
  }, [blockSize, gridSize]);

  // Handle changes in an individual sudoku cell.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const value = e.target.value;
    let newValue = 0;
    if (value !== "") {
      // Allow multi-digit numbers if the grid size > 9.
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 1 && num <= gridSize) {
        newValue = num;
      }
    }
    setBoard((prevBoard) =>
      prevBoard.map((r, rIdx) =>
        rIdx === row
          ? r.map((cell, cIdx) => (cIdx === col ? newValue : cell))
          : r
      )
    );
  };

  // Check if placing "num" at board[row][col] is a valid move.
  const isValid = (
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean => {
    const n = board.length;
    // Check the row and column.
    for (let x = 0; x < n; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }
    const regionSize = Math.sqrt(n);
    const startRow = Math.floor(row / regionSize) * regionSize;
    const startCol = Math.floor(col / regionSize) * regionSize;
    // Check the subgrid.
    for (let i = 0; i < regionSize; i++) {
      for (let j = 0; j < regionSize; j++) {
        if (board[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }
    return true;
  };

  // Backtracking solver for the sudoku.
  const solveSudoku = (board: number[][]): boolean => {
    const n = board.length;
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= n; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Handle the "Solve" button press—measure the algorithm’s execution time.
  const handleSolve = () => {
    const boardCopy = board.map((row) => [...row]);
    const startTime = performance.now();
    const solved = solveSudoku(boardCopy);
    const endTime = performance.now();

    if (solved) {
      setSolveTime(endTime - startTime);
      setBoard(boardCopy);
    } else {
      alert("No solution exists for the given sudoku!");
    }
  };

  // Handle changes in the blockSize input.
  // For this example, we only allow values between 2 and 5.
  const handleBlockSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 2) {
      value = 2;
    } else if (value > 5) {
      value = 5;
    }
    setBlockSize(value);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
      <h1 className='text-3xl font-bold mb-6'>Sudoku Solver & Timer</h1>
      {/* Configuration Section */}
      <div className='mb-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4'>
        <div className='flex items-center'>
          <label className='mr-2 font-semibold' htmlFor='blockSize'>
            Block Size (n):
          </label>
          <input
            id='blockSize'
            type='number'
            value={blockSize}
            onChange={handleBlockSizeChange}
            className='w-16 p-1 border border-gray-400 rounded'
            min={2}
            max={5}
          />
          <span className='ml-2 text-sm text-gray-600'>
            (Board will be {gridSize}×{gridSize})
          </span>
        </div>
        <button
          onClick={() => {
            setBoard(generateEmptyBoard(gridSize));
            setSolveTime(null);
          }}
          className='px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition'
        >
          Generate Board
        </button>
      </div>

      {/* Timer Display */}
      {solveTime !== null && (
        <p className='mb-4 font-semibold'>
          Algorithm Execution Time: {solveTime.toFixed(2)} ms
        </p>
      )}

      {/* Sudoku Grid */}
      <div
        className='grid gap-1 mb-6'
        style={{ gridTemplateColumns: `repeat(${gridSize}, 2.5rem)` }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type='text'
              value={cell === 0 ? "" : cell}
              onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
              className={`
                w-10 h-10 text-center text-lg border border-gray-500 bg-white outline-none
                ${
                  (rowIndex + 1) % blockSize === 0 && rowIndex !== gridSize - 1
                    ? "border-b-4"
                    : "border-b"
                }
                ${
                  (colIndex + 1) % blockSize === 0 && colIndex !== gridSize - 1
                    ? "border-r-4"
                    : "border-r"
                }
              `}
            />
          ))
        )}
      </div>

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        className='px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition'
      >
        Solve
      </button>
    </div>
  );
};

export default Sudoku;
