import React, { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Board() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("");
  const [turn, setTurn] = useState("X");
  const [gameId, setGameId] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, searching, playing
  const [result, setResult] = useState(null); // X, O, or draw

  useEffect(() => {
    socket.on("startGame", (data) => {
      setGameId(data.gameId);
      setPlayer(data.player);
      setBoard(Array(9).fill(null));
      setTurn("X"); // Always reset turn to X for new game
      setStatus("playing");
      setResult(null);
    });

    socket.on("update", ({ position, player }) => {
      setBoard((prev) => {
        const copy = [...prev];
        copy[position] = player;
        return copy;
      });
      setTurn((prev) => (prev === "X" ? "O" : "X"));
    });

    socket.on("gameOver", (res) => {
      setResult(res);
    });

    return () => {
      socket.off("startGame");
      socket.off("update");
      socket.off("gameOver");
    };
  }, []);

  const findMatch = () => {
    setStatus("searching");
    socket.emit("findMatch");
  };

  const handleClick = (i) => {
    if (board[i] || turn !== player || status !== 'playing' || result) return;
    socket.emit("move", { gameId, position: i });
  };

  const handleRematch = () => {
    setStatus("idle");
    setResult(null);
    setBoard(Array(9).fill(null));
    setGameId(null);
  };

  // Determine personalized message
  const getResultMessage = () => {
    if (!result) return "";
    if (result === "draw") return "It's a Draw!";
    if (result === player) return "🎉 You Won!";
    return "😔 You Lost!";
  };

  const getResultClass = () => {
    if (!result) return "";
    if (result === "draw") return "result-draw";
    if (result === player) return "result-win";
    return "result-loss";
  };

  if (status === "idle") {
    return (
      <div className="matchmaking-container">
        <button className="find-match-btn" onClick={findMatch}>
          Find Match
        </button>
      </div>
    );
  }

  if (status === "searching") {
    return (
        <div className="matchmaking-container">
            <div className="loader"></div>
            <p>Searching for opponent...</p>
        </div>
    );
  }

  return (
    <div className="game-board-container">
      {result && (
        <div className={`game-result-overlay ${getResultClass()}`}>
            <h2 className="result-message">{getResultMessage()}</h2>
            {result === "draw" && <p className="result-subtitle">Good game! Nobody wins this time.</p>}
            {result === player && <p className="result-subtitle">Congratulations! Your ELO has increased.</p>}
            {result !== player && result !== "draw" && <p className="result-subtitle">Better luck next time!</p>}
            <div className="result-buttons">
              <button className="rematch-btn" onClick={handleRematch}>
                🔄 Find New Match
              </button>
            </div>
        </div>
      )}
      <div className={`board-grid ${result ? 'game-over' : ''}`}>
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`board-cell ${cell ? "populated" : ""} ${cell === 'X' ? 'text-blue' : 'text-red'}`}
          >
            {cell}
          </div>
        ))}
      </div>
      {!result && (
        <div className="turn-indicator">
          {turn === player ? "Your Turn" : "Opponent's Turn"} ({player})
        </div>
      )}
    </div>
  );
}

