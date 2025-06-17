import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** Single Tic Tac Toe square button */
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? (value === "X" ? "Player X's move" : "Player O's move") : "Empty square"}
      disabled={Boolean(value)}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winnerLine }) {
  /** Main Tic Tac Toe board, renders 9 squares in grid. */
  function renderSquare(idx) {
    const highlight = winnerLine && winnerLine.includes(idx);
    return (
      <Square
        key={idx}
        value={squares[idx]}
        onClick={() => onSquareClick(idx)}
        highlight={highlight}
      />
    );
  }

  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function GameStatus({ currentPlayer, winner, isDraw }) {
  /** Status banner showing which player's turn, or win/draw status. */
  let message, color;
  if (winner) {
    message = `Winner: Player ${winner}`;
    color = "var(--color-primary)";
  } else if (isDraw) {
    message = "It's a draw!";
    color = "var(--color-secondary)";
  } else {
    message = `Turn: Player ${currentPlayer}`;
    color = "var(--color-accent)";
  }
  return (
    <div className="ttt-status" style={{ color }}>
      {message}
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns object: {player: "X" or "O", line: [i, j, k]} or null if no winner. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { player: squares[a], line };
    }
  }
  return null;
}

function getNextPlayer(squares) {
  // Returns "X" or "O" depending on board state.
  const xMoves = squares.filter(sq => sq === "X").length;
  const oMoves = squares.filter(sq => sq === "O").length;
  return xMoves === oMoves ? "X" : "O";
}

// PUBLIC_INTERFACE
function App() {
  /** Main Tic Tac Toe App */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const winnerData = calculateWinner(squares);
  const winner = winnerData ? winnerData.player : null;
  const winnerLine = winnerData ? winnerData.line : null;
  const isDraw = !winner && squares.every(s => s);

  const currentPlayer = getNextPlayer(squares);

  // --- Move handler
  function handleSquareClick(idx) {
    if (squares[idx] || winner) return; // can't click filled or finished
    const nextSquares = squares.slice();
    nextSquares[idx] = currentPlayer;
    setSquares(nextSquares);
  }

  // --- Reset game
  function handleReset() {
    setSquares(Array(9).fill(null));
  }

  return (
    <div className="app">
      <nav className="navbar light-navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: "var(--color-accent)" }}>◻</span> WebTicTacToe
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="ttt-hero">
            <h1 className="title" style={{ color: "var(--color-primary)" }}>
              Tic Tac Toe
            </h1>
            <div className="ttt-board-container">
              <Board squares={squares} onSquareClick={handleSquareClick} winnerLine={winnerLine} />
            </div>
            <GameStatus currentPlayer={currentPlayer} winner={winner} isDraw={isDraw} />
            <button className="btn btn-large ttt-reset-btn" onClick={handleReset}>
              Reset Game
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
