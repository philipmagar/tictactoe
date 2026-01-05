import React, { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Board() {
  const [board,setBoard] = useState(Array(9).fill(null));
  const [player,setPlayer] = useState("");
  const [turn,setTurn] = useState("X");
  const [gameId,setGameId] = useState(null);

  useEffect(()=>{
    socket.on("startGame", data=>{
      setGameId(data.gameId);
      setPlayer(data.player);
      setBoard(Array(9).fill(null));
    });
    socket.on("update", ({position,player})=>{ setBoard(prev=>{ const copy=[...prev]; copy[position]=player; return copy; }); setTurn(prev=>prev==="X"?"O":"X"); });
    socket.on("gameOver", result=>{ alert(result==="draw"?"Draw!":`${result} wins!`); });
    return ()=>socket.off("startGame");
  },[]);

  const handleClick=(i)=>{ if(board[i] || turn!==player) return; socket.emit("move",{ gameId, position: i }); }

  return (
    <div className="board-grid">
      {board.map((cell,i)=>(
        <div key={i} onClick={()=>handleClick(i)} className={`board-cell ${cell ? 'populated' : ''}`}>
          {cell}
        </div>
      ))}
    </div>
  );
}

