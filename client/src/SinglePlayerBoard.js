import { useState, useEffect, useCallback } from "react";

export default function SinglePlayerBoard({ onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "draw";
  };

  const minimax = (squares, depth, isMaximizing) => {
    const result = checkWinner(squares);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          let score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          let score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = useCallback((squares) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        let score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }, []);

  const handleClick = (i) => {
    if (board[i] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsXNext(false);
    }
    // AI turn triggered by effect
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      // AI Turn (Computer is O)
      const timeoutId = setTimeout(() => {
        const aiMove = getBestMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          const result = checkWinner(newBoard);
          if (result) setWinner(result);
          setIsXNext(true);
        }
      }, 500); // Small delay for realism
      return () => clearTimeout(timeoutId);
    }
  }, [isXNext, winner, board, getBestMove]);

  return (
    <div className="single-player-container">
      <div className="game-status">
        {winner ? (
          <h2>{winner === 'draw' ? 'Draw!' : `${winner} Wins!`}</h2>
        ) : (
          <h2>Turn: {isXNext ? "You (X)" : "Computer (O)"}</h2>
        )}
        <button className="back-btn" onClick={onBack}>Back to Menu</button>
      </div>
      
      <div className="board-grid">
        {board.map((cell, i) => (
          <div 
            key={i} 
            className={`board-cell ${cell ? 'populated' : ''}`} 
            onClick={() => handleClick(i)}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <button className="restart-btn" onClick={() => {
          setBoard(Array(9).fill(null));
          setWinner(null);
          setIsXNext(true);
        }}>Play Again</button>
      )}
    </div>
  );
}
