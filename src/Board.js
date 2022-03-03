import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 7, chanceLightStartsOn = .2 }) {
  const [board, setBoard] = useState(createBoard());

  /** get number of lit cells in matrix */
  function getNumLit() {
    let litCells = 0;
    board.map(row => row.map(cell => (cell) ? litCells = litCells + 1 : null));
    return litCells;
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      const row = [];
      for (let x = 0; x < ncols; x++) {
        const lightOn = (Math.random() < chanceLightStartsOn);
        row.push(lightOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /** if no lit cells in matrix, return true, else false */
  function hasWon() {
    return (getNumLit() === 0);
  }

  /** flip cell at coordinate and all adjacent cells
   * 
   * accepts coord string "y-x" where y is row and x is col
   * 
   * returns updated board
   */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = board.map(row => row.map(cell => cell))

      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  const won = hasWon();

  return (
    <table>
      <tbody>
        {won && <p>You've won!</p>}
        {!won && board.map(
          (row, y) => 
            <tr key={y}>{row.map(
              (cell, x) =>
                <Cell 
                  key={`${y}-${x}`} 
                  flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)} 
                  isLit={cell} 
                />)}
            </tr>)
        }
      </tbody>
    </table>
  );

}

export default Board;
