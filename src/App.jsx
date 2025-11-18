import { useState, useEffect } from "react";
import "./App.css";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 });

  useEffect(() => {
    const stored = localStorage.getItem("ttt-score");
    if (stored) setScore(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ttt-score", JSON.stringify(score));
  }, [score]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(newSquares);
    if (winner) {
      setScore(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (!newSquares.includes(null)) {
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
    }
  }

  function resetBoard() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScore({ X: 0, O: 0, ties: 0 });
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) status = `Vencedor: ${winner}`;
  else if (!squares.includes(null)) status = "Empate!";
  else status = `Próximo jogador: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="game-area">
      <div className="board-and-info">
        <div className="board">
          {squares.map((value, index) => (
            <Square
              key={index}
              value={value}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        <div className="info">
          <h1>Jogo da Velha - React</h1>
          <div className="status">{status}</div>

          <div className="controls">
            <button onClick={resetBoard}>Reiniciar Rodada</button>
            <button onClick={resetGame}>Reiniciar Jogo (zerar placar)</button>
          </div>

          <div className="scoreboard">
            <h3>Placar</h3>
            <p>X: {score.X} — O: {score.O} — Empates: {score.ties}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function App() {
  return (
    <div className="app">
      <Board />
    </div>
  );
}
